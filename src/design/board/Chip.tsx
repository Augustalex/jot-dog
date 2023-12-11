import styles from "./board.module.css";

export function Chip({ children }: { children: React.ReactNode }) {
  return <div className={styles.chip}>{children}</div>;
}
