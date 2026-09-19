import styles from "./styles.module.css"
import { SvgGraphic } from "./RichText"

export default function Action({ slots = [] }: { slots?: string[] }) {
  return (
      <a className={styles["primary"]} href="./studio">
        <div className={styles["div"]}>
          <p className={styles["p"]}>{slots[0] ?? "Design my room"}</p>
        </div>
        <SvgGraphic className={styles["svg"]} html={"<svg class=\"framer-SYorz framer-1gslj6l\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.5; opacity: 1;\" data-f2c-idx=\"41\"><use href=\"#1175957644\" data-f2c-idx=\"42\"></use></svg>"} />
      </a>
  )
}
