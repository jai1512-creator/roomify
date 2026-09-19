import { useEffect, useRef, useState } from "react"
import styles from "./studio.module.css"
import {
  BUDGETS,
  LIGHTING_OPTIONS,
  MAX_IMAGE_BYTES,
  MOODS,
  PALETTES,
  ROOM_TYPES,
  STYLES,
  SUPPORTED_IMAGE_TYPES,
  type DesignSelections,
} from "../shared/designOptions"
import { ApiError, transformRoom, type TransformResponse } from "./lib/api"
import BeforeAfterSlider from "./BeforeAfterSlider"
import { useAuth } from "./context/AuthContext"

type SelectionField = keyof DesignSelections
type PartialSelections = Partial<DesignSelections>
type ViewState = "studio" | "result"

const REQUIRED_FIELDS: SelectionField[] = ["roomType", "style", "mood", "palette", "budget"]

function isComplete(selections: PartialSelections): selections is DesignSelections {
  return REQUIRED_FIELDS.every((field) => Boolean(selections[field]))
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Validates a picked file client-side. The server re-validates the bytes independently. */
function validateFile(file: File): string | null {
  if (!(SUPPORTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return "Please upload a JPG or PNG image."
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `That image is too large. Please upload a photo under ${formatBytes(MAX_IMAGE_BYTES)}.`
  }
  if (file.size <= 0) {
    return "That file looks empty. Please choose a different photo."
  }
  return null
}

function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function OptionGroup({
  label,
  field,
  options,
  value,
  onSelect,
  optional,
}: {
  label: string
  field: SelectionField
  options: readonly string[]
  value: string | undefined
  onSelect: (field: SelectionField, value: string) => void
  optional?: boolean
}) {
  return (
    <fieldset className={styles.optionGroup}>
      <legend className={styles.optionLabel}>
        {label}
        {optional ? <span className={styles.optionalTag}> · optional</span> : null}
      </legend>
      <div className={styles.optionPills} role="group" aria-label={label}>
        {options.map((option) => {
          const selected = value === option
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={selected ? styles.pillSelected : styles.pill}
              onClick={() => onSelect(field, option)}
            >
              {option}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.summaryChip}>
      <span className={styles.summaryChipLabel}>{label}</span>
      <span className={styles.summaryChipValue}>{value}</span>
    </div>
  )
}

async function toDataUrl(fileOrUrl: File | string): Promise<string> {
  if (typeof fileOrUrl !== "string") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(fileOrUrl)
    })
  }
  if (fileOrUrl.startsWith("data:")) {
    return fileOrUrl
  }
  const response = await fetch(fileOrUrl)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function AuthModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const { login, signup } = useAuth()
  const [tab, setTab] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await signup(name, email, password, confirmPassword)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.authModalOverlay} onClick={onClose}>
      <div className={styles.authModalCard} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.authModalClose} onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className={styles.authTabs}>
          <button
            type="button"
            className={`${styles.authTab} ${tab === "login" ? styles.authTabActive : ""}`}
            onClick={() => {
              setTab("login")
              setError(null)
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`${styles.authTab} ${tab === "signup" ? styles.authTabActive : ""}`}
            onClick={() => {
              setTab("signup")
              setError(null)
            }}
          >
            Create Account
          </button>
        </div>

        <p style={{ fontSize: 13, color: "rgba(29, 28, 25, 0.7)", marginBottom: 16 }}>
          {tab === "login"
            ? "Log in to save this room makeover to your personal design history."
            : "Sign up to save this room makeover to your personal design history."}
        </p>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "rgba(180, 50, 50, 0.1)",
              border: "1px solid rgba(180, 50, 50, 0.3)",
              color: "rgb(150, 30, 30)",
              fontSize: 13,
              borderRadius: 3,
              marginBottom: 16,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={styles.saveButton}
              style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            >
              {submitting ? "Logging in..." : "Log In & Save Design"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Confirm Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 12px",
                  borderRadius: 2,
                  border: "1px solid rgba(29, 28, 25, 0.2)",
                  background: "#fff",
                  fontSize: 14,
                }}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={styles.saveButton}
              style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            >
              {submitting ? "Creating account..." : "Create Account & Save Design"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function Studio() {
  const { user } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  const [selections, setSelections] = useState<PartialSelections>({})
  const [view, setView] = useState<ViewState>("studio")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<TransformResponse | null>(null)

  const [isSaved, setIsSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Restore saved design opened from /designs
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("roomify_loaded_design")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.previewUrl && parsed.generatedImageUrl && parsed.selections) {
          setPreviewUrl(parsed.previewUrl)
          setSelections(parsed.selections)
          setResult({
            generatedImageUrl: parsed.generatedImageUrl,
            selections: parsed.selections,
          })
          setView("result")
          setIsSaved(true)
          sessionStorage.removeItem("roomify_loaded_design")
        }
      }
    } catch (e) {
      console.error("Error loading design from session storage:", e)
    }
  }, [])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  function applyFile(file: File) {
    const validationError = validateFile(file)
    if (validationError) {
      setFileError(validationError)
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    const nextUrl = URL.createObjectURL(file)
    objectUrlRef.current = nextUrl
    setFileError(null)
    setImageFile(file)
    setPreviewUrl(nextUrl)
  }

  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      applyFile(file)
    }
    // Reset so choosing the same file twice still fires onChange.
    event.target.value = ""
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDraggingOver(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      applyFile(file)
    }
  }

  function selectOption(field: SelectionField, value: string) {
    setSelections((prev) => ({ ...prev, [field]: value }))
  }

  async function runTransform() {
    if (!imageFile || !isComplete(selections)) {
      return
    }

    setStatus("loading")
    setErrorMessage(null)

    try {
      const response = await transformRoom(imageFile, selections)
      setResult(response)
      setIsSaved(false)
      setSaveError(null)
      setStatus("idle")
      setView("result")
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Something went wrong while transforming your room. Please try again."
      setErrorMessage(message)
      setStatus("error")
    }
  }

  async function saveDesignInternal() {
    if (!result || !result.generatedImageUrl) return

    try {
      setSaving(true)
      setSaveError(null)

      const beforeImage = await toDataUrl(imageFile || previewUrl || "")
      const afterImage = await toDataUrl(result.generatedImageUrl)

      const res = await fetch("/api/designs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          beforeImage,
          afterImage,
          selections: result.selections,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData?.error?.message || "Failed to save design.")
      }

      setIsSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save design.")
    } finally {
      setSaving(false)
    }
  }

  function handleSaveDesign() {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    saveDesignInternal()
  }

  function startNewDesign() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setImageFile(null)
    setPreviewUrl(null)
    setFileError(null)
    setSelections({})
    setResult(null)
    setStatus("idle")
    setErrorMessage(null)
    setIsSaved(false)
    setSaveError(null)
    setView("studio")
  }

  const readyToTransform = Boolean(imageFile) && isComplete(selections)

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a className={styles.wordmark} href="/">
          ROOMIFY
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <a href="/designs" className={styles.backLink} style={{ fontWeight: 600 }}>
                My Designs
              </a>
              <a href="/account" className={styles.backLink}>
                {user.name}
              </a>
            </div>
          ) : (
            <a href="/login" className={styles.backLink}>
              Log in
            </a>
          )}
          <a className={styles.backLink} href="/">
            <ArrowLeftIcon />
            Back to home
          </a>
        </div>
      </nav>

      {status === "loading" ? (
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingCard}>
              <div className={styles.loadingSpinner} />
              <h1 className={styles.loadingHeading}>Roomify is reimagining your space...</h1>
              <p className={styles.loadingSubtitle}>
                Preserving your room’s architecture, perspective, and lighting while redesigning finishes, furnishings, and materials.
              </p>
              {previewUrl ? (
                <div className={styles.loadingPreviewWrapper}>
                  <img src={previewUrl} alt="Room being transformed" className={styles.loadingPreviewImage} />
                  <div className={styles.loadingShimmerOverlay} />
                </div>
              ) : null}
              <div className={styles.loadingSteps}>
                <span className={styles.loadingPulseDot} />
                <span>
                  Applying {selections.style ?? "chosen"} style · {selections.mood ?? "balanced"} mood · {selections.budget ?? "curated"} budget
                </span>
              </div>
            </div>
          </div>
        </main>
      ) : view === "studio" ? (
        <main className={styles.main}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>ROOMIFY STUDIO</p>
            <h1 className={styles.title}>Tell Roomify what matters.</h1>
            <p className={styles.subtitle}>
              Upload a photo of your space, choose a direction, and see it reimagined without losing the room you love.
            </p>
          </div>

          <div className={styles.grid}>
            <section className={styles.uploadPanel} aria-labelledby="upload-heading">
              <h2 id="upload-heading" className={styles.panelLabel}>
                01 — Your room
              </h2>
              <div
                className={[styles.dropzone, previewUrl ? styles.dropzoneFilled : "", isDraggingOver ? styles.dropzoneActive : ""]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault()
                  setIsDraggingOver(true)
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                aria-label="Upload a room photo"
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    fileInputRef.current?.click()
                  }
                }}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Uploaded room preview" className={styles.previewImage} />
                    <button
                      type="button"
                      className={styles.replaceButton}
                      onClick={(event) => {
                        event.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      Replace photo
                    </button>
                  </>
                ) : (
                  <div className={styles.dropzoneEmpty}>
                    <UploadIcon />
                    <p className={styles.dropzoneTitle}>Upload Room</p>
                    <p className={styles.dropzoneHint}>Drag and drop, or tap to choose a JPG or PNG up to 10 MB.</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className={styles.hiddenInput}
                onChange={onInputChange}
              />
              {fileError ? (
                <p className={styles.fieldError} role="alert">
                  {fileError}
                </p>
              ) : null}
            </section>

            <section className={styles.controlsPanel} aria-labelledby="controls-heading">
              <h2 id="controls-heading" className={styles.panelLabel}>
                02 — Your direction
              </h2>

              <OptionGroup label="Room" field="roomType" options={ROOM_TYPES} value={selections.roomType} onSelect={selectOption} />
              <OptionGroup label="Style" field="style" options={STYLES} value={selections.style} onSelect={selectOption} />
              <OptionGroup label="Mood" field="mood" options={MOODS} value={selections.mood} onSelect={selectOption} />
              <OptionGroup label="Palette" field="palette" options={PALETTES} value={selections.palette} onSelect={selectOption} />
              <OptionGroup label="Budget" field="budget" options={BUDGETS} value={selections.budget} onSelect={selectOption} />
              <OptionGroup
                label="Lighting"
                field="lighting"
                options={LIGHTING_OPTIONS}
                value={selections.lighting}
                onSelect={selectOption}
                optional
              />

              {status === "error" && errorMessage ? (
                <div className={styles.errorBanner} role="alert">
                  <p>{errorMessage}</p>
                </div>
              ) : null}

              <button type="button" className={styles.transformButton} disabled={!readyToTransform} onClick={runTransform}>
                Transform My Room
              </button>

              {!imageFile ? (
                <p className={styles.helperNote}>Upload a room photo to get started.</p>
              ) : !isComplete(selections) ? (
                <p className={styles.helperNote}>Choose a room, style, mood, palette, and budget.</p>
              ) : null}
            </section>
          </div>
        </main>
      ) : result ? (
        <main className={styles.main}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>YOUR NEW ROOM</p>
            <h1 className={styles.title}>
              A {result.selections.style.toLowerCase()} take on your {result.selections.roomType.toLowerCase()}.
            </h1>
            <p className={styles.subtitle}>Here's how your space could look, without losing what you started with.</p>
          </div>

          {previewUrl && result.generatedImageUrl ? (
            <BeforeAfterSlider
              beforeUrl={previewUrl}
              afterUrl={result.generatedImageUrl}
              beforeAlt={`Original ${result.selections.roomType.toLowerCase()}`}
              afterAlt={`Redesigned ${result.selections.style.toLowerCase()} ${result.selections.roomType.toLowerCase()}`}
            />
          ) : null}

          <div className={styles.selectionSummary}>
            <SummaryChip label="Room" value={result.selections.roomType} />
            <SummaryChip label="Style" value={result.selections.style} />
            <SummaryChip label="Mood" value={result.selections.mood} />
            <SummaryChip label="Palette" value={result.selections.palette} />
            <SummaryChip label="Budget" value={result.selections.budget} />
            {result.selections.lighting ? <SummaryChip label="Lighting" value={result.selections.lighting} /> : null}
          </div>

          {(status === "error" && errorMessage) || saveError ? (
            <div className={styles.errorBanner} role="alert">
              <p>{errorMessage || saveError}</p>
            </div>
          ) : null}

          <div className={styles.resultActions}>
            {isSaved ? (
              <div className={styles.savedButton}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved to Account
              </div>
            ) : (
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveDesign}
                disabled={saving}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                {saving ? "Saving to Account..." : "Save Design"}
              </button>
            )}

            <button type="button" className={styles.secondaryButton} onClick={runTransform}>
              Try Again
            </button>
            <button type="button" className={styles.secondaryButton} onClick={() => setView("studio")}>
              Back to Studio
            </button>
            <button type="button" className={styles.secondaryButton} onClick={startNewDesign}>
              Start New Design
            </button>
            {result.generatedImageUrl ? (
              <a
                href={result.generatedImageUrl}
                download={`roomify-${result.selections.style.toLowerCase()}-${result.selections.roomType.toLowerCase()}.png`}
                className={styles.downloadButton}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Redesign
              </a>
            ) : null}
          </div>
        </main>
      ) : null}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            saveDesignInternal()
          }}
        />
      )}
    </div>
  )
}
