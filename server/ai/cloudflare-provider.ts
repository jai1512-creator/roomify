import sharp from "sharp"
import { AIConfigurationError, AIProviderError } from "../errors.js"
import { prepareInpaintingInputs } from "../imageProcessing.js"
import { buildPrompt, buildNegativePrompt } from "./prompt.js"
import type { ImageGenerationResult, ImageProvider, TransformInput } from "./types.js"

const DEFAULT_MODEL = "@cf/black-forest-labs/flux-2-klein-4b"
const DEFAULT_STRENGTH = 0.45
const DEFAULT_GUIDANCE = 7.5
/** SDXL on Workers AI caps num_steps at 20. */
const MAX_STEPS = 20
const DEFAULT_STEPS = 20
const PROVIDER_TIMEOUT_MS = 120_000
/**
 * Blank/near-blank responses are a known beta failure mode for the img2img
 * models, so a failed generation is retried once before giving up.
 */
const MAX_ATTEMPTS = 2
const MIN_PLAUSIBLE_IMAGE_BYTES = 2048

interface CloudflareProviderOptions {
  accountId: string
  apiToken: string
  model: string
  strength: number
  guidance: number
  steps: number
}

function endpointFor(accountId: string, model: string): string {
  return `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`
}

function readNumber(raw: string | undefined, fallback: number, min: number, max: number): number {
  if (!raw) {
    return fallback
  }

  const parsed = Number.parseFloat(raw)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(max, Math.max(min, parsed))
}

/**
 * Workers AI returns raw image bytes on success for legacy models and a JSON envelope
 * for modern models like FLUX.2 klein, or on failure.
 */
function isJsonResponse(response: Response): boolean {
  return (response.headers.get("content-type") ?? "").toLowerCase().includes("application/json")
}

async function calculateFluxDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  try {
    const meta = await sharp(buffer).metadata()
    const origW = meta.width ?? 1024
    const origH = meta.height ?? 1024
    const aspect = origW / origH

    if (aspect > 1.15) {
      // Landscape (e.g. 1024x768)
      const h = Math.round((1024 / aspect) / 16) * 16
      return { width: 1024, height: Math.min(1024, Math.max(512, h)) }
    } else if (aspect < 0.85) {
      // Portrait (e.g. 768x1024)
      const w = Math.round((1024 * aspect) / 16) * 16
      return { width: Math.min(1024, Math.max(512, w)), height: 1024 }
    } else {
      // Square
      return { width: 1024, height: 1024 }
    }
  } catch {
    return { width: 1024, height: 768 }
  }
}

/**
 * Calls Cloudflare Workers AI image models.
 * Defaults to `@cf/black-forest-labs/flux-2-klein-4b` for state-of-the-art room redesigns
 * preserving architecture while upgrading furniture and decor without blank walls.
 * Legacy SD models are retained for backward compatibility.
 */
export class CloudflareImageProvider implements ImageProvider {
  private readonly options: CloudflareProviderOptions

  public constructor(options: CloudflareProviderOptions) {
    this.options = options
  }

