import { AIConfigurationError } from "../errors.js"
import { createCloudflareProviderFromEnvironment } from "./cloudflare-provider.js"
import { createImageProviderFromEnvironment as createOpenAICompatibleProvider } from "./openai-compatible-provider.js"
import type { ImageGenerationResult, ImageProvider, TransformInput } from "./types.js"

export const SUPPORTED_PROVIDERS = ["cloudflare", "openai"] as const
export type ProviderName = (typeof SUPPORTED_PROVIDERS)[number]

/**
 * Default provider name if no keys are found.
 */
export const DEFAULT_PROVIDER: ProviderName = "openai"

/**
 * Resilient image provider that tries a primary provider (e.g. OpenAI)
 * and automatically falls back to a secondary provider (e.g. Cloudflare)
 * if the primary encounters an error or quota exhaustion.
 */
export class FallbackImageProvider implements ImageProvider {
  public constructor(
    public readonly primary: ImageProvider,
    public readonly fallback: ImageProvider,
    public readonly primaryName: string,
    public readonly fallbackName: string
  ) {}

  public async transform(input: TransformInput): Promise<ImageGenerationResult> {
    try {
      return await this.primary.transform(input)
    } catch (primaryError) {
      const errMsg = primaryError instanceof Error ? primaryError.message : String(primaryError)
      console.warn(
        `[Roomify] Primary provider [${this.primaryName}] failed: ${errMsg}. Initiating fallback to [${this.fallbackName}]...`
      )
      try {
        const fallbackResult = await this.fallback.transform(input)
        console.log(`[Roomify] Successfully completed transformation using fallback provider [${this.fallbackName}].`)
        return fallbackResult
      } catch (fallbackError) {
        console.error(`[Roomify] Fallback provider [${this.fallbackName}] also failed:`, fallbackError)
        throw primaryError
      }
    }
  }
}

function resolveProviderName(env: NodeJS.ProcessEnv): ProviderName {
  const raw = env.AI_PROVIDER?.trim().toLowerCase()

  if (raw) {
    if (!(SUPPORTED_PROVIDERS as readonly string[]).includes(raw)) {
      throw new AIConfigurationError(
        `Image generation is not configured. AI_PROVIDER must be one of: ${SUPPORTED_PROVIDERS.join(", ")}.`
      )
    }
    return raw as ProviderName
  }

  // Prioritize OpenAI if OPENAI_API_KEY is configured
  if (env.OPENAI_API_KEY?.trim() || env.AI_API_KEY?.trim()) {
    return "openai"
  }

  if (env.CLOUDFLARE_ACCOUNT_ID?.trim() && env.CLOUDFLARE_API_TOKEN?.trim()) {
    return "cloudflare"
  }

  return DEFAULT_PROVIDER
}

/**
 * Built per request rather than at boot, so a missing key produces a clean
 * 503 from /api/transform instead of crashing the server on startup.
 */
export function createImageProviderFromEnvironment(
  env: NodeJS.ProcessEnv = process.env
): ImageProvider {
  const provider = resolveProviderName(env)

  const hasCloudflare = Boolean(env.CLOUDFLARE_ACCOUNT_ID?.trim() && env.CLOUDFLARE_API_TOKEN?.trim())

  if (provider === "cloudflare") {
    return createCloudflareProviderFromEnvironment(env)
  }

  // Provider is OpenAI
  const openAIProvider = createOpenAICompatibleProvider(env)
  if (hasCloudflare) {
    const cloudflareProvider = createCloudflareProviderFromEnvironment(env)
    return new FallbackImageProvider(openAIProvider, cloudflareProvider, "openai", "cloudflare")
  }

  return openAIProvider
}
