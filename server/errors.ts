/**
 * Errors in this module are deliberately safe to return to the browser.  Do
 * not put provider response bodies, credentials, or stack traces in their
 * messages.
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string

  public constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
  }
}

export class ValidationError extends AppError {
  public constructor(message: string) {
    super(400, "VALIDATION_ERROR", message)
    this.name = "ValidationError"
  }
}

export class UnsupportedMediaTypeError extends AppError {
  public constructor(message = "Upload a JPG, JPEG, or PNG image.") {
    super(415, "UNSUPPORTED_IMAGE_TYPE", message)
    this.name = "UnsupportedMediaTypeError"
  }
}

export class AIConfigurationError extends AppError {
  public constructor(message = "Image generation is not configured. Add AI_API_KEY to the server environment and try again.") {
    super(503, "AI_NOT_CONFIGURED", message)
    this.name = "AIConfigurationError"
  }
}

export class AIProviderError extends AppError {
  /**
   * True only for transient failures worth retrying (a blank generation, a
   * malformed response). Auth, rate-limit, and timeout failures are false:
   * retrying those just wastes the user's time and the daily quota.
   */
  public readonly retryable: boolean

  public constructor(
    message = "The image provider could not complete this transformation. Please try again.",
    statusCode = 502,
    retryable = false
  ) {
    super(statusCode, "AI_PROVIDER_ERROR", message)
    this.name = "AIProviderError"
    this.retryable = retryable
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