  public async transform(input: TransformInput): Promise<ImageGenerationResult> {
    let lastError: AIProviderError | undefined

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        return await this.requestOnce(input)
      } catch (error) {
        // Auth, rate limit, and timeout failures will not be fixed by a retry.
        if (error instanceof AIProviderError && !error.retryable) {
          throw error
        }

        lastError = error instanceof AIProviderError ? error : new AIProviderError()
      }
    }

    throw lastError ?? new AIProviderError()
  }

  private async requestOnce(input: TransformInput): Promise<ImageGenerationResult> {
    const isFluxModel = this.options.model.toLowerCase().includes("flux")
    const isInpaintingModel = this.options.model.toLowerCase().includes("inpaint")

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

    let response: Response
    try {
      if (isFluxModel) {
        const dimensions = await calculateFluxDimensions(input.image.buffer)
        const form = new FormData()
        form.append("prompt", buildPrompt(input.selections))
        form.append(
          "input_image_0",
          new Blob([new Uint8Array(input.image.buffer)], { type: input.image.mimeType || "image/jpeg" }),
          input.image.filename || "room.jpg"
        )
        form.append("width", String(dimensions.width))
        form.append("height", String(dimensions.height))

        console.log(
          `[Cloudflare] Requesting FLUX model ${this.options.model} (${dimensions.width}x${dimensions.height})`
        )

        response = await fetch(endpointFor(this.options.accountId, this.options.model), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
          },
          body: form,
          signal: controller.signal,
        })
      } else {
        let body: Record<string, unknown>
        if (isInpaintingModel) {
          const { imageBuffer, maskBuffer } = await prepareInpaintingInputs(input.image)
          body = {
            prompt: buildPrompt(input.selections),
            negative_prompt: buildNegativePrompt(input.selections.roomType),
            image: Array.from(imageBuffer),
            mask: Array.from(maskBuffer),
            strength: this.options.strength,
            guidance: this.options.guidance,
            num_steps: this.options.steps,
          }
        } else {
          body = {
            prompt: buildPrompt(input.selections),
            negative_prompt: buildNegativePrompt(input.selections.roomType),
            image_b64: input.image.buffer.toString("base64"),
            image: Array.from(input.image.buffer),
            strength: this.options.strength,
            guidance: this.options.guidance,
            num_steps: this.options.steps,
          }
        }

        response = await fetch(endpointFor(this.options.accountId, this.options.model), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.options.apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new AIProviderError("The image provider took too long to respond. Please try again.", 504)
      }

      throw new AIProviderError("Roomify could not reach the image provider. Please try again.", 504)
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[Cloudflare] Error HTTP ${response.status}:`, errText)
      if (response.status === 401 || response.status === 403) {
        throw new AIProviderError(
          "The configured image provider credentials were rejected. Check the server configuration.",
          502
        )
      }

      if (response.status === 429) {
        throw new AIProviderError(
          "Roomify has hit its image generation limit for now. Please try again later.",
          503
        )
      }

      throw new AIProviderError(undefined, 502, true)
    }

    // Check response content type: FLUX returns JSON { result: { image: "<base64>" } }
    if (isJsonResponse(response)) {
      const json = (await response.json()) as {
        result?: { image?: string }
        success?: boolean
        errors?: Array<{ code?: number; message?: string }>
      }

      if (json.result?.image) {
        const base64 = json.result.image
        return { generatedImageUrl: `data:image/jpeg;base64,${base64}` }
      }

      console.error("[Cloudflare] Error envelope:", JSON.stringify(json.errors ?? json))
      throw new AIProviderError("The image provider could not generate this image. Please try again.", 502, true)
    }

    // Binary octet stream (legacy SD models)
    const bytes = Buffer.from(await response.arrayBuffer())

    if (bytes.length < MIN_PLAUSIBLE_IMAGE_BYTES) {
      throw new AIProviderError("The image provider returned an empty image. Please try again.", 502, true)
    }

    const mimeType = (response.headers.get("content-type") ?? "image/png").split(";")[0].trim()

    return { generatedImageUrl: `data:${mimeType};base64,${bytes.toString("base64")}` }
  }
}

export function createCloudflareProviderFromEnvironment(
  env: NodeJS.ProcessEnv = process.env
): ImageProvider {
  const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim()
  const apiToken = env.CLOUDFLARE_API_TOKEN?.trim()

  if (!accountId || !apiToken) {
    throw new AIConfigurationError(
      "Image generation is not configured. Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to the server environment and try again."
    )
  }

  return new CloudflareImageProvider({
    accountId,
    apiToken,
    model: env.CLOUDFLARE_IMAGE_MODEL?.trim() || DEFAULT_MODEL,
    strength: readNumber(env.AI_STRENGTH, DEFAULT_STRENGTH, 0, 1),
    guidance: readNumber(env.AI_GUIDANCE, DEFAULT_GUIDANCE, 0, 20),
    steps: Math.round(readNumber(env.AI_STEPS, DEFAULT_STEPS, 1, MAX_STEPS)),
  })
}
