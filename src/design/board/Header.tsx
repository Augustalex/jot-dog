import styles from "./board.module.css";

export function Header({ text }: { text: string }) {
  return <span className={styles.header}>{text}</span>;
}
