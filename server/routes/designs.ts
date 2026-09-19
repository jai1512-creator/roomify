import crypto from "node:crypto"
import { Router, type Request, type Response } from "express"
import { requireAuth } from "../auth.js"
import { type DbDesign, getDatabase } from "../db.js"
import { deleteDesignImages, saveDesignImages } from "../storage.js"

function toDesignResponse(row: DbDesign) {
  return {
    id: row.id,
    userId: row.user_id,
    beforeImageUrl: row.before_image_url,
    afterImageUrl: row.after_image_url,
    roomType: row.room_type,
    style: row.style,
    mood: row.mood,
    palette: row.palette,
    budget: row.budget,
    lighting: row.lighting,
    createdAt: row.created_at,
  }
}

export function createDesignsRouter() {
  const router = Router()

  // 1. List designs for authenticated user ONLY
  router.get("/designs", requireAuth, (request: Request, response: Response) => {
    try {
      const db = getDatabase()
      const userId = request.user!.id

      const rows = db
        .prepare(`
          SELECT * FROM designs
          WHERE user_id = ?
          ORDER BY created_at DESC
        `)
        .all(userId) as unknown as DbDesign[]

      response.status(200).json({
        designs: rows.map(toDesignResponse),
      })
    } catch (error) {
      console.error("Fetch designs error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to load saved designs.",
        },
      })
    }
  })

  // 2. Get specific design by ID (verifying ownership)
  router.get("/designs/:id", requireAuth, (request: Request, response: Response) => {
    try {
      const db = getDatabase()
      const { id } = request.params
      const userId = request.user!.id

      const row = db.prepare("SELECT * FROM designs WHERE id = ?").get(id) as DbDesign | undefined

      if (!row) {
        response.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: "Design not found.",
          },
        })
        return
      }

      // Strict user authorization check
      if (row.user_id !== userId) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to view this design.",
          },
        })
        return
      }

      response.status(200).json({
        design: toDesignResponse(row),
      })
    } catch (error) {
      console.error("Fetch design by ID error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to load design.",
        },
      })
    }
  })

  // 3. Save a new design (authenticated)
  router.post("/designs", requireAuth, (request: Request, response: Response) => {
    try {
      const { beforeImage, afterImage, selections } = request.body || {}
      const userId = request.user!.id

      if (!beforeImage || !afterImage) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Both before and after images are required to save a design.",
          },
        })
        return
      }

      if (!selections || !selections.roomType || !selections.style) {
        response.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Design selections (roomType, style, mood, palette, budget) are required.",
          },
        })
        return
      }

      const designId = crypto.randomUUID()
      const { beforeImagePath, afterImagePath, beforeImageUrl, afterImageUrl } = saveDesignImages(
        designId,
        beforeImage,
        afterImage
      )

      const createdAt = new Date().toISOString()
      const db = getDatabase()

      db.prepare(`
        INSERT INTO designs (
          id, user_id, before_image_path, after_image_path,
          before_image_url, after_image_url, room_type,
          style, mood, palette, budget, lighting, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        designId,
        userId,
        beforeImagePath,
        afterImagePath,
        beforeImageUrl,
        afterImageUrl,
        selections.roomType,
        selections.style,
        selections.mood ?? "Calm",
        selections.palette ?? "Earthy",
        selections.budget ?? "₹50K",
        selections.lighting ?? null,
        createdAt
      )

      const savedDesign = {
        id: designId,
        userId,
        beforeImageUrl,
        afterImageUrl,
        roomType: selections.roomType,
        style: selections.style,
        mood: selections.mood ?? "Calm",
        palette: selections.palette ?? "Earthy",
        budget: selections.budget ?? "₹50K",
        lighting: selections.lighting ?? null,
        createdAt,
      }

      response.status(201).json({ design: savedDesign })
    } catch (error) {
      console.error("Save design error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to save design.",
        },
      })
    }
  })

  // 4. Delete a design (verifying ownership)
  router.delete("/designs/:id", requireAuth, (request: Request, response: Response) => {
    try {
      const db = getDatabase()
      const { id } = request.params
      const userId = request.user!.id

      const row = db.prepare("SELECT * FROM designs WHERE id = ?").get(id) as DbDesign | undefined

      if (!row) {
        response.status(404).json({
          error: {
            code: "NOT_FOUND",
            message: "Design not found.",
          },
        })
        return
      }

      // Strict user authorization check
      if (row.user_id !== userId) {
        response.status(403).json({
          error: {
            code: "FORBIDDEN",
            message: "You do not have permission to delete this design.",
          },
        })
        return
      }

      // Remove files from disk
      deleteDesignImages(row.before_image_path, row.after_image_path)

      // Remove row from DB
      db.prepare("DELETE FROM designs WHERE id = ?").run(id)

      response.status(200).json({ success: true })
    } catch (error) {
      console.error("Delete design error:", error)
      response.status(500).json({
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete design.",
        },
      })
    }
  })

  return router
}
