import fs from "node:fs"
import path from "node:path"

const DEFAULT_STORAGE_DIR = path.resolve(process.cwd(), "data", "storage", "designs")

export function resolveStorageDirectory(): string {
  const dir = process.env.STORAGE_DIR ? path.resolve(process.env.STORAGE_DIR) : DEFAULT_STORAGE_DIR
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  return dir
}

export interface SavedImagePair {
  beforeImagePath: string
  afterImagePath: string
  beforeImageUrl: string
  afterImageUrl: string
}

function parseImageData(data: string | Buffer): { buffer: Buffer; extension: string } {
  if (Buffer.isBuffer(data)) {
    return { buffer: data, extension: ".jpg" }
  }

  if (typeof data === "string" && data.startsWith("data:")) {
    const matches = data.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/)
    if (matches) {
      const ext = matches[1] === "png" ? ".png" : ".jpg"
      const buffer = Buffer.from(matches[2], "base64")
      return { buffer, extension: ext }
    }
  }

  // Raw base64 string
  return { buffer: Buffer.from(data, "base64"), extension: ".jpg" }
}

export function saveDesignImages(
  designId: string,
  beforeData: string | Buffer,
  afterData: string | Buffer
): SavedImagePair {
  const storageDir = resolveStorageDirectory()

  const beforeParsed = parseImageData(beforeData)
  const afterParsed = parseImageData(afterData)

  const beforeFilename = `${designId}-before${beforeParsed.extension}`
  const afterFilename = `${designId}-after${afterParsed.extension}`

  const beforeImagePath = path.join(storageDir, beforeFilename)
  const afterImagePath = path.join(storageDir, afterFilename)

  fs.writeFileSync(beforeImagePath, beforeParsed.buffer)
  fs.writeFileSync(afterImagePath, afterParsed.buffer)

  return {
    beforeImagePath,
    afterImagePath,
    beforeImageUrl: `/api/storage/designs/${beforeFilename}`,
    afterImageUrl: `/api/storage/designs/${afterFilename}`,
  }
}

export function deleteDesignImages(beforePath: string, afterPath: string): void {
  try {
    if (fs.existsSync(beforePath)) {
      fs.unlinkSync(beforePath)
    }
  } catch (err) {
    console.error(`Failed to delete before image at ${beforePath}:`, err)
  }

  try {
    if (fs.existsSync(afterPath)) {
      fs.unlinkSync(afterPath)
    }
  } catch (err) {
    console.error(`Failed to delete after image at ${afterPath}:`, err)
  }
}
