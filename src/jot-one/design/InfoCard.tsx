import styles from "./design.module.css";
import React from "react";

export function InfoCard({
  children,
  style,
  className = "",
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <div style={style} className={[styles.infoCard, className].join(" ")}>
      {children}
    </div>
  );
}
