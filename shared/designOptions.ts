/**
 * The one place these option lists are defined. The Studio UI renders them
 * as choices, and the Express API validates incoming selections against the
 * exact same arrays (server/validation.ts) — so the client and server can
 * never quietly drift apart.
 */

export const ROOM_TYPES = ["Bedroom", "Living room", "Workspace", "Dining"] as const

export const STYLES = [
  "Minimal",
  "Japandi",
  "Modern",
  "Luxury",
  "Industrial",
  "Indian Contemporary",
  "Scandinavian",
  "Warm & Organic",
] as const

export const MOODS = ["Calm", "Warm", "Bright", "Dramatic"] as const

export const PALETTES = ["Neutral", "Earthy", "Monochrome", "Warm"] as const

export const BUDGETS = ["₹50K", "₹1L", "₹2L", "₹5L+"] as const

export const LIGHTING_OPTIONS = ["Natural", "Warm", "Ambient", "Bright"] as const

export type RoomType = (typeof ROOM_TYPES)[number]
export type Style = (typeof STYLES)[number]
export type Mood = (typeof MOODS)[number]
export type Palette = (typeof PALETTES)[number]
export type Budget = (typeof BUDGETS)[number]
export type Lighting = (typeof LIGHTING_OPTIONS)[number]

export interface DesignSelections {
  roomType: RoomType
  style: Style
  mood: Mood
  palette: Palette
  budget: Budget
  lighting?: Lighting
}

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"] as const
