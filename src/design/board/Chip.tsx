import styles from "./board.module.css";

export function Chip({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  if (href)
    return (
      <a href={href} className={styles.chip}>
        {children}
      </a>
    );
  else return <div className={styles.chip}>{children}</div>;
}
