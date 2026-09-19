import styles from "./styles.module.css"
import { SvgGraphic } from "./RichText"

export default function Bookmark({ slots = [] }: { slots?: string[] }) {
  return (
      <SvgGraphic className={styles["svg-3"]} html={"<svg class=\"framer-9QXVD framer-15zh681\" role=\"presentation\" viewBox=\"0 0 24 24\" data-f2c-idx=\"232\"><use href=\"#2181626897\" data-f2c-idx=\"233\"></use></svg>"} />
  )
}
