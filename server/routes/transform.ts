import { Router } from "express"
import multer from "multer"
import { createImageProviderFromEnvironment } from "../ai/provider-factory.js"
import type { ImageProvider } from "../ai/types.js"
import { UnsupportedMediaTypeError } from "../errors.js"
import { optimizeRoomImage } from "../imageProcessing.js"
import {
  MAX_IMAGE_BYTES,
  SUPPORTED_UPLOAD_MIME_TYPES,
  validateSelections,
  validateUploadedRoomImage,
} from "../validation.js"

export const ROOM_IMAGE_FIELD = "roomImage"

export interface TransformRouterOptions {
  createImageProvider?: () => ImageProvider
}

function makeUploadMiddleware() {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: MAX_IMAGE_BYTES,
      files: 1,
      fields: 8,
      fieldSize: 16 * 1024,
    },
    fileFilter: (_request, file, callback) => {
      if (!SUPPORTED_UPLOAD_MIME_TYPES.has(file.mimetype.toLowerCase())) {
        callback(new UnsupportedMediaTypeError())
        return
      }

      callback(null, true)
    },
  })
}

export function createTransformRouter(options: TransformRouterOptions = {}) {
  const router = Router()
  const upload = makeUploadMiddleware()
  const providerFactory = options.createImageProvider ?? createImageProviderFromEnvironment

  router.post("/transform", upload.single(ROOM_IMAGE_FIELD), async (request, response, next) => {
    try {
      const rawImage = validateUploadedRoomImage(request.file)
      const image = await optimizeRoomImage(rawImage)
      const selections = validateSelections(request.body as Record<string, unknown>)
      console.log(`[Roomify] Transforming room: ${selections.style} ${selections.roomType} (${image.filename}, ${image.buffer.length} bytes)`)
      const provider = providerFactory()
      const result = await provider.transform({ image, selections })

      response.status(200).json({
        generatedImageUrl: result.generatedImageUrl,
        selections,
      })
    } catch (error) {
      next(error)
    }
  })

  return router
}
