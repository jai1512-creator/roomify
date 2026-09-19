import { useState, type FormEvent } from "react"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import styles from "./pages.module.css"

export default function SignupPage() {
  const { signup } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)
  const redirectUrl = searchParams.get("redirect") || "/designs"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    setSubmitting(true)

    try {
      await signup(name, email, password, confirmPassword)
      window.history.pushState({}, "", redirectUrl)
      window.dispatchEvent(new PopStateEvent("popstate"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.")
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <p className={styles.eyebrow}>CREATE YOUR ACCOUNT</p>
            <h1 className={styles.title}>Join Roomify</h1>
            <p className={styles.subtitle}>
              Save your AI room transformations, explore ideas, and build your dream home.
            </p>

            {error && (
              <div className={styles.errorBanner} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="name">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={styles.input}
                  placeholder="Jane Doe"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  placeholder="jane@example.com"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="At least 8 characters"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder="Repeat your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitButton}
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className={styles.authFooter}>
              Already have an account?
              <a
                href={`/login${redirectUrl !== "/designs" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className={styles.authFooterLink}
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
