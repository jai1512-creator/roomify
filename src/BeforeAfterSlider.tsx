import React, { useCallback, useEffect, useRef, useState } from "react"
import styles from "./beforeAfterSlider.module.css"

export interface BeforeAfterSliderProps {
  beforeUrl: string
  afterUrl: string
  beforeAlt?: string
  afterAlt?: string
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeAlt = "Original room photo",
  afterAlt = "AI redesigned room",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState<number>(50)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider")
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePositionFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const offsetX = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (offsetX / rect.width) * 100))
    setSliderPosition(percent)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true)
      updatePositionFromClientX(e.clientX)
    },
    [updatePositionFromClientX]
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true)
      if (e.touches.length > 0) {
        updatePositionFromClientX(e.touches[0].clientX)
      }
    },
    [updatePositionFromClientX]
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      updatePositionFromClientX(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePositionFromClientX(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleEnd)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleEnd)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleEnd)
    }
  }, [isDragging, updatePositionFromClientX])

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "slider" ? "side-by-side" : "slider"))
  }

  return (
    <div className={styles.container}>
      <div className={styles.modeToggleRow}>
        <button
          type="button"
          onClick={toggleViewMode}
          className={styles.modeToggleButton}
          aria-label={viewMode === "slider" ? "Switch to side by side view" : "Switch to slider comparison view"}
        >
          {viewMode === "slider" ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
              View Side by Side
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12h8" />
                <path d="M10 9l-3 3 3 3" />
                <path d="M14 9l3 3-3 3" />
              </svg>
              View Interactive Slider
            </>
          )}
        </button>
      </div>

      {viewMode === "side-by-side" ? (
        <div className={styles.sideBySideGrid}>
          <div className={styles.sideCol}>
            <img src={beforeUrl} alt={beforeAlt} className={styles.sideImage} />
            <p className={styles.sideLabel}>BEFORE</p>
          </div>
          <div className={styles.sideCol}>
            <img src={afterUrl} alt={afterAlt} className={styles.sideImage} />
            <p className={styles.sideLabel}>AFTER</p>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={styles.sliderContainer}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="region"
          aria-label="Interactive before and after comparison"
        >
          {/* Accessible input slider for keyboard and screen reader users */}
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(sliderPosition)}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            aria-label="Before and after split percentage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(sliderPosition)}
            className={styles.accessibleRange}
          />

          {/* Base Layer: AFTER Image */}
          <div className={styles.imageLayer}>
            <img src={afterUrl} alt={afterAlt} className={styles.image} />
            <span className={styles.badgeAfter}>AFTER</span>
          </div>

          {/* Clipped Layer: BEFORE Image */}
          <div className={styles.beforeLayer} style={{ width: `${sliderPosition}%` }}>
            <img
              src={beforeUrl}
              alt={beforeAlt}
              className={styles.beforeImage}
              style={{
                width: containerRef.current ? `${containerRef.current.clientWidth}px` : "100%",
              }}
            />
            <span className={styles.badgeBefore}>BEFORE</span>
          </div>

          {/* Draggable Divider Handle */}
          <div
            className={styles.divider}
            style={{ left: `${sliderPosition}%` }}
            aria-hidden="true"
          >
            <div className={styles.handle}>
              <span className={styles.handleArrows}>‹ ›</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
