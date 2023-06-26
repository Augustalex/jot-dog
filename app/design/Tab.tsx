import styles from "./design.module.css";
import React from "react";
import { BaseButtonProps } from "./Base";
import Link from "next/link";

export function Tab({
  children,
  className = "",
  onClose,
  href,
  selected,
}: BaseButtonProps & {
  selected: boolean;
  href: string;
  onClose: (e: React.MouseEvent) => void;
}) {
  return (
    <Link
      href={href}
      className={[
        styles.button,
        styles.tab,
        selected ? styles.tabSelected : "",
        className,
      ].join(" ")}
    >
      <span className={[styles.tabText, "truncate"].join(" ")}>{children}</span>
      <button className={styles.tabDeleteButton} onClick={onClose}>
        x
      </button>
    </Link>
  );
}
