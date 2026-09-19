import styles from "./styles.module.css"
import { SvgGraphic } from "./RichText"

export default function Action2({ slots = [] }: { slots?: string[] }) {
  return (
      <a className={styles["primary-2"]} href="/studio">
        <div className={styles["div-2"]}>
          <p className={styles["p-2"]}>{slots[0] ?? "Generate this look"}</p>
        </div>
        <SvgGraphic className={styles["svg-2"]} html={"<svg class=\"framer-SYorz framer-1gslj6l\" role=\"presentation\" viewBox=\"0 0 24 24\" style=\"--1m973uw: rgb(255, 255, 255); --js9iwy: 1.5; opacity: 1;\" data-f2c-idx=\"135\"><use href=\"#1175957644\" data-f2c-idx=\"136\"></use></svg>"} />
      </a>
  )
}
