import styles from "./design.module.css";
import React from "react";

export function Button({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={[styles.button, styles.inlineButton, className].join(" ")}
    >
      {children}
    </button>
  );
}
