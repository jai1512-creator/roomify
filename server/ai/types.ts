import type { DesignSelections } from "../../shared/designOptions.js"

export type { DesignSelections }

export interface UploadedRoomImage {
  buffer: Buffer
  mimeType: "image/jpeg" | "image/png"
  filename: string
}

export interface TransformInput {
  image: UploadedRoomImage
  selections: DesignSelections
}

export interface ImageGenerationResult {
  generatedImageUrl: string
}

/** A provider can be swapped without changing the API route. */
export interface ImageProvider {
  transform(input: TransformInput): Promise<ImageGenerationResult>
}
