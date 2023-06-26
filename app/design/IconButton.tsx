import styles from "./design.module.css";
import React from "react";
import { BaseButtonProps } from "./Base";

interface IconButton extends BaseButtonProps {}

export function IconButton({ children, className = "", ...props }: IconButton) {
  return (
    <button
      className={[styles.button, styles.iconButton, className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
