import type { DesignSelections } from "./types.js"

export interface RoomTypeProfile {
  primaryTitle: string
  primaryFurniture: string
  layoutInstructions: string
  lightingAndDecor: string
  forbiddenFurniture: string[]
}

export const ROOM_PROFILES: Record<string, RoomTypeProfile> = {
  dining: {
    primaryTitle: "DINING ROOM",
    primaryFurniture:
      "A dining table as the undeniable primary furniture piece, surrounded by a complete set of appropriately sized dining chairs (4 to 6 dining chairs arranged neatly around the table).",
    layoutInstructions:
      "Believable dining layout with generous circulation space for walking around the dining table. Add a complementary sideboard, buffet credenza, or dining storage against a wall where space permits. The dining setting must be the clear centerpiece of the room.",
    lightingAndDecor:
      "Dining-specific lighting featuring a hanging pendant fixture or modern chandelier centered directly above the dining table. Curated dining decor including a tasteful centerpiece (such as a ceramic bowl, artisan vase, or sculptural branch) and dining-appropriate wall art.",
    forbiddenFurniture: [
      "office desks",
      "office chairs",
      "computer workstations",
      "monitors and keyboards",
      "gaming setups",
      "bedroom beds",
      "nightstands",
      "sofas as primary furniture",
    ],
  },
  "living room": {
    primaryTitle: "LIVING ROOM",
    primaryFurniture:
      "A comfortable sofa or sectional seating arrangement as the primary anchor furniture, accompanied by a coffee table centered in front of the seating.",
    layoutInstructions:
      "Inviting living room conversation layout with accent lounge chairs, a low media console, credenza, or display shelving along an appropriate wall, and a large cohesive area rug defining the seating zone with clear walkways.",
    lightingAndDecor:
      "Layered living room lighting with floor lamps, table lamps, and warm ambient ceiling illumination. Living decor including curated throw pillows, folded textiles, art books on the coffee table, and indoor plants.",
    forbiddenFurniture: [
      "dining tables as primary furniture",
      "dining chair sets",
      "office workstation desks",
      "rolling office chairs",
      "bedroom beds",
      "wardrobes",
    ],
  },
  bedroom: {
    primaryTitle: "BEDROOM",
    primaryFurniture:
      "A full residential bed with an architectural headboard, dressed in tailored high-quality bedding, duvet, and accent pillows as the undeniable primary furniture.",
    layoutInstructions:
      "Bed centered against the main feature wall, flanked symmetrically or balanced with bedside tables or nightstands on both sides. A low dresser, wardrobe, or bench where spatially appropriate.",
    lightingAndDecor:
      "Restful bedroom lighting featuring bedside sconces or nightstand table lamps, soft ambient dimmable glow, cozy bedroom area rug beneath the bed, and calm art.",
    forbiddenFurniture: [
      "dining tables",
      "dining chairs",
      "office desks as primary furniture",
      "workstation setups",
      "large living room sofas as primary focal point",
    ],
  },
  workspace: {
    primaryTitle: "WORKSPACE",
    primaryFurniture:
      "A dedicated executive or modern work desk as the primary work surface, paired with an ergonomic modern desk chair.",
    layoutInstructions:
      "Productive home-office layout with comfortable legroom, complemented by matching storage such as a low credenza, bookshelf, or display shelving for books and files.",
    lightingAndDecor:
      "Focused task lighting on or above the work surface, warm ambient room light, subtle workstation accessories (laptop or slim display, notebook, pen tray), and indoor plants.",
    forbiddenFurniture: [
      "dining tables",
      "dining chair sets",
      "bedroom beds",
      "wardrobes",
      "full dining room setups",
    ],
  },
}

export function getRoomProfile(roomType: string): RoomTypeProfile {
  const normalized = roomType.toLowerCase().trim()
  if (normalized.includes("dining")) return ROOM_PROFILES.dining
  if (normalized.includes("bed")) return ROOM_PROFILES.bedroom
  if (normalized.includes("work") || normalized.includes("office") || normalized.includes("study"))
    return ROOM_PROFILES.workspace
  if (normalized.includes("living")) return ROOM_PROFILES["living room"]

  return {
    primaryTitle: roomType.toUpperCase(),
    primaryFurniture: `Functional primary furniture appropriate for a ${roomType.toLowerCase()}.`,
    layoutInstructions: `Organized and spacious layout tailored to a ${roomType.toLowerCase()}.`,
    lightingAndDecor: `Curated decor and lighting suitable for a ${roomType.toLowerCase()}.`,
    forbiddenFurniture: ["cluttered junk", "mismatched unrelated furniture"],
  }
}

/**
 * Builds the image generation prompt with strict priority hierarchy:
 * 1. Preserve source-room architecture and camera viewpoint.
 * 2. Follow selected ROOM TYPE / PRIMARY FUNCTION (strong semantic rules per room type).
 * 3. Follow selected STYLE.
 * 4. Follow selected MOOD.
 * 5. Follow selected PALETTE.
 * 6. Respect BUDGET through realistic material/furniture choices.
 * 7. Follow selected LIGHTING.
 * 8. Produce a cohesive professional interior-design photograph.
 */
