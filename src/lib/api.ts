import type { DesignSelections } from "../../shared/designOptions"

export interface TransformResponse {
  generatedImageUrl: string
  selections: DesignSelections
}

interface ApiErrorBody {
  error?: { code?: string; message?: string }
}

/** Thrown for every failure path: network, validation, or provider errors. */
export class ApiError extends Error {
  public readonly code: string
  public readonly status: number

  public constructor(message: string, code: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
}

export async function transformRoom(image: File, selections: DesignSelections): Promise<TransformResponse> {
  const form = new FormData()
  form.append("roomImage", image, image.name)
  form.append("roomType", selections.roomType)
  form.append("style", selections.style)
  form.append("mood", selections.mood)
  form.append("palette", selections.palette)
  form.append("budget", selections.budget)
  if (selections.lighting) {
    form.append("lighting", selections.lighting)
  }

  let response: Response
  try {
    response = await fetch("/api/transform", { method: "POST", body: form })
  } catch {
    throw new ApiError("Roomify couldn't reach the server. Check your connection and try again.", "NETWORK_ERROR", 0)
  }

  let payload: ApiErrorBody & Partial<TransformResponse> = {}
  try {
    payload = await response.json()
  } catch {
    // Some failure responses (proxies, dev-server crashes) aren't JSON.
    // Fall through to the generic message below.
  }

  if (!response.ok) {
    throw new ApiError(
      payload.error?.message ?? "Something went wrong while transforming your room. Please try again.",
      payload.error?.code ?? "UNKNOWN_ERROR",
      response.status
    )
  }

  if (!payload.generatedImageUrl) {
    throw new ApiError("The server returned an unexpected response. Please try again.", "INVALID_RESPONSE", response.status)
  }

  return { generatedImageUrl: payload.generatedImageUrl, selections: payload.selections ?? selections }
}
