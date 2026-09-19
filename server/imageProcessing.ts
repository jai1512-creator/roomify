import sharp from "sharp"
import type { UploadedRoomImage } from "./ai/types.js"

export const MAX_TRANSFORM_DIMENSION = 1024
export const INPAINT_DIMENSION = 512

/**
 * Optimizes the uploaded room image:
 * - Automatically rotates according to EXIF orientation.
 * - Downscales large uploads so the longest edge is at most MAX_TRANSFORM_DIMENSION
 *   while preserving the exact aspect ratio (without upscaling smaller images).
 * - Compresses slightly for fast network transfer to AI providers while preserving fidelity.
 */
export async function optimizeRoomImage(image: UploadedRoomImage): Promise<UploadedRoomImage> {
  const pipeline = sharp(image.buffer).rotate()
  const metadata = await pipeline.metadata()

  const width = metadata.width ?? 1024
  const height = metadata.height ?? 1024
  const isLandscape = width >= height

  const needsResize = Math.max(width, height) > MAX_TRANSFORM_DIMENSION

  let transformer = pipeline
  if (needsResize) {
    transformer = transformer.resize({
      width: isLandscape ? MAX_TRANSFORM_DIMENSION : undefined,
      height: !isLandscape ? MAX_TRANSFORM_DIMENSION : undefined,
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  if (image.mimeType === "image/png") {
    const buffer = await transformer.png({ compressionLevel: 8 }).toBuffer()
    return {
      buffer,
      mimeType: "image/png",
      filename: image.filename,
    }
  }

  const buffer = await transformer.jpeg({ quality: 88, mozjpeg: true }).toBuffer()
  return {
    buffer,
    mimeType: "image/jpeg",
    filename: image.filename,
  }
}

/**
 * Generates an inpainting image and mask.
 * When combined with a calibrated diffusion strength (0.4 - 0.45), this preserves
 * all existing room furniture, geometry, and layout while restyling materials and lighting.
 */
export async function prepareInpaintingInputs(image: UploadedRoomImage, targetDimension = INPAINT_DIMENSION): Promise<{
  imageBuffer: Buffer
  maskBuffer: Buffer
}> {
  const imageBuffer = await sharp(image.buffer)
    .rotate()
    .resize(targetDimension, targetDimension, { fit: "cover" })
    .png()
    .toBuffer()

  const maskBuffer = await sharp({
    create: {
      width: targetDimension,
      height: targetDimension,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  return { imageBuffer, maskBuffer }
}
