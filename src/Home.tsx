import styles from "./styles.module.css"
import { SvgGraphic } from "./RichText"
import Action from "./Action"
import Action2 from "./Action2"
import Bookmark from "./Bookmark"
import RoomifyLayout2 from "./RoomifyLayout2"
import Header from "./components/Header"
import collageStyles from "./components/heroCollage.module.css"
import { FloorPlanSvg } from "./components/HeroEditorialCollage"
import heroArchitecturalImage from "./assets/hero-architectural-editorial.jpg"

export default function Home({ slots = [] }: { slots?: string[] }) {
  return (
    <>
      <div className={styles["div-4"]}>
        <div className={styles["div-5"]}>
          <Header />
          <div className={styles["div-12"]}>
            <section className={`${styles["roomify-introduction"]} ${collageStyles.heroCollageSection}`}>
              {/* Layer 1: Blueprint Drafting Grid & Background Watermark */}
              <div className={collageStyles.blueprintGrid} aria-hidden="true" />
              <div className={collageStyles.blueprintWatermark} aria-hidden="true">
                ROOMIFY
              </div>

              {/* Layer 1: Architectural Floor Plan Drawing behind headline */}
              <FloorPlanSvg />

              {/* Editorial Top Bar with technical annotations */}
              <div className={collageStyles.editorialHeaderBar} aria-hidden="true">
                <div className={collageStyles.editorialMetaGroup}>
                  <span>VOL. IV // STUDIO EDITION</span>
                  <span className={collageStyles.editorialDot} />
                  <span>INTERIOR ARCHITECTURE &amp; DESIGN</span>
                </div>
                <div className={collageStyles.editorialMetaGroup}>
                  <span>PLAN REF. 01-A</span>
                  <span className={collageStyles.editorialDot} />
                  <span>SCALE 1:50</span>
                </div>
              </div>

              {/* Layer 3: Main Left Copy (Headlines, Subtitle, CTA Actions) */}
              <div className={styles["introduction-copy"]} style={{ position: "relative", zIndex: 3 }}>
                <div className={styles["div-13"]}>
                  <p className={styles["p-10"]}>{slots[7] ?? "AI-POWERED ROOM MAKEOVERS"}</p>
                </div>
                <div className={styles["div-14"]}>
                  <h1 className={styles["h1"]}>{slots[8] ?? "Your room has potential. Let’s find it."}</h1>
                </div>
                <div className={styles["div-15"]}>
                  <p className={styles["p-11"]}>{slots[9] ?? "Transform your existing space into a room you’ll actually want to live in. Explore different styles, layouts, colors and moods with Roomify."}</p>
                </div>
                <div className={styles["introduction-actions"]}>
                  <div className={styles["div-16"]}>
                    <Action slots={["Design my room"]} />
                  </div>
                  <div className={styles["div-17"]}>
                    <div className={styles["p-12"]}>
                      <a className={styles["a-2"]} href="/inspiration">{slots[10] ?? "Explore inspiration"}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 2 & 3: Hero Right Wrapper (Single Strong Architectural Hero Visual) */}
              <div className={collageStyles.heroRightWrapper}>
                {/* Editorial Blueprint Callouts & Technical Details */}
                <div className={collageStyles.technicalCalloutTop} aria-hidden="true">
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#536052" }} />
                  STUDIO PERSPECTIVE // ELEVATION 01-A
                </div>
                <div className={collageStyles.technicalCalloutBottom} aria-hidden="true">
                  14'-8" CLEARANCE &middot; CEILING HT. 10'-4"
                </div>

                {/* Material Specification Study Swatch */}
                <div className={collageStyles.materialsStudyCard} aria-hidden="true">
                  <p className={collageStyles.materialsHeader}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    MATERIALS SPEC.
                  </p>
                  <p className={collageStyles.materialsItem}>&bull; Natural White Oak</p>
                  <p className={collageStyles.materialsItem}>&bull; Mineral Limewash</p>
                  <p className={collageStyles.materialsItem}>&bull; Woven Linen &amp; Stone</p>
                </div>

                {/* Precision Framing Corners */}
                <div className={collageStyles.cornerFrameTL} aria-hidden="true" />
                <div className={collageStyles.cornerFrameBR} aria-hidden="true" />

                {/* Main Architectural Hero Interior Visual (Centerpiece) */}
                <div className={`${styles["hero-interior"]} ${collageStyles.mainHeroPhotoLayer}`}>
                  <div className={styles["div-18"]}>
                    <img
                      className={styles["img"]}
                      src={slots[11] && !slots[11].includes("SwoeGJjJENMqN0MXIUmYT2Vvio") ? slots[11] : heroArchitecturalImage}
                      alt="Editorial architectural photography of a contemporary living room with integrated floor-plan drafting linework"
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className={styles["how-it-works"]} id="how-it-works">
              <div className={styles["div-20"]}>
                <h2 className={styles["h2"]}>{slots[13] ?? "From your room to your vision."}</h2>
              </div>
              <div className={styles["makeover-steps"]}>
                <div className={styles["01-upload"]}>
                  <div className={styles["upload-space"]}>
                    <div className={styles["div-21"]}>
                      <img className={styles["img-2"]} src={slots[14] ?? "https://framerusercontent.com/images/juz1BQ71rrYWm1QbnC4062Et8ew.jpg?scale-down-to=512&width=1800&height=1347"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-22"]}>
                    <p className={styles["p-14"]}>{slots[15] ?? "01 — UPLOAD"}</p>
                  </div>
                  <div className={styles["div-23"]}>
                    <p className={styles["p-15"]}>{slots[16] ?? "Start with your space"}</p>
                  </div>
                  <div className={styles["div-24"]}>
                    <p className={styles["p-16"]}>{slots[17] ?? "Upload a photo of your bedroom, living room, office, or any space you want to transform."}</p>
                  </div>
                </div>
                <div className={styles["02-choose"]}>
                  <div className={styles["choose-direction"]}>
                    <div className={styles["div-25"]}>
                      <img className={styles["img-3"]} src={slots[18] ?? "https://framerusercontent.com/images/iSFIGKK8W2lxrvpTz2H7AmLV2w.jpg?scale-down-to=512&width=1800&height=1378"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-26"]}>
                    <p className={styles["p-17"]}>{slots[19] ?? "02 — CHOOSE"}</p>
                  </div>
                  <div className={styles["div-27"]}>
                    <p className={styles["p-18"]}>{slots[20] ?? "Find your style"}</p>
                  </div>
                  <div className={styles["div-28"]}>
                    <p className={styles["p-19"]}>{slots[21] ?? "Choose from carefully curated design directions that feel considered—not copied."}</p>
                  </div>
                </div>
                <div className={styles["01-upload"]}>
                  <div className={styles["upload-space"]}>
                    <div className={styles["div-21"]}>
                      <img className={styles["img-4"]} src={slots[22] ?? "https://framerusercontent.com/images/18HRCnJ1ofAfFsr2y7AcJrdhPLQ.jpg?scale-down-to=512&width=1800&height=1018"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-22"]}>
                    <p className={styles["p-14"]}>{slots[23] ?? "03 — TRANSFORM"}</p>
                  </div>
                  <div className={styles["div-23"]}>
                    <p className={styles["p-15"]}>{slots[24] ?? "See what it could become"}</p>
                  </div>
                  <div className={styles["div-24"]}>
                    <p className={styles["p-16"]}>{slots[25] ?? "Generate a visual concept while keeping the character and proportions of your original room."}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className={styles["interactive-room-makeover"]}>
              <div className={styles["div-29"]}>
                <p className={styles["p-20"]}>{slots[26] ?? "ROOMIFY STUDIO"}</p>
              </div>
              <div className={styles["div-20"]}>
                <h2 className={styles["h2"]}>{slots[27] ?? "A new point of view, without losing the room you love."}</h2>
              </div>
              <div className={styles["before-and-after-comparison"]}>
                <div className={styles["before"]}>
                  <div className={styles["div-30"]}>
                    <img className={styles["img-5"]} src={slots[28] ?? "https://framerusercontent.com/images/juz1BQ71rrYWm1QbnC4062Et8ew.jpg?scale-down-to=1024&width=1800&height=1347"} alt="" />
                  </div>
                  <div className={styles["div-31"]}>
                    <p className={styles["p-21"]}>{slots[29] ?? "BEFORE"}</p>
                  </div>
                </div>
                <div className={styles["before"]}>
                  <div className={styles["div-30"]}>
                    <img className={styles["img-6"]} src={slots[30] ?? "https://framerusercontent.com/images/2dZj6byufNqmM20ajNFNGUDBE.jpg?scale-down-to=1024&width=1800&height=1200"} alt="" />
                  </div>
                  <div className={styles["div-32"]}>
                    <p className={styles["p-22"]}>{slots[31] ?? "AFTER"}</p>
                  </div>
                </div>
                <div className={styles["comparison-divider"]} />
              </div>
              <div className={styles["choose-direction-2"]}>
                <div className={styles["div-29"]}>
                  <p className={styles["p-20"]}>{slots[32] ?? "CHOOSE A DIRECTION"}</p>
                </div>
                <div className={styles["style-options"]}>
                  <div className={styles["minimal-selected"]}>
                    <div className={styles["div-33"]}>
                      <p className={styles["p-23"]}>{slots[33] ?? "Minimal"}</p>
                    </div>
                  </div>
                  <div className={styles["japandi"]}>
                    <div className={styles["div-34"]}>
                      <p className={styles["p-24"]}>{slots[34] ?? "Japandi"}</p>
                    </div>
                  </div>
                  <div className={styles["modern"]}>
                    <div className={styles["div-35"]}>
                      <p className={styles["p-25"]}>{slots[35] ?? "Modern"}</p>
                    </div>
                  </div>
                  <div className={styles["luxury"]}>
                    <div className={styles["div-36"]}>
                      <p className={styles["p-26"]}>{slots[36] ?? "Luxury"}</p>
                    </div>
                  </div>
                  <div className={styles["industrial"]}>
                    <div className={styles["div-37"]}>
                      <p className={styles["p-27"]}>{slots[37] ?? "Industrial"}</p>
                    </div>
                  </div>
                  <div className={styles["indian-contemporary"]}>
                    <div className={styles["div-38"]}>
                      <p className={styles["p-28"]}>{slots[38] ?? "Indian Contemporary"}</p>
                    </div>
                  </div>
                  <div className={styles["scandinavian"]}>
                    <div className={styles["div-39"]}>
                      <p className={styles["p-29"]}>{slots[39] ?? "Scandinavian"}</p>
                    </div>
                  </div>
                  <div className={styles["warm-and-organic"]}>
                    <div className={styles["div-40"]}>
                      <p className={styles["p-30"]}>{slots[40] ?? "Warm & Organic"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles["div-41"]}>
                <Action2 slots={["Generate this look"]} />
              </div>
            </section>
            <section className={styles["style-explorer"]} id="styles">
              <div className={styles["div-29"]}>
                <p className={styles["p-20"]}>{slots[41] ?? "STYLE EXPLORER"}</p>
              </div>
              <div className={styles["div-20"]}>
                <h2 className={styles["h2"]}>{slots[42] ?? "Find your room’s personality."}</h2>
              </div>
              <div className={styles["interior-style-grid"]}>
                <div className={styles["minimal-style"]}>
                  <div className={styles["minimal-interior"]}>
                    <div className={styles["div-42"]}>
                      <img className={styles["img-7"]} src={slots[43] ?? "https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg?scale-down-to=512&width=1800&height=1200"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[44] ?? "Minimal  →"}</p>
                  </div>
                  <div className={styles["div-44"]}>
                    <p className={styles["p-32"]}>{slots[45] ?? "Clean lines, quiet colors, intentional spaces."}</p>
                  </div>
                </div>
                <div className={styles["japandi-style"]}>
                  <div className={styles["minimal-interior"]}>
                    <div className={styles["div-42"]}>
                      <img className={styles["img-7"]} src={slots[46] ?? "https://framerusercontent.com/images/lqvesjnSdK5mljnR3QWTmqpUsw.jpg?scale-down-to=512&width=1800&height=1200"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[47] ?? "Japandi  →"}</p>
                  </div>
                  <div className={styles["div-45"]}>
                    <p className={styles["p-33"]}>{slots[48] ?? "Warm materials, natural textures, calm simplicity."}</p>
                  </div>
                </div>
                <div className={styles["minimal-style"]}>
                  <div className={styles["minimal-interior"]}>
                    <div className={styles["div-42"]}>
                      <img className={styles["img-8"]} src={slots[49] ?? "https://framerusercontent.com/images/fFRyirFPkcBCpE41xtxscshE.jpg?scale-down-to=512&width=1800&height=1013"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[50] ?? "Modern  →"}</p>
                  </div>
                  <div className={styles["div-44"]}>
                    <p className={styles["p-32"]}>{slots[51] ?? "Structured forms, sophisticated contrast."}</p>
                  </div>
                </div>
                <div className={styles["luxury-style"]}>
                  <div className={styles["luxury-interior"]}>
                    <div className={styles["div-46"]}>
                      <img className={styles["img-9"]} src={slots[52] ?? "https://framerusercontent.com/images/rzjp1o2aq93lbOQj6pYJczcBWHI.jpg?scale-down-to=512&width=1800&height=1199"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[53] ?? "Luxury  →"}</p>
                  </div>
                  <div className={styles["div-45"]}>
                    <p className={styles["p-33"]}>{slots[54] ?? "Rich materials, dramatic lighting, refined details."}</p>
                  </div>
                </div>
                <div className={styles["industrial-style"]}>
                  <div className={styles["luxury-interior"]}>
                    <div className={styles["div-46"]}>
                      <img className={styles["img-10"]} src={slots[55] ?? "https://framerusercontent.com/images/UewxeNGdAt68En5hvcQLjY8K7Q.jpg?scale-down-to=512&width=1800&height=1203"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[56] ?? "Industrial  →"}</p>
                  </div>
                  <div className={styles["div-44"]}>
                    <p className={styles["p-32"]}>{slots[57] ?? "Raw textures, metal, concrete and bold forms."}</p>
                  </div>
                </div>
                <div className={styles["luxury-style"]}>
                  <div className={styles["luxury-interior"]}>
                    <div className={styles["div-46"]}>
                      <img className={styles["img-11"]} src={slots[58] ?? "https://framerusercontent.com/images/GaLahZqn0tlYa4J5z3d4E6Wgjmo.jpg?scale-down-to=512&width=1800&height=1200"} alt="" />
                    </div>
                  </div>
                  <div className={styles["div-43"]}>
                    <p className={styles["p-31"]}>{slots[59] ?? "Indian Contemporary  →"}</p>
                  </div>
                  <div className={styles["div-45"]}>
                    <p className={styles["p-33"]}>{slots[60] ?? "Warm materials, Indian character and handcrafted details."}</p>
                  </div>
                </div>
              </div>
            </section>
            <section className={styles["design-your-space"]}>
              <div className={styles["div-29"]}>
                <p className={styles["p-34"]}>{slots[61] ?? "DESIGN YOUR SPACE"}</p>
              </div>
              <div className={styles["div-20"]}>
                <p className={styles["p-35"]}>{slots[62] ?? "Tell Roomify what matters."}</p>
              </div>
              <div className={styles["roomify-concept-interface"]}>
                <div className={styles["customization-controls"]}>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[63] ?? "ROOM     Bedroom · Living room · Office · Dining"}</p>
                  </div>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[64] ?? "STYLE     Minimal · Modern · Japandi · Luxury"}</p>
                  </div>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[65] ?? "MOOD      Calm · Warm · Energetic · Dramatic"}</p>
                  </div>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[66] ?? "LIGHTING  Natural · Warm · Ambient · Bright"}</p>
                  </div>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[67] ?? "BUDGET    ₹50K · ₹1L · ₹2L · ₹5L+"}</p>
                  </div>
                  <div className={styles["div-47"]}>
                    <p className={styles["p-36"]}>{slots[68] ?? "PALETTE   Neutral · Earthy · Monochrome · Warm"}</p>
                  </div>
                  <div className={styles["div-48"]}>
                    <Action2 slots={["Create my concept"]} />
                  </div>
                </div>
                <div className={styles["generated-room-preview"]}>
                  <div className={styles["div-49"]}>
                    <img className={styles["img-12"]} src={slots[69] ?? "https://framerusercontent.com/images/2dZj6byufNqmM20ajNFNGUDBE.jpg?scale-down-to=1024&width=1800&height=1200"} alt="" />
                  </div>
                </div>
              </div>
            </section>
            <section className={styles["inspiration-gallery"]} id="inspiration">
              <div className={styles["div-29"]}>
                <p className={styles["p-20"]}>{slots[70] ?? "INSPIRATION"}</p>
              </div>
              <div className={styles["div-20"]}>
                <h2 className={styles["h2"]}>{slots[71] ?? "Spaces worth coming home to."}</h2>
              </div>
              <div className={styles["saved-spaces"]}>
                <div className={styles["div-50"]}>
                  <div className={styles["warm-minimal-bedroom"]}>
                    <div className={styles["div-51"]}>
                      <img className={styles["img-13"]} src={slots[72] ?? "https://framerusercontent.com/images/lqvesjnSdK5mljnR3QWTmqpUsw.jpg?scale-down-to=512&width=1800&height=1200"} alt="" />
                    </div>
                    <div className={styles["div-52"]}>
                      <div className={styles["p-37"]}>
                        <mark className={styles["mark"]}>{slots[73] ?? "WARM MINIMAL  ·  BEDROOM"}</mark>
                      </div>
                    </div>
                    <Bookmark slots={[]} />
                  </div>
                  <div className={styles["urban-japandi-workspace"]}>
                    <div className={styles["div-53"]}>
                      <img className={styles["img-14"]} src={slots[74] ?? "https://framerusercontent.com/images/UewxeNGdAt68En5hvcQLjY8K7Q.jpg?scale-down-to=512&width=1800&height=1203"} alt="" />
                    </div>
                    <div className={styles["div-54"]}>
                      <div className={styles["p-38"]}>
                        <mark className={styles["mark"]}>{slots[75] ?? "URBAN JAPANDI  ·  WORKSPACE"}</mark>
                      </div>
                    </div>
                    <Bookmark slots={[]} />
                  </div>
                </div>
                <div className={styles["div-50"]}>
                  <div className={styles["modern-earth-living-room"]}>
                    <div className={styles["div-55"]}>
                      <img className={styles["img-15"]} src={slots[76] ?? "https://framerusercontent.com/images/SwoeGJjJENMqN0MXIUmYT2Vvio.jpg?scale-down-to=512&width=1800&height=1200"} alt="" />
                    </div>
                    <div className={styles["div-56"]}>
                      <div className={styles["p-39"]}>
                        <mark className={styles["mark"]}>{slots[77] ?? "MODERN EARTH  ·  LIVING ROOM"}</mark>
                      </div>
                    </div>
                    <Bookmark slots={[]} />
                  </div>
                </div>
                <div className={styles["div-50"]}>
                  <div className={styles["quiet-luxury-bedroom"]}>
                    <div className={styles["div-57"]}>
                      <img className={styles["img-16"]} src={slots[78] ?? "https://framerusercontent.com/images/rzjp1o2aq93lbOQj6pYJczcBWHI.jpg?scale-down-to=512&width=1800&height=1199"} alt="" />
                    </div>
                    <div className={styles["div-58"]}>
                      <div className={styles["p-40"]}>
                        <mark className={styles["mark"]}>{slots[79] ?? "QUIET LUXURY  ·  BEDROOM"}</mark>
                      </div>
                    </div>
                    <Bookmark slots={[]} />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={styles["div-59"]} />
          <div className={styles["div-60"]} />
          <footer className={styles["roomify-footer"]}>
            <div className={styles["div-61"]}>
              <p className={styles["p-41"]}>{slots[80] ?? "ROOMIFY © 2026"}</p>
            </div>
            <div className={styles["div-62"]}>
              <p className={styles["p-42"]}>{slots[81] ?? "Made for rooms with a point of view."}</p>
            </div>
          </footer>
        </div>
        <RoomifyLayout2 slots={[]} />
      </div>
      <div className={styles["div-65"]} style={{ display: "none" }} aria-hidden="true">
        <SvgGraphic className={styles["svg-4"]} html={"<svg id=\"1175957644\" display=\"block\" role=\"presentation\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" data-f2c-idx=\"290\"><path d=\"M 0 0 L 14 0\" fill=\"transparent\" height=\"1px\" id=\"h3fQSrHEV\" stroke-dasharray=\"\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"var(--js9iwy, 2)\" stroke=\"var(--1m973uw, rgb(0,0,0))\" transform=\"translate(5 12)\" width=\"14px\" data-f2c-idx=\"291\"></path><path d=\"M 0 0 L 7 7 L 0 14\" fill=\"transparent\" height=\"14px\" id=\"DAe82Eor1\" stroke-dasharray=\"\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"var(--js9iwy, 2)\" stroke=\"var(--1m973uw, rgb(0,0,0))\" transform=\"translate(12 5)\" width=\"7px\" data-f2c-idx=\"292\"></path></svg>"} />
        <SvgGraphic className={styles["svg-4"]} html={"<svg id=\"2181626897\" display=\"block\" role=\"presentation\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" data-f2c-idx=\"293\"><path d=\"M 14 18 L 7 14 L 0 18 L 0 2 C 0 0.895 0.895 0 2 0 L 12 0 C 13.105 0 14 0.895 14 2 Z\" fill=\"transparent\" height=\"18px\" id=\"GFRHzjtfU\" stroke-dasharray=\"\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"var(--js9iwy, 2)\" stroke=\"var(--1m973uw, rgb(0,0,0))\" transform=\"translate(5 3)\" width=\"14px\" data-f2c-idx=\"294\"></path></svg>"} />
      </div>
    </>
  )
}
