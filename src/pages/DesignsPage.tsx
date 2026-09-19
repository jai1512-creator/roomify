import { useEffect, useState } from "react"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import styles from "./pages.module.css"

interface SavedDesign {
  id: string
  userId: string
  beforeImageUrl: string
  afterImageUrl: string
  roomType: string
  style: string
  mood: string
  palette: string
  budget: string
  lighting?: string | null
  createdAt: string
}

export default function DesignsPage() {
  const { user, loading: authLoading } = useAuth()
  const [designs, setDesigns] = useState<SavedDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      window.history.pushState({}, "", "/login?redirect=/designs")
      window.dispatchEvent(new PopStateEvent("popstate"))
    }
  }, [user, authLoading])

  useEffect(() => {
    if (!user) return

    async function loadDesigns() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/designs")
        if (!res.ok) {
          throw new Error("Failed to load your designs.")
        }
        const data = await res.json()
        setDesigns(data.designs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading designs.")
      } finally {
        setLoading(false)
      }
    }

    loadDesigns()
  }, [user])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this saved design?")) {
      return
    }

    try {
      const res = await fetch(`/api/designs/${id}`, { method: "DELETE" })
      if (res.ok) {
        setDesigns((prev) => prev.filter((d) => d.id !== id))
      } else {
        alert("Could not delete the design. Please try again.")
      }
    } catch {
      alert("Error deleting design.")
    }
  }

  const handleOpenInStudio = (design: SavedDesign) => {
    // Store in sessionStorage so Studio loads it immediately
    sessionStorage.setItem(
      "roomify_loaded_design",
      JSON.stringify({
        previewUrl: design.beforeImageUrl,
        generatedImageUrl: design.afterImageUrl,
        selections: {
          roomType: design.roomType,
          style: design.style,
          mood: design.mood,
          palette: design.palette,
          budget: design.budget,
          lighting: design.lighting || undefined,
        },
      })
    )
    window.history.pushState({}, "", "/studio")
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  if (authLoading || (loading && user)) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <p style={{ textAlign: "center", marginTop: 64, opacity: 0.7 }}>Loading your makeovers...</p>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>YOUR SAVED MAKEOVERS</p>
        <h1 className={styles.title}>My Designs</h1>
        <p className={styles.subtitle}>
          Browse and revisit your past room makeovers, or reopen them in Studio.
        </p>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {designs.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              className={styles.emptyIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: 24, marginBottom: 8 }}>
              No saved designs yet
            </h2>
            <p style={{ fontSize: 14, color: "rgba(29, 28, 25, 0.7)", marginBottom: 24 }}>
              When you design a room in Studio, click "Save Design" on the result screen to store it here.
            </p>
            <a href="/studio" className={styles.primaryAction}>
              Start designing
            </a>
          </div>
        ) : (
          <div className={styles.designsGrid}>
            {designs.map((design) => {
              const formattedDate = new Date(design.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })

              return (
                <div key={design.id} className={styles.designCard}>
                  <div className={styles.comparisonWrapper}>
                    <div className={styles.comparisonSide}>
                      <span className={styles.imageBadge}>Before</span>
                      <img
                        src={design.beforeImageUrl}
                        alt="Original Room"
                        className={styles.comparisonImage}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.comparisonSide}>
                      <span className={styles.imageBadge} style={{ backgroundColor: "rgba(83, 96, 82, 0.9)" }}>
                        After
                      </span>
                      <img
                        src={design.afterImageUrl}
                        alt="Redesigned Room"
                        className={styles.comparisonImage}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                      {design.style} {design.roomType}
                    </h3>

                    <div className={styles.chipsWrapper}>
                      <span className={styles.chip}>{design.roomType}</span>
                      <span className={styles.chip}>{design.style}</span>
                      <span className={styles.chip}>{design.mood}</span>
                      <span className={styles.chip}>{design.palette}</span>
                      <span className={styles.chip}>{design.budget}</span>
                      {design.lighting && <span className={styles.chip}>{design.lighting}</span>}
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDate}>{formattedDate}</span>

                      <div className={styles.cardActions}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          title="Open in Studio"
                          onClick={() => handleOpenInStudio(design)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 3h6v6" />
                            <path d="M10 14L21 3" />
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          </svg>
                          View
                        </button>

                        <a
                          href={design.afterImageUrl}
                          download={`roomify-${design.style.toLowerCase()}-${design.roomType.toLowerCase()}.jpg`}
                          className={styles.iconButton}
                          title="Download Redesign"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          Download
                        </a>

                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.deleteButton}`}
                          title="Delete design"
                          onClick={() => handleDelete(design.id)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
