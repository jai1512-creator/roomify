import { useEffect, useRef, useState } from "react"
import { useAuth } from "../context/AuthContext"
import styles from "./header.module.css"

export default function Header() {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    setDropdownOpen(false)
    await logout()
  }

  return (
    <nav className={styles.nav}>
      <a className={styles.wordmark} href="/">
        ROOMIFY
      </a>

      <div className={styles.navLinks}>
        <a className={styles.navLink} href="/explore">
          Explore
        </a>
        <a className={styles.navLink} href="/how-it-works">
          How it works
        </a>
        <a className={styles.navLink} href="/styles">
          Styles
        </a>
        <a className={styles.navLink} href="/inspiration">
          Inspiration
        </a>
      </div>

      <div className={styles.navActions}>
        <a className={styles.startDesigningButton} href="/studio">
          Start designing
        </a>

        {user ? (
          <div className={styles.userDropdownContainer} ref={dropdownRef}>
            <button
              type="button"
              className={styles.userMenuTrigger}
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-label="User menu"
            >
              <span className={styles.userAvatarMini}>{user.name.charAt(0)}</span>
              <span>{user.name}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${styles.dropdownIcon} ${dropdownOpen ? styles.dropdownIconOpen : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <a
                  href="/account"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  My Account
                </a>
                <a
                  href="/designs"
                  className={styles.dropdownItem}
                  onClick={() => setDropdownOpen(false)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  My Designs
                </a>
                <div className={styles.dropdownDivider} />
                <button
                  type="button"
                  className={`${styles.dropdownItem} ${styles.logoutItem}`}
                  onClick={handleLogout}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <a className={styles.loginButton} href="/login">
            Log in
          </a>
        )}
      </div>
    </nav>
  )
}
