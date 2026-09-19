import { useEffect } from "react"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import styles from "./pages.module.css"

export default function AccountPage() {
  const { user, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.history.pushState({}, "", "/login?redirect=/account")
      window.dispatchEvent(new PopStateEvent("popstate"))
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <p style={{ textAlign: "center", marginTop: 64, opacity: 0.7 }}>Loading account details...</p>
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.accountCard}>
          <div className={styles.profileHeader}>
            <div className={styles.profileAvatar}>{user.name.charAt(0)}</div>
            <div className={styles.profileDetails}>
              <p className={styles.eyebrow}>MY ACCOUNT</p>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>

          <div className={styles.accountInfoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Member Since</div>
              <div className={styles.infoValue}>{formattedDate}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Account Status</div>
              <div className={styles.infoValue} style={{ color: "rgb(83, 96, 82)" }}>
                Active (Studio Member)
              </div>
            </div>
          </div>

          <div className={styles.accountActions}>
            <a href="/designs" className={styles.primaryAction}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              View My Designs
            </a>
            <a href="/studio" className={styles.secondaryAction}>
              Start designing
            </a>
            <button
              type="button"
              className={styles.secondaryAction}
              onClick={async () => {
                await logout()
                window.history.pushState({}, "", "/")
                window.dispatchEvent(new PopStateEvent("popstate"))
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
