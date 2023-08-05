import styles from "./design.module.css";
import React from "react";
import Link from "next/link";

export function LinkCard({
  children,
  style,
  className = "",
  href,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  href: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Link
      style={style}
      className={[styles.card, className].join(" ")}
      href={href}
    >
      {children}
    </Link>
  );
}
