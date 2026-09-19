import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// The Express API runs on its own port in dev (see server/index.ts).
// Proxying /api here lets the frontend call same-origin relative paths
// ("/api/transform") in both dev and production, so no CORS setup is needed.
const API_PROXY_TARGET = `http://localhost:${process.env.PORT ?? 8787}`

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },
})
