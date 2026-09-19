import "dotenv/config"
import express, { type NextFunction, type Request, type Response } from "express"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { isAppError } from "./errors.js"
import { createTransformRouter } from "./routes/transform.js"
import { createAuthRouter } from "./routes/auth.js"
import { createDesignsRouter } from "./routes/designs.js"
import { resolveStorageDirectory } from "./storage.js"
import { getDatabase } from "./db.js"

function isMulterError(error: unknown): error is Error & { code?: string } {
  return error instanceof Error && error.name === "MulterError"
}

function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (isAppError(error)) {
    response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    })
    return
  }

  if (isMulterError(error)) {
    const tooLarge = error.code === "LIMIT_FILE_SIZE"
    response.status(tooLarge ? 413 : 400).json({
      error: {
        code: tooLarge ? "IMAGE_TOO_LARGE" : "UPLOAD_ERROR",
        message: tooLarge
          ? "The uploaded image must be 10 MB or smaller."
          : "Upload one JPG, JPEG, or PNG image using the roomImage field.",
      },
    })
    return
  }

  // Keep operational details server-side. Errors from a provider may contain
  // request IDs or other implementation details that should not reach users.
  console.error("Unhandled API error", error)
  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong while transforming your room. Please try again.",
    },
  })
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

function createRateLimiter(maxRequests = 15, windowMs = 10 * 60 * 1000) {
  const ipMap = new Map<string, RateLimitEntry>()

  // Cleanup stale IP entries every 5 minutes
  setInterval(() => {
    const now = Date.now()
    for (const [ip, entry] of ipMap.entries()) {
      if (entry.resetAt <= now) {
        ipMap.delete(ip)
      }
    }
  }, 5 * 60 * 1000).unref()

  return (request: Request, response: Response, next: NextFunction) => {
    const ip =
      (request.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      request.socket.remoteAddress ||
      "unknown"

    const now = Date.now()
    let entry = ipMap.get(ip)

    if (!entry || entry.resetAt <= now) {
      entry = { count: 1, resetAt: now + windowMs }
      ipMap.set(ip, entry)
      next()
      return
    }

    if (entry.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
      response.setHeader("Retry-After", String(retryAfterSeconds))
      response.status(429).json({
        error: {
          code: "RATE_LIMITED",
          message: "You have submitted multiple room transformations recently. Please wait a few minutes before trying again.",
        },
      })
      return
    }

    entry.count += 1
    next()
  }
}

function resolveClientDirectory(): string {
  const thisDir = dirname(fileURLToPath(import.meta.url))
  const candidates = [
    resolve(thisDir, "..", "dist"),
    resolve(thisDir, "..", "..", "dist"),
    resolve(process.cwd(), "dist"),
  ]

  for (const candidate of candidates) {
    if (existsSync(resolve(candidate, "index.html"))) {
      return candidate
    }
  }

  return resolve(process.cwd(), "dist")
}

function addProductionStaticServing(app: express.Express) {
  const clientDirectory = resolveClientDirectory()
  const indexFile = resolve(clientDirectory, "index.html")

  if (!existsSync(indexFile)) {
    console.warn(`[Roomify] Frontend dist/index.html not found at ${indexFile}. Static serving disabled.`)
    return
  }

  // 1. Serve compiled static frontend assets (JS, CSS, images, etc.)
  app.use(express.static(clientDirectory))

  // 2. SPA fallback: serve index.html for all frontend GET routes
  // (e.g. /, /studio, /account, /designs, /login, /signup), without intercepting /api/*
  app.use((request, response, next) => {
    if (request.method !== "GET" || request.path.startsWith("/api")) {
      next()
      return
    }

    response.sendFile(indexFile, (error) => {
      if (error) {
        next(error)
      }
    })
  })
}

export function createApp() {
  const app = express()
  app.disable("x-powered-by")

  // Initialize SQLite database
  getDatabase()

  // Parse JSON bodies (up to 25MB for image saving)
  app.use(express.json({ limit: "25mb" }))

  // Static serving for saved designs
  app.use("/api/storage/designs", express.static(resolveStorageDirectory()))

  app.get("/api/health", (_request, response) => {
    response.status(200).json({ status: "ok", service: "roomify" })
  })

  const rateLimiter = createRateLimiter(15, 10 * 60 * 1000)

  app.use("/api/transform", rateLimiter)
  app.use("/api", createAuthRouter())
  app.use("/api", createDesignsRouter())
  app.use("/api", createTransformRouter())
  app.use("/api", (_request, response) => {
    response.status(404).json({
      error: {
        code: "API_NOT_FOUND",
        message: "API route not found.",
      },
    })
  })

  addProductionStaticServing(app)

  app.use((_request, response) => {
    response.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: "Route not found.",
      },
    })
  })

  app.use(errorHandler)
  return app
}

export function startServer() {
  const app = createApp()
  const configuredPort = Number.parseInt(process.env.PORT ?? "8787", 10)
  const port = Number.isFinite(configuredPort) && configuredPort > 0 ? configuredPort : 8787

  return app.listen(port, () => {
    console.log(`Roomify API listening on http://localhost:${port}`)
  })
}

const currentModulePath = fileURLToPath(import.meta.url)
const invokedModulePath = process.argv[1] ? resolve(process.argv[1]) : undefined

if (invokedModulePath === currentModulePath) {
  startServer()
}
