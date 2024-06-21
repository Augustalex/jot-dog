import styles from "./bottom-bar.module.css";
import {ReactNode} from "react";

export function BottomBarWrapper({ children }: { children: ReactNode }) {
  return <div className={styles.bottomBar}>{children}</div>;
}
