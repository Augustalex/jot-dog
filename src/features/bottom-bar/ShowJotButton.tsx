import styles from "./bottom-bar.module.css";
import noteIcon from "../../app/images/note.svg";
import Image from "next/image";

export function ShowJotButton({ file }) {
  const href = `/${file.key}`;

  return (
    <a className={styles.bottomBarButton} href={href} title="Go to Jot">
      <Image src={noteIcon.src} alt="Board" width={42} height={42} />
    </a>
  );
}
