import Header from "../components/Header"
import styles from "./pages.module.css"

export default function ExplorePage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>AI-POWERED ROOM MAKEOVERS</p>
        <h1 className={styles.title}>Explore Roomify Studio</h1>
        <p className={styles.subtitle}>
          Discover how Roomify reimagines your real rooms with curated design styles, mood lighting, and
          budget-aware finishes—without losing your room's architecture.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Preserves Architecture</h2>
            <p className={styles.featureDesc}>
              Unlike generic image generators that create random rooms, Roomify locks in your room's camera perspective,
              walls, doors, windows, and structural layout.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Curated Design Styles</h2>
            <p className={styles.featureDesc}>
              Explore 8 distinct design styles—from Japandi and Minimal to Luxury and Indian Contemporary—tailored
              specifically to the functional purpose of each room.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Real Budget Realism</h2>
            <p className={styles.featureDesc}>
              Choose from ₹50K, ₹1L, ₹2L, or ₹5L+ renovation budget tiers to see material and furniture selections
              that match realistic execution plans.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
              </svg>
            </div>
            <h2 className={styles.featureTitle}>Save & Revisit</h2>
            <p className={styles.featureDesc}>
              Save your generated concepts to your personal design history, compare Before and After side-by-side,
              and reopen them in Studio at any time.
            </p>
          </div>
        </div>

        <p className={styles.eyebrow}>POPULAR MAKEOVERS</p>
        <h2 className={styles.title}>Spaces with a Point of View</h2>
        <p className={styles.subtitle}>
          Here are examples of how Roomify transforms spaces into functional, cohesive interiors.
        </p>

        <div className={styles.stylesGrid}>
          <div className={styles.styleCard}>
            <div className={styles.styleImageWrap}>
              <img
                src="https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg?scale-down-to=512&width=1800&height=1200"
                alt="Modern Living Room Makeover"
                className={styles.styleImg}
              />
            </div>
            <div className={styles.styleBody}>
              <div className={styles.tagGroup}>
                <span className={styles.tag}>Living Room</span>
                <span className={styles.tag}>Modern</span>
              </div>
              <h3 className={styles.styleName}>Modern Earth Living</h3>
              <p className={styles.styleSummary}>
                Sophisticated architectural contrast with low-profile seating, warm natural oak, and curated ceramic decor.
              </p>
              <a href="/studio" className={styles.cardCta}>
                Start designing living room &rarr;
              </a>
            </div>
          </div>

          <div className={styles.styleCard}>
            <div className={styles.styleImageWrap}>
              <img
                src="https://framerusercontent.com/images/lqvesjnSdK5mljnR3QWTmqpUsw.jpg?scale-down-to=512&width=1800&height=1200"
                alt="Japandi Dining Room Makeover"
                className={styles.styleImg}
              />
            </div>
            <div className={styles.styleBody}>
              <div className={styles.tagGroup}>
                <span className={styles.tag}>Dining</span>
                <span className={styles.tag}>Japandi</span>
              </div>
              <h3 className={styles.styleName}>Japandi Dining Haven</h3>
              <p className={styles.styleSummary}>
                Centered oak dining table with curved backrest wooden chairs, warm overhead dome pendant, and minimalist textures.
              </p>
              <a href="/studio" className={styles.cardCta}>
                Start designing dining &rarr;
              </a>
            </div>
          </div>

          <div className={styles.styleCard}>
            <div className={styles.styleImageWrap}>
              <img
                src="https://framerusercontent.com/images/UewxeNGdAt68En5hvcQLjY8K7Q.jpg?scale-down-to=512&width=1800&height=1203"
                alt="Workspace Makeover"
                className={styles.styleImg}
              />
            </div>
            <div className={styles.styleBody}>
              <div className={styles.tagGroup}>
                <span className={styles.tag}>Workspace</span>
                <span className={styles.tag}>Minimal</span>
              </div>
              <h3 className={styles.styleName}>Focused Executive Studio</h3>
              <p className={styles.styleSummary}>
                Clean desk surface, ergonomic seating, organized display shelving, and soft ambient task lighting.
              </p>
              <a href="/studio" className={styles.cardCta}>
                Start designing workspace &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to see your space reimagined?</h2>
          <p className={styles.ctaText}>
            No software installation or design experience required. Upload your photo and watch Roomify create your new space.
          </p>
          <a href="/studio" className={styles.ctaBtn}>
            Start Designing in Studio &rarr;
          </a>
        </div>
      </main>
    </div>
  )
}
