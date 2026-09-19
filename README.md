# Roomify — AI Room Makeover Studio

Upload a photo of a room, pick a direction (room type, style, mood, palette,
budget, lighting), and Roomify generates a redesigned version of the same
room. Frontend is a Framer export (React + TypeScript + Vite); backend is a
small Express + TypeScript API that proxies to an OpenAI-compatible
image-edit endpoint.

## Quick start

```bash
npm install
cp .env.example .env
# edit .env and set CLOUDFLARE_ACCOUNT_ID + CLOUDFLARE_API_TOKEN

npm run dev
```

This starts the Vite dev server (`http://localhost:5173`) and the Express
API (`http://localhost:8787`) together. Vite proxies `/api/*` to the
Express server, so the frontend always calls same-origin relative paths —
no CORS setup needed.

Open `http://localhost:5173`, click **Start designing** / **Design my
room**, upload a photo, choose your options, and click **Transform My
Room**.

## Environment variables

Copy `.env.example` to `.env` (git-ignored). Roomify supports two image
providers, selected with `AI_PROVIDER`.

### Option A — Cloudflare Workers AI (default, free)

The default, because the free Workers plan includes a daily neuron allowance
with no credit card, so anyone can clone this repo and run it at zero cost.

| Variable                 | Required | Default                                        |
| ------------------------- | -------- | ----------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`   | Yes      | —                                               |
| `CLOUDFLARE_API_TOKEN`    | Yes      | —                                               |
| `CLOUDFLARE_IMAGE_MODEL`  | No       | `@cf/stabilityai/stable-diffusion-xl-base-1.0`  |
| `AI_STRENGTH`             | No       | `0.5`                                           |
| `AI_GUIDANCE`             | No       | `7.5`                                           |
| `AI_STEPS`                | No       | `20`                                            |

Getting the two credentials:

1. Sign up at <https://dash.cloudflare.com/sign-up> (free plan is fine).
2. **Account ID** — open *Workers & Pages*; the Account ID is in the
   right-hand sidebar.
3. **API token** — *My Profile -> API Tokens -> Create Token*, use the
   **Workers AI** template. Copy it immediately; it is shown only once.

**`AI_STRENGTH` is the setting that matters most.** It runs 0 to 1 and
controls how far the result moves from the uploaded photo. Low values keep
more of the original room; high values redesign more aggressively but start
inventing a different room. Start at `0.5` and tune from there — if results
don't look like the user's room, lower it; if they look unchanged, raise it.

### Option B — OpenAI Image Editing Provider (paid, higher quality)

Set `AI_PROVIDER=openai`. Roomify connects directly to OpenAI's `/v1/images/edits` endpoint to perform a true image-to-image redesign. The uploaded photo is passed as the source image with `input_fidelity="high"`, preserving the room's geometry, perspective, architectural identity, doors, and windows while redesigning the finishes, materials, furniture, and lighting.

| Variable             | Required | Default                     | Description                                                   |
| -------------------- | -------- | --------------------------- | ------------------------------------------------------------- |
| `OPENAI_API_KEY`     | Yes      | —                           | Your OpenAI secret API key (kept strictly server-side).       |
| `OPENAI_IMAGE_MODEL` | No       | `gpt-image-2`               | Editing model (`gpt-image-2`, `gpt-image-1`, or `dall-e-2`).  |
| `OPENAI_API_BASE_URL`| No       | `https://api.openai.com/v1` | Base URL for OpenAI API or compatible proxy.                  |

*(Legacy variables `AI_API_KEY`, `AI_IMAGE_MODEL`, and `AI_API_BASE_URL` are also supported for backwards compatibility).*

Key features:
- **Aspect-ratio awareness**: Detects room photo dimensions and selects optimal output sizes (e.g., `1536x1024` for landscape room photos, `1024x1536` for portrait) rather than forcing everything to square.
- **Cost control**: Strictly generates a single image per request (`n=1`) with no automated retries that consume credits unexpectedly.
- **Granular error handling**: Distinguishes invalid credentials (`502`), insufficient quota/credits (`503`), rate limiting (`429`), timeouts (`504`), and invalid photo formats (`400`).

### Server

| Variable | Required | Default | Notes                            |
| --------- | -------- | -------- | --------------------------------- |
| `PORT`    | No       | `8787`   | Port the Express API listens on.  |

Whichever provider is selected, a missing key makes `/api/transform` return a
clean `503 AI_NOT_CONFIGURED` rather than crashing or faking an image. Keys
are only ever read server-side and never reach the browser.