export function buildPrompt(selections: DesignSelections): string {
  const { roomType, style, mood, palette, budget, lighting } = selections
  const profile = getRoomProfile(roomType)
  const lightingStyle = lighting ? ` with ${lighting.toLowerCase()} lighting` : ""

  const forbiddenText =
    profile.forbiddenFurniture.length > 0
      ? `Do NOT include ${profile.forbiddenFurniture.join(", ")}.`
      : ""

  return [
    `Professional architectural interior design photography of a renovated ${style.toLowerCase()} ${profile.primaryTitle.toLowerCase()}.`,
    // 1. Preserve source-room architecture and camera
    "ARCHITECTURAL PRESERVATION (CRITICAL): Redesign the EXISTING room while strictly preserving the exact architecture, structural walls, wooden floor, ceiling height, doors, windows, built-in shelving, architectural openings, and the exact camera position, camera height, camera angle, perspective, framing, and field of view. Transform and replace movable furniture to fulfill the new room function, but do not alter the building architecture.",
    // 2. Follow selected ROOM TYPE / FUNCTION
    `PRIMARY FUNCTION (${profile.primaryTitle}): ${profile.primaryFurniture} ${profile.layoutInstructions} ${profile.lightingAndDecor} ${forbiddenText}`,
    // 3. Follow selected STYLE
    `DESIGN STYLE: Authentic ${style} interior aesthetic with cohesive furniture forms, silhouettes, and detailing.`,
    // 4. Follow selected MOOD
    `MOOD: ${mood} atmosphere throughout the space.`,
    // 5. Follow selected PALETTE
    `COLOR PALETTE: Cohesive ${palette} color palette across upholstery, wood tones, textiles, and wall surfaces.`,
    // 6. Respect BUDGET
    `BUDGET LEVEL: Renovation budget of ${budget} reflected in realistic, tasteful material choices and finishes.`,
    // 7. Follow selected LIGHTING
    `LIGHTING: ${lighting ?? "Ambient"} lighting scheme${lightingStyle}.`,
    // 8. Cohesive professional photograph & anti-blank constraint
    "The room must be completely and beautifully furnished. Do NOT erase all furniture or return an empty blank room.",
    "Rich realistic materials, authentic wood grain, soft fabric textures, realistic shadows, reflections, and natural lighting falloff. Editorial magazine quality.",
  ].join(" ")
}

/**
 * Used by providers that accept a negative prompt (diffusion models).
 * Explicitly forbids architectural hallucination, artifacts, people, and split screens,
 * plus room-type-inappropriate furniture.
 */
export function buildNegativePrompt(roomType?: string): string {
  const baseNegatives = [
    "empty wall, blank room, unfurnished, missing furniture, removed furniture",
    "people, human, faces, bodies, hands, limbs, animals, pets",
    "text, typography, watermark, logo, brand, signature, captions",
    "split screen, collage, multi-panel, before and after, picture frame, borders",
    "altered windows, new windows, missing windows, altered doors, extra doors, missing doors",
    "different room layout, changed room dimensions, bent walls, warped perspective, crooked architecture",
    "distorted furniture, unrealistic furniture, floating objects, duplicated objects, cluttered junk",
    "blurry, grainy, oversaturated, CGI render, cartoon, 3D illustration, low resolution, bad shadows, artifacts",
  ]

  if (roomType) {
    const profile = getRoomProfile(roomType)
    if (profile.forbiddenFurniture.length > 0) {
      baseNegatives.push(profile.forbiddenFurniture.join(", "))
    }
  }

  return baseNegatives.join(", ")
}

/**
 * Dedicated prompt builder for OpenAI's /images/edits image-editing endpoint.
 * Commands precise architectural preservation of the source room photograph
 * while restyling changeable interior surfaces, decor, and furniture.
 */
export function buildOpenAIImageEditPrompt(selections: DesignSelections): string {
  const { roomType, style, mood, palette, budget, lighting } = selections
  const profile = getRoomProfile(roomType)
  const lightingInstruction = lighting
    ? `Use this lighting direction: ${lighting}.`
    : "Enhance the existing natural light realistically."

  return [
    `Edit the supplied room photograph into a professionally redesigned version of this EXACT EXISTING room transformed into a ${profile.primaryTitle}.`,
    "",
    "1. ARCHITECTURAL PRESERVATION (CRITICAL):",
    "- Preserve the exact room architecture and structural identity.",
    "- Preserve all walls, floor, ceiling, doors, windows, built-in shelving, and architectural openings.",
    "- Preserve camera position, camera height, camera angle, perspective, field of view, and overall framing.",
    "- Preserve room proportions and spatial layout so it is recognizably the SAME physical room.",
    "- Replace movable furniture to fulfill the new room function, but do NOT alter or reconstruct the building.",
    "",
    `2. PRIMARY FUNCTION & FURNITURE (${profile.primaryTitle}):`,
    `- Primary Furniture: ${profile.primaryFurniture}`,
    `- Room Layout: ${profile.layoutInstructions}`,
    `- Lighting & Styling: ${profile.lightingAndDecor}`,
    "",
    "3. STYLE, MOOD & PALETTE:",
    `- Redesign the interior to embody authentic ${style} style with a ${mood} atmosphere.`,
    `- Use a cohesive ${palette} color palette.`,
    `- Respect a ${budget} renovation budget level in furniture and material selections.`,
    `- ${lightingInstruction}`,
    "- Ensure realistic materials (natural wood grains, matte paints, woven textiles, realistic metal finishes) with accurate proportions, shadows, and reflections.",
    "- The result must look like a real professional interior-design photograph of the original room after renovation.",
    "",
    "4. STRICT CONSTRAINTS (DO NOT ALLOW):",
    "- Do NOT generate a completely different room.",
    "- Do NOT remove furniture or turn the room into an empty blank wall.",
    ...profile.forbiddenFurniture.map((item) => `- Do NOT include ${item}.`),
    "- Do NOT change the architecture, room geometry, or room dimensions.",
    "- Do NOT change camera angle, perspective, or framing.",
    "- Do NOT invent new windows or doors, or move/remove existing windows or doors.",
    "- Do NOT create floating furniture, distorted furniture, or duplicated objects.",
    "- Do NOT produce CGI, cartoon, 3D render, or video game appearance.",
    "- Do NOT add any text, logos, watermarks, people, or animals.",
  ].join("\n")
}

