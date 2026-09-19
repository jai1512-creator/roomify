import { useState, type FormEvent } from "react"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import styles from "./pages.module.css"

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const searchParams = new URLSearchParams(window.location.search)
  const redirectUrl = searchParams.get("redirect") || "/designs"

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await login(email, password)
      window.history.pushState({}, "", redirectUrl)
      window.dispatchEvent(new PopStateEvent("popstate"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to log in.")
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <p className={styles.eyebrow}>WELCOME BACK</p>
            <h1 className={styles.title}>Log in to Roomify</h1>
            <p className={styles.subtitle}>
              Access your saved room makeovers and continue designing.
            </p>

            {error && (
              <div className={styles.errorBanner} role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
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
                  placeholder="name@example.com"
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitButton}
              >
                {submitting ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className={styles.authFooter}>
              Don’t have an account yet?
              <a
                href={`/signup${redirectUrl !== "/designs" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
                className={styles.authFooterLink}
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
