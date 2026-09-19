import Header from "../components/Header"
import styles from "./pages.module.css"

interface InspirationItem {
  id: string
  title: string
  style: string
  room: string
  description: string
  imageUrl: string
}

const INSPIRATION_ITEMS: InspirationItem[] = [
  {
    id: "warm-minimal-bedroom",
    title: "Warm Minimal Bedroom",
    style: "Minimal",
    room: "Bedroom",
    description: "A tranquil master suite centered around a natural low-profile platform bed, warm linen bedding, and soft recessed lighting.",
    imageUrl: "https://framerusercontent.com/images/lqvesjnSdK5mljnR3QWTmqpUsw.jpg?scale-down-to=512&width=1800&height=1200",
  },
  {
    id: "urban-japandi-workspace",
    title: "Urban Japandi Workspace",
    style: "Japandi",
    room: "Workspace",
    description: "A serene, clutter-free home office blending slender black steel frames, light oak joinery, and biophilic greenery.",
    imageUrl: "https://framerusercontent.com/images/UewxeNGdAt68En5hvcQLjY8K7Q.jpg?scale-down-to=512&width=1800&height=1203",
  },
  {
    id: "modern-earth-living",
    title: "Modern Earth Living Room",
    style: "Modern",
    room: "Living room",
    description: "Cohesive conversation grouping with structured low-profile seating, warm natural oak coffee tables, and earthy stoneware.",
    imageUrl: "https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg?scale-down-to=512&width=1800&height=1200",
  },
  {
    id: "quiet-luxury-bedroom",
    title: "Quiet Luxury Bedroom",
    style: "Luxury",
    room: "Bedroom",
    description: "Bespoke upholstered architectural headboard, brass bedside lighting accents, and layered premium velvet textiles.",
    imageUrl: "https://framerusercontent.com/images/rzjp1o2aq93lbOQj6pYJczcBWHI.jpg?scale-down-to=512&width=1800&height=1199",
  },
  {
    id: "japandi-dining-room",
    title: "Japandi Serenity Dining",
    style: "Japandi",
    room: "Dining",
    description: "Substantial natural oak dining table with curved wooden backrest dining chairs and an overhead statement pendant lamp.",
    imageUrl: "https://framerusercontent.com/images/juz1BQ71rrYWm1QbnC4062Et8ew.jpg?scale-down-to=512&width=1800&height=1347",
  },
  {
    id: "indian-contemporary-living",
    title: "Indian Contemporary Lounge",
    style: "Indian Contemporary",
    room: "Living room",
    description: "Solid wood credenza with handwoven cane doors, brass accents, handloom throw rugs, and warm ambient floor lighting.",
    imageUrl: "https://framerusercontent.com/images/GaLahZqn0tlYa4J5z3d4E6Wgjmo.jpg?scale-down-to=512&width=1800&height=1200",
  },
]

export default function InspirationPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>INSPIRATION</p>
        <h1 className={styles.title}>Spaces worth coming home to.</h1>
        <p className={styles.subtitle}>
          Browse real Roomify room makeovers and curated design concepts. Find ideas for your own bedroom,
          living room, dining area, or home office.
        </p>

        <div className={styles.inspirationGrid}>
          {INSPIRATION_ITEMS.map((item) => (
            <div key={item.id} className={styles.inspirationCard}>
              <div className={styles.inspirationImageWrap}>
                <img src={item.imageUrl} alt={item.title} className={styles.inspirationImg} />
              </div>
              <div className={styles.inspirationBody}>
                <div className={styles.tagGroup}>
                  <span className={styles.tag}>{item.style}</span>
                  <span className={styles.tag}>{item.room}</span>
                </div>
                <h2 className={styles.inspirationTitle}>{item.title}</h2>
                <p className={styles.inspirationDesc}>{item.description}</p>
                <a href="/studio" className={styles.cardCta}>
                  Try this look in Studio &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Feeling inspired?</h2>
          <p className={styles.ctaText}>
            Bring any of these design directions into your own home. Upload a photo of your room and see it transformed now.
          </p>
          <a href="/studio" className={styles.ctaBtn}>
            Start Designing in Studio &rarr;
          </a>
        </div>
      </main>
    </div>
  )
}