## Choosing a provider

| | Cloudflare (default) | OpenAI |
| --- | --- | --- |
| Cost | Free daily allowance | Paid per image |
| Card required | No | Yes |
| Quality on room redesigns | Fair — SDXL is an older open model | Better structure preservation |
| Needs tuning | Yes (`AI_STRENGTH`) | Mostly not |

Cloudflare's img2img models are marked Beta and occasionally return a blank
image; the provider detects this and retries once automatically before
surfacing an error.

## Project layout

```
src/                  React app (Home + Studio pages)
  Home.tsx            Landing page (Framer export, unchanged)
  Studio.tsx           /studio — upload, selections, transform flow, results
  studio.module.css    Styling for Studio (matches the existing brand tokens)
  lib/api.ts            Typed client for POST /api/transform
server/                Express + TypeScript API
  index.ts             App setup, error handling, prod static file serving
  routes/transform.ts   POST /api/transform (multipart upload)
  ai/                   Image provider abstraction
    provider-factory.ts  Picks a provider from AI_PROVIDER
    cloudflare-provider.ts  Cloudflare Workers AI (SDXL img2img, free tier)
    openai-compatible-provider.ts  Any OpenAI /images/edits endpoint
    prompt.ts             Shared prompt builder used by both providers
  validation.ts         Server-side validation of the upload + selections
  errors.ts             Typed, browser-safe error classes
shared/designOptions.ts Single source of truth for room/style/mood/etc.
                         options — imported by both the client and server
                         so they can't drift apart
```

## Commands

| Command                | What it does                                              |
| ----------------------- | ------------------------------------------------------------ |
| `npm run dev`           | Runs Vite + Express together (recommended for local dev)     |
| `npm run dev:client`    | Vite only                                                    |
| `npm run dev:server`    | Express only, with auto-restart (`tsx watch`)                |
| `npm run build`         | Builds the client (`dist/`) and server (`dist-server/`)      |
| `npm start`             | Runs the built server in production (serves `dist/` too)     |
| `npm run preview`       | Previews the built client only (no API — use `npm start`)    |

## How a transform works

1. The Studio page validates the image (JPG/PNG, ≤10 MB) and required
   selections client-side, then `POST`s a `multipart/form-data` request to
   `/api/transform` with the image and selections.
2. The server re-validates everything independently (file signature bytes,
   not just MIME type/extension; every selection against the same enums in
   `shared/designOptions.ts`).
3. The server calls the configured image provider (see `AI_PROVIDER`) and
   returns `{ generatedImageUrl, selections }`. Cloudflare returns raw image
   bytes, which the provider converts to a data URL; OpenAI returns a URL or
   base64 payload. Either way the route's response shape is identical.
4. The Studio page shows a before/after comparison with the selections used,
   and offers **Try Again**, **Back to Studio**, and **Start New Design**.

Errors (no image, oversized file, missing selections, provider not
configured, provider failure, network failure) all surface as a plain-
language message in the UI rather than a crash.

## Deploying

`npm run build` produces `dist/` (static client) and `dist-server/` (compiled API). In production the Express server serves the built client directly (see `addProductionStaticServing` in `server/index.ts`), so a single `npm start` after `npm run build` is enough on a single host:

```bash
npm run build
npm start
```

This starts the unified production server at `http://localhost:8787`, serving both the API at `/api/transform` and the React frontend with full SPA route fallback.

## Production Features

- **Server-Side Image Optimization**: Large uploads up to 10 MB are automatically auto-oriented (EXIF) and resized server-side using `sharp` to ~1024px longest edge before reaching the AI provider. This preserves aspect ratio and details while accelerating transfer and inference.
- **Strict Room Preservation**: The transformation prompt enforces preservation of camera angle, perspective, walls, windows, doorways, ceiling, and flooring plane, directing changes exclusively to furniture, materials, decor, styling, and lighting.
- **Interactive Before/After Slider**: Result screen includes an accessible, draggable before/after comparison slider with mouse, touch, and keyboard support, plus a side-by-side mode toggle and high-resolution redesign download button.
- **Built-in Rate Limiting**: An in-memory rate limiter protects `/api/transform` against rapid quota exhaustion (15 requests per 10 minutes per client IP) with clean 429 error responses.
- **Framer Cleanup**: All Framer export branding and promotional badges have been removed; navigation links and CTAs navigate cleanly to `/studio` or scroll to sections.

