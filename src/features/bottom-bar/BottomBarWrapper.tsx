import styles from "./bottom-bar.module.css";

export function BottomBarWrapper({ children }: { children: React.ReactNode }) {
  return <div className={styles.bottomBar}>{children}</div>;
}
