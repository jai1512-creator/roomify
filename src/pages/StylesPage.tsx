import Header from "../components/Header"
import { STYLES, type Style } from "../../shared/designOptions"
import styles from "./pages.module.css"

interface StyleInfo {
  name: Style
  tagline: string
  description: string
  keyElements: string
  imageUrl: string
}

const STYLE_DETAILS: Record<Style, { tagline: string; description: string; keyElements: string; imageUrl: string }> = {
  Minimal: {
    tagline: "Clean lines, quiet neutral colors, intentional spaces.",
    description: "Focuses on essential forms, decluttered surfaces, balanced negative space, and functional simplicity.",
    keyElements: "Monochrome palette, concealed storage, architectural light fixtures, matte unadorned surfaces.",
    imageUrl: "https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg?scale-down-to=512&width=1800&height=1200",
  },
  Japandi: {
    tagline: "Warm materials, natural textures, calm simplicity.",
    description: "The serene fusion of Japanese wabi-sabi aesthetics and Scandinavian functionality, emphasizing craftsmanship and warmth.",
    keyElements: "Natural light oak, low-profile wooden furniture, papercord seats, linen textiles, earthy handmade ceramics.",
    imageUrl: "https://framerusercontent.com/images/lqvesjnSdK5mljnR3QWTmqpUsw.jpg?scale-down-to=512&width=1800&height=1200",
  },
  Modern: {
    tagline: "Structured forms, sophisticated contrast, sleek finishes.",
    description: "Bold architectural silhouettes, balanced proportion, refined material contrast, and purposeful elegance.",
    keyElements: "Walnut wood, black metal accents, tailored linear seating, recessed perimeter lighting.",
    imageUrl: "https://framerusercontent.com/images/fFRyirFPkcBCpE41xtxscshE.jpg?scale-down-to=512&width=1800&height=1013",
  },
  Luxury: {
    tagline: "Rich materials, dramatic lighting, refined bespoke details.",
    description: "Opulent finishes, atmospheric layered lighting, plush upholstery, and tailored architectural statements.",
    keyElements: "Marble surfaces, brushed brass hardware, velvet and rich leather, architectural statement chandeliers.",
    imageUrl: "https://framerusercontent.com/images/rzjp1o2aq93lbOQj6pYJczcBWHI.jpg?scale-down-to=512&width=1800&height=1199",
  },
  Industrial: {
    tagline: "Raw textures, metal, concrete, and bold structural forms.",
    description: "Honest structural expression celebrating architectural metals, distressed woods, concrete, and open layouts.",
    keyElements: "Black iron frames, exposed brick or concrete textures, reclaimed timber, vintage factory pendants.",
    imageUrl: "https://framerusercontent.com/images/UewxeNGdAt68En5hvcQLjY8K7Q.jpg?scale-down-to=512&width=1800&height=1203",
  },
  "Indian Contemporary": {
    tagline: "Warm materials, Indian character, and handcrafted details.",
    description: "A modern homage to Indian heritage featuring solid teak wood, handcrafted cane joinery, and warm earthy textiles.",
    keyElements: "Teak and sheesham wood, handwoven cane accents, brass hardware, warm terracotta tones, handloom rugs.",
    imageUrl: "https://framerusercontent.com/images/GaLahZqn0tlYa4J5z3d4E6Wgjmo.jpg?scale-down-to=512&width=1800&height=1200",
  },
  Scandinavian: {
    tagline: "Light-filled, functional warmth with cozy textiles.",
    description: "Nordic principles of hygge, bright airy spaces, pale wood grains, and ergonomic practical comfort.",
    keyElements: "Light birch and pine, woven wool throws, off-white walls, large airy window treatments.",
    imageUrl: "https://framerusercontent.com/images/2dZj6byufNqmM20ajNFNGUDBE.jpg?scale-down-to=512&width=1800&height=1200",
  },
  "Warm & Organic": {
    tagline: "Soft curves, tactile natural materials, biophilic calm.",
    description: "Curved organic furniture, earthy clay tones, lush indoor greenery, and rich tactile surfaces.",
    keyElements: "Bouclé seating, travertine stone, potted fiddle-leaf plants, warm plaster walls, clay ceramics.",
    imageUrl: "https://framerusercontent.com/images/18HRCnJ1ofAfFsr2y7AcJrdhPLQ.jpg?scale-down-to=512&width=1800&height=1018",
  },
}

export default function StylesPage() {
  const stylesList: StyleInfo[] = STYLES.map((style) => ({
    name: style,
    tagline: STYLE_DETAILS[style]?.tagline ?? "Curated interior aesthetic.",
    description: STYLE_DETAILS[style]?.description ?? "Thoughtfully crafted room direction.",
    keyElements: STYLE_DETAILS[style]?.keyElements ?? "Harmonious materials and lighting.",
    imageUrl: STYLE_DETAILS[style]?.imageUrl ?? "https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg",
  }))

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <p className={styles.eyebrow}>STYLE EXPLORER</p>
        <h1 className={styles.title}>Find your room’s personality.</h1>
        <p className={styles.subtitle}>
          Roomify officially supports {STYLES.length} curated interior design styles. Choose any style in Studio to
          transform your space while preserving its architectural character.
        </p>

        <div className={styles.stylesGrid}>
          {stylesList.map((item) => (
            <div key={item.name} className={styles.styleCard}>
              <div className={styles.styleImageWrap}>
                <img src={item.imageUrl} alt={`${item.name} style preview`} className={styles.styleImg} />
              </div>
              <div className={styles.styleBody}>
                <div className={styles.tagGroup}>
                  <span className={styles.tag}>Roomify Style</span>
                </div>
                <h2 className={styles.styleName}>{item.name}</h2>
                <p className={styles.styleSummary}>{item.tagline}</p>
                <div className={styles.styleDetails}>
                  <strong>Key Elements:</strong> {item.keyElements}
                </div>
                <a href="/studio" className={styles.cardCta}>
                  Design in {item.name} &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to transform your room?</h2>
          <p className={styles.ctaText}>
            Select any of these styles in Roomify Studio and watch your room transform with photorealistic precision.
          </p>
          <a href="/studio" className={styles.ctaBtn}>
            Start Designing in Studio &rarr;
          </a>
        </div>
      </main>
    </div>
  )
}
