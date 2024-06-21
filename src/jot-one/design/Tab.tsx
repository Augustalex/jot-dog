import styles from "./design.module.css";
import React from "react";
import { BaseButtonProps } from "./Base";
import Link from "next/link";

export function Tab({
  children,
  className = "",
  onClose,
  onClick,
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
      onClick={onClick}
    >
      <span className={[styles.tabText, "truncate"].join(" ")}>{children}</span>
      <button
        className={styles.tabDeleteButton}
        onClick={(e) => {
          // Prevent clicking through to the Link
          e.preventDefault();
          e.stopPropagation();

          onClose(e);
        }}
      >
        x
      </button>
    </Link>
  );
}
