import crypto from "node:crypto"
import type { NextFunction, Request, Response } from "express"
import { type DbUser, getDatabase } from "./db.js"

export interface SafeUser {
  id: string
  name: string
  email: string
  createdAt: string
}

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser
      sessionId?: string
    }
  }
}

export const SESSION_COOKIE_NAME = "roomify_session"
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

export function toSafeUser(user: DbUser): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString("hex")}`
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":")
  if (parts.length !== 2) {
    return false
  }

  const [salt, key] = parts
  const keyBuffer = Buffer.from(key, "hex")
  const derivedKey = crypto.scryptSync(password, salt, 64)

  return crypto.timingSafeEqual(keyBuffer, derivedKey)
}

export function createSession(userId: string): { sessionId: string; expiresAt: number } {
  const db = getDatabase()
  const sessionId = crypto.randomBytes(32).toString("hex")
  const expiresAt = Date.now() + SESSION_TTL_MS
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(sessionId, userId, expiresAt, createdAt)

  return { sessionId, expiresAt }
}

export function validateSession(sessionId: string): SafeUser | null {
  if (!sessionId || typeof sessionId !== "string") {
    return null
  }

  const db = getDatabase()
  const now = Date.now()

  const stmt = db.prepare(`
    SELECT users.id, users.name, users.email, users.created_at, users.password_hash
    FROM sessions
    JOIN users ON sessions.user_id = users.id
    WHERE sessions.id = ? AND sessions.expires_at > ?
  `)

  const row = stmt.get(sessionId, now) as DbUser | undefined
  if (!row) {
    return null
  }

  return toSafeUser(row)
}

export function destroySession(sessionId: string): void {
  if (!sessionId) return
  const db = getDatabase()
  const stmt = db.prepare("DELETE FROM sessions WHERE id = ?")
  stmt.run(sessionId)
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {}
  if (!cookieHeader) return list

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=")
    const name = parts.shift()?.trim()
    if (name) {
      list[name] = decodeURIComponent(parts.join("=").trim())
    }
  })

  return list
}

export function setSessionCookie(response: Response, sessionId: string, expiresAt: number): void {
  const maxAgeSeconds = Math.floor((expiresAt - Date.now()) / 1000)
  const isSecure = process.env.NODE_ENV === "production"
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSeconds}`,
  ]

  if (isSecure) {
    cookieParts.push("Secure")
  }

  response.setHeader("Set-Cookie", cookieParts.join("; "))
}

export function clearSessionCookie(response: Response): void {
  response.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
}

export function extractSessionId(request: Request): string | undefined {
  const cookies = parseCookies(request.headers.cookie)
  if (cookies[SESSION_COOKIE_NAME]) {
    return cookies[SESSION_COOKIE_NAME]
  }

  const authHeader = request.headers.authorization
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim()
  }

  return undefined
}

export function authenticate(request: Request, _response: Response, next: NextFunction): void {
  const sessionId = extractSessionId(request)
  if (sessionId) {
    const user = validateSession(sessionId)
    if (user) {
      request.user = user
      request.sessionId = sessionId
    }
  }
  next()
}

export function requireAuth(request: Request, response: Response, next: NextFunction): void {
  authenticate(request, response, () => {
    if (!request.user) {
      response.status(401).json({
        error: {
          code: "UNAUTHENTICATED",
          message: "You must be logged in to perform this action.",
        },
      })
      return
    }
    next()
  })
}
