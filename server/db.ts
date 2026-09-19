import { DatabaseSync } from "node:sqlite"
import fs from "node:fs"
import path from "node:path"

export interface DbUser {
  id: string
  name: string
  email: string
  password_hash: string
  created_at: string
}

export interface DbSession {
  id: string
  user_id: string
  expires_at: number
  created_at: string
}

export interface DbDesign {
  id: string
  user_id: string
  before_image_path: string
  after_image_path: string
  before_image_url: string
  after_image_url: string
  room_type: string
  style: string
  mood: string
  palette: string
  budget: string
  lighting: string | null
  created_at: string
}

let dbInstance: DatabaseSync | null = null

export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance
  }

  const dbDir = path.resolve(process.cwd(), "data")
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const dbPath = process.env.DATABASE_PATH || path.resolve(dbDir, "roomify.db")
  const db = new DatabaseSync(dbPath)

  // Enable WAL mode for high concurrency and resilience
  db.exec("PRAGMA journal_mode = WAL;")
  db.exec("PRAGMA foreign_keys = ON;")

  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS designs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      before_image_path TEXT NOT NULL,
      after_image_path TEXT NOT NULL,
      before_image_url TEXT NOT NULL,
      after_image_url TEXT NOT NULL,
      room_type TEXT NOT NULL,
      style TEXT NOT NULL,
      mood TEXT NOT NULL,
      palette TEXT NOT NULL,
      budget TEXT NOT NULL,
      lighting TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    CREATE INDEX IF NOT EXISTS idx_designs_user ON designs(user_id, created_at DESC);
  `)

  dbInstance = db
  return db
}
