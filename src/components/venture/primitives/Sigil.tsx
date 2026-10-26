import styles from "../venture.module.css";

export default function Sigil() {
  return (
    <span className={styles.sigil} aria-hidden="true">
      <span className={styles.swordMark} />
    </span>
  );
}
