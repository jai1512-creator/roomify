import Header from "../components/Header"
import styles from "./pages.module.css"

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Room",
      description:
        "Take a clear photo of your living room, bedroom, dining space, or workspace. Upload your photo directly into Roomify Studio (supports JPG or PNG formats up to 10 MB).",
      tag: "Room Input",
    },
    {
      number: "02",
      title: "Choose Your Preferences",
      description:
        "Define your vision by selecting your room type, one of 8 curated interior styles (e.g. Japandi, Modern, Minimal), mood, lighting, color palette, and realistic renovation budget tier.",
      tag: "Design Direction",
    },
    {
      number: "03",
      title: "Generate Your Makeover",
      description:
        "Roomify's advanced vision-language pipeline reimagines finishes, furniture, textiles, and lighting fixtures, while strictly maintaining your exact architectural geometry, doors, windows, and camera framing.",
      tag: "AI Transformation",
    },
    {
      number: "04",
      title: "Compare Before & After",
      description:
        "Slide seamlessly between your original room and the redesigned concept using the interactive Before/After comparison slider to inspect materials, layouts, and lighting transformations in detail.",
      tag: "Visual Review",
    },
    {
      number: "05",
      title: "Save Your Design",
      description:
        "Save your favorite concepts to your personal account history, download high-resolution images for contractors or mood boards, or reopen the makeover in Studio to continue iterating.",
      tag: "Account History",
    },
  ]

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>HOW IT WORKS</p>
        <h1 className={styles.title}>From your room to your vision.</h1>
        <p className={styles.subtitle}>
          Roomify transforms your space into a room you will love living in through a thoughtful, five-step design experience.
        </p>

        <div className={styles.stepsList}>
          {steps.map((step) => (
            <div key={step.number} className={styles.stepCard}>
              <div className={styles.stepBadge}>{step.number} &mdash; STEP</div>
              <div className={styles.stepBody}>
                <div className={styles.tagGroup}>
                  <span className={styles.tag}>{step.tag}</span>
                </div>
                <h2 className={styles.stepTitle}>{step.title}</h2>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Experience the process yourself</h2>
          <p className={styles.ctaText}>
            Try Roomify Studio now. Upload your space, pick a style direction, and generate your room concept in seconds.
          </p>
          <a href="/studio" className={styles.ctaBtn}>
            Open Studio &rarr;
          </a>
        </div>
      </main>
    </div>
  )
}
