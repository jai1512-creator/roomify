import sharp from "sharp"
import { AIConfigurationError, AIProviderError } from "../errors.js"
import { buildOpenAIImageEditPrompt } from "./prompt.js"
import type { ImageGenerationResult, ImageProvider, TransformInput } from "./types.js"

const DEFAULT_API_BASE_URL = "https://api.openai.com/v1"
export const DEFAULT_OPENAI_MODEL = "gpt-image-2.5-sunburst"
const PROVIDER_TIMEOUT_MS = 120_000

export interface OpenAICompatibleProviderOptions {
  apiKey: string
  baseUrl: string
  imageModel: string
}

type ProviderPayload = {
  data?: Array<{
    url?: unknown
    b64_json?: unknown
  }>
  error?: {
    code?: string
    message?: string
    type?: string
  }
}

function endpointFor(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/+$/, "")
  return normalized.endsWith("/images/edits") ? normalized : `${normalized}/images/edits`
}

function extensionFor(mimeType: "image/jpeg" | "image/png"): string {
  return mimeType === "image/png" ? "png" : "jpg"
}

function imageUrlFromPayload(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") {
    return undefined
  }

  const first = (payload as ProviderPayload).data?.[0]
  if (!first || typeof first !== "object") {
    return undefined
  }

  if (typeof first.url === "string" && first.url.length > 0) {
    return first.url
  }

  if (typeof first.b64_json === "string" && first.b64_json.length > 0) {
    return `data:image/png;base64,${first.b64_json}`
  }

  return undefined
}

/**
 * Calculates optimal output dimensions preserving the original image's aspect ratio.
 * For room photography, landscape (e.g. 1536x1024) is favored when the input image is wide.
 */
async function calculateOptimalImageSize(buffer: Buffer, model: string): Promise<string> {
  if (model.toLowerCase().includes("dall-e-2")) {
    return "1024x1024"
  }

  try {
    const meta = await sharp(buffer).metadata()
    const width = meta.width ?? 1024
    const height = meta.height ?? 1024

    const ratio = width / height
    if (ratio >= 1.2) {
      return "1536x1024" // Landscape room photography
    }
    if (ratio <= 0.83) {
      return "1024x1536" // Portrait room photography
    }
    return "1024x1024"
  } catch {
    return "1024x1024"
  }
}

/**
 * First-class OpenAI image editing provider using /v1/images/edits.
 * Passes the source room image to redesign the space while preserving architecture,
 * geometry, and perspective.
 *
 * Cost-aware: strictly generates 1 image per request (n=1) and avoids automatic retries.
 */
export class OpenAICompatibleImageProvider implements ImageProvider {
  public readonly apiKey: string
  public readonly baseUrl: string
  public readonly imageModel: string

  public constructor(options: OpenAICompatibleProviderOptions) {
    this.apiKey = options.apiKey
    this.baseUrl = options.baseUrl
    this.imageModel = options.imageModel
  }

