import {
  BUDGETS,
  LIGHTING_OPTIONS,
  MAX_IMAGE_BYTES,
  MOODS,
  PALETTES,
  ROOM_TYPES,
  STYLES,
  SUPPORTED_IMAGE_TYPES,
  type DesignSelections,
} from "../shared/designOptions.js"
import type { UploadedRoomImage } from "./ai/types.js"
import { UnsupportedMediaTypeError, ValidationError } from "./errors.js"

export { MAX_IMAGE_BYTES, ROOM_TYPES, STYLES, MOODS, PALETTES, BUDGETS, LIGHTING_OPTIONS }

export const SUPPORTED_UPLOAD_MIME_TYPES = new Set<string>(SUPPORTED_IMAGE_TYPES)

type MultipartBody = Record<string, unknown>

function readString(body: MultipartBody, field: string): string {
  const value = body[field]

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required.`)
  }

  return value.trim()
}

function readOptionalString(body: MultipartBody, field: string): string | undefined {
  const value = body[field]

  if (value === undefined || value === "") {
    return undefined
  }

  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be a single value.`)
  }

  return value.trim()
}

function readEnum<T extends readonly string[]>(body: MultipartBody, field: string, values: T): T[number] {
  const value = readString(body, field)

  if (!(values as readonly string[]).includes(value)) {
    throw new ValidationError(`${field} must be one of: ${values.join(", ")}.`)
  }

  return value as T[number]
}

function readOptionalEnum<T extends readonly string[]>(body: MultipartBody, field: string, values: T): T[number] | undefined {
  const value = readOptionalString(body, field)

  if (value === undefined) {
    return undefined
  }

  if (!(values as readonly string[]).includes(value)) {
    throw new ValidationError(`${field} must be one of: ${values.join(", ")}.`)
  }

  return value as T[number]
}

export function validateSelections(body: MultipartBody): DesignSelections {
  const lighting = readOptionalEnum(body, "lighting", LIGHTING_OPTIONS)

  return {
    roomType: readEnum(body, "roomType", ROOM_TYPES),
    style: readEnum(body, "style", STYLES),
    mood: readEnum(body, "mood", MOODS),
    palette: readEnum(body, "palette", PALETTES),
    budget: readEnum(body, "budget", BUDGETS),
    ...(lighting ? { lighting } : {}),
  }
}

function isPng(buffer: Buffer): boolean {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
  return buffer.length >= signature.length && signature.every((byte, index) => buffer[index] === byte)
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
}

/**
 * Trust image bytes, not a user-provided MIME type or extension.  Multer's
 * MIME filter rejects obvious bad uploads before this point; this check closes
 * the renamed-file loophole.
 */
export function validateUploadedRoomImage(file: Express.Multer.File | undefined): UploadedRoomImage {
  if (!file) {
    throw new ValidationError("Upload a room image before transforming it.")
  }

  if (file.size <= 0 || file.buffer.length === 0) {
    throw new ValidationError("The uploaded image is empty.")
  }

  if (file.size > MAX_IMAGE_BYTES || file.buffer.length > MAX_IMAGE_BYTES) {
    throw new ValidationError("The uploaded image must be 10 MB or smaller.")
  }

  if (isPng(file.buffer)) {
    return {
      buffer: file.buffer,
      mimeType: "image/png",
      filename: file.originalname || "room.png",
    }
  }

  if (isJpeg(file.buffer)) {
    return {
      buffer: file.buffer,
      mimeType: "image/jpeg",
      filename: file.originalname || "room.jpg",
    }
  }

  throw new UnsupportedMediaTypeError("The uploaded file is not a valid JPG, JPEG, or PNG image.")
}
