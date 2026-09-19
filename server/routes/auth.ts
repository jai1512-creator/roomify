import crypto from "node:crypto"
import { Router, type Request, type Response } from "express"
import {
  clearSessionCookie,
  createSession,
  destroySession,
  extractSessionId,
  hashPassword,
  setSessionCookie,
  toSafeUser,
  validateSession,
  verifyPassword,
} from "../auth.js"
import { type DbUser, getDatabase } from "../db.js"

export function createAuthRouter() {
  const router = Router()

  router.post("/auth/signup", async (request: Request, response: Response) => {
    try {
      const { name, email, password, confirmPassword } = request.body || {}

      if (!name || typeof name !== "string" || name.trim().length < 2) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Full name must be at least 2 characters.",
          },
        })
        return
      }

      if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Please provide a valid email address.",
          },
        })
        return
      }

      if (!password || typeof password !== "string" || password.length < 8) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Password must be at least 8 characters long.",
          },
        })
        return
      }

      if (password !== confirmPassword) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Passwords do not match.",
          },
        })
        return
      }

      const normalizedEmail = email.trim().toLowerCase()
      const db = getDatabase()

      // Check for existing user
      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(normalizedEmail)
      if (existing) {
        response.status(409).json({
          error: {
            code: "EMAIL_IN_USE",
            message: "An account with this email address already exists.",
          },
        })
        return
      }

      const userId = crypto.randomUUID()
      const passwordHash = hashPassword(password)
      const createdAt = new Date().toISOString()

      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(userId, name.trim(), normalizedEmail, passwordHash, createdAt)

      const safeUser = {
        id: userId,
        name: name.trim(),
        email: normalizedEmail,
        createdAt,
      }

      // Automatically create a session and set cookie
      const { sessionId, expiresAt } = createSession(userId)
      setSessionCookie(response, sessionId, expiresAt)

      response.status(201).json({ user: safeUser })
    } catch (error) {
      console.error("Signup error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to create account. Please try again.",
        },
      })
    }
  })

  router.post("/auth/login", async (request: Request, response: Response) => {
    try {
      const { email, password } = request.body || {}

      if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Email and password are required.",
          },
        })
        return
      }

      const normalizedEmail = email.trim().toLowerCase()
      const db = getDatabase()

      const userRow = db
        .prepare("SELECT id, name, email, password_hash, created_at FROM users WHERE email = ?")
        .get(normalizedEmail) as DbUser | undefined

      if (!userRow || !verifyPassword(password, userRow.password_hash)) {
        response.status(401).json({
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password.",
          },
        })
        return
      }

      const { sessionId, expiresAt } = createSession(userRow.id)
      setSessionCookie(response, sessionId, expiresAt)

      response.status(200).json({ user: toSafeUser(userRow) })
    } catch (error) {
      console.error("Login error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to log in. Please try again.",
        },
      })
    }
  })

  router.post("/auth/logout", (request: Request, response: Response) => {
    const sessionId = extractSessionId(request)
    if (sessionId) {
      destroySession(sessionId)
    }
    clearSessionCookie(response)
    response.status(200).json({ success: true })
  })

  router.get("/auth/me", (request: Request, response: Response) => {
    const sessionId = extractSessionId(request)
    if (!sessionId) {
      response.status(200).json({ user: null })
      return
    }

    const user = validateSession(sessionId)
    response.status(200).json({ user })
  })

  return router
}