  public async transform(input: TransformInput): Promise<ImageGenerationResult> {
    const size = await calculateOptimalImageSize(input.image.buffer, this.imageModel)
    const prompt = buildOpenAIImageEditPrompt(input.selections)

    // Ensure source image is a clean, correctly formatted PNG for the OpenAI /images/edits endpoint
    const pngBuffer = await sharp(input.image.buffer).png().toBuffer()
    const form = new FormData()
    const image = new Blob([new Uint8Array(pngBuffer)], { type: "image/png" })

    form.append("model", this.imageModel)
    form.append("prompt", prompt)
    form.append("image", image, "room.png")
    form.append("n", "1")
    form.append("size", size)
    if (!this.imageModel.toLowerCase().includes("dall-e-2")) {
      form.append("quality", "high")
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(endpointFor(this.baseUrl), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
        body: form,
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new AIProviderError("The image provider took too long to respond. Please try again.", 504)
      }

      throw new AIProviderError("Roomify could not reach the OpenAI image service. Please check your connection and try again.", 504)
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      let errorBody: ProviderPayload | undefined
      try {
        errorBody = (await response.json()) as ProviderPayload
      } catch {
        // Response was not JSON
      }

      const errCode = errorBody?.error?.code
      const errType = errorBody?.error?.type
      const errMsg = errorBody?.error?.message ?? ""

      // Log server-side diagnostic info without leaking the API key
      console.error(`OpenAI API error [status ${response.status}]:`, {
        status: response.status,
        code: errCode,
        type: errType,
        message: errMsg,
      })

      if (response.status === 401 || response.status === 403) {
        throw new AIProviderError(
          "The configured OpenAI API key was rejected. Check the server OPENAI_API_KEY configuration.",
          502
        )
      }

      if (
        response.status === 429 ||
        errCode === "insufficient_quota" ||
        errCode === "credit_balance_exhausted" ||
        errType === "insufficient_quota" ||
        errMsg.toLowerCase().includes("quota") ||
        errMsg.toLowerCase().includes("credits") ||
        errMsg.toLowerCase().includes("billing")
      ) {
        if (
          errCode === "insufficient_quota" ||
          errCode === "credit_balance_exhausted" ||
          errMsg.toLowerCase().includes("quota") ||
          errMsg.toLowerCase().includes("credits")
        ) {
          throw new AIProviderError(
            "The configured OpenAI account has insufficient credits or has exceeded its quota. Please check your OpenAI billing balance.",
            503
          )
        }
        throw new AIProviderError(
          "The OpenAI image service is currently busy or rate limited. Please wait a moment and try again.",
          429
        )
      }

      if (response.status === 400) {
        // If modern parameters like input_fidelity or size were rejected by an older model/proxy,
        // retry once with standard 1024x1024 and minimal parameters
        if (size !== "1024x1024" || errMsg.includes("size") || errMsg.includes("fidelity")) {
          console.warn("OpenAI rejected custom size/fidelity parameters, falling back to standard 1024x1024...")
          return this.fallbackSquareTransform(input, prompt)
        }

        throw new AIProviderError(
          "OpenAI could not process this image transformation. Please try uploading a different clear photo.",
          400
        )
      }

      throw new AIProviderError(
        "The OpenAI image provider could not complete this transformation. Please try again.",
        502
      )
    }

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      throw new AIProviderError("The image provider returned an invalid response. Please try again.")
    }

    const generatedImageUrl = imageUrlFromPayload(payload)
    if (!generatedImageUrl) {
      throw new AIProviderError("The image provider did not return a generated image. Please try again.")
    }

    return { generatedImageUrl }
  }

  /**
   * Fallback for models or gateways that strictly enforce 1024x1024 without fidelity parameters.
   */
  private async fallbackSquareTransform(input: TransformInput, prompt: string): Promise<ImageGenerationResult> {
    const form = new FormData()
    const image = new Blob([new Uint8Array(input.image.buffer)], { type: input.image.mimeType })

    form.append("model", this.imageModel)
    form.append("prompt", prompt)
    form.append("image", image, `room.${extensionFor(input.image.mimeType)}`)
    form.append("n", "1")
    form.append("size", "1024x1024")

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), PROVIDER_TIMEOUT_MS)

    let response: Response
    try {
      response = await fetch(endpointFor(this.baseUrl), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
        },
        body: form,
        signal: controller.signal,
      })
    } catch {
      throw new AIProviderError("Roomify could not reach the OpenAI image service. Please try again.", 504)
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      console.error("OpenAI fallback transform failed with status:", response.status)
      throw new AIProviderError("The image provider could not complete this transformation. Please try again.", 502)
    }

    const payload = await response.json()
    const generatedImageUrl = imageUrlFromPayload(payload)
    if (!generatedImageUrl) {
      throw new AIProviderError("The image provider did not return a generated image. Please try again.")
    }

    return { generatedImageUrl }
  }
}

/**
 * Construct this inside a request path rather than at boot time. That keeps
 * the API online and able to return a clear 503 when a local .env has no key.
 */
export function createImageProviderFromEnvironment(env: NodeJS.ProcessEnv = process.env): ImageProvider {
  const apiKey = env.OPENAI_API_KEY?.trim() || env.AI_API_KEY?.trim()

  if (!apiKey) {
    throw new AIConfigurationError(
      "Image generation is not configured. Add OPENAI_API_KEY to the server environment and try again."
    )
  }

  const baseUrl = env.OPENAI_API_BASE_URL?.trim() || env.AI_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL
  const imageModel = env.OPENAI_IMAGE_MODEL?.trim() || env.AI_IMAGE_MODEL?.trim() || DEFAULT_OPENAI_MODEL

  return new OpenAICompatibleImageProvider({ apiKey, baseUrl, imageModel })
}
