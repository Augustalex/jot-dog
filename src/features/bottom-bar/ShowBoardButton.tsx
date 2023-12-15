import styles from "./bottom-bar.module.css";
import boardIcon from "../../app/images/board.svg";
import Image from "next/image";

export function ShowBoardButton({ file }) {
  const href = `/${file.key}/board`;

  return (
    <a className={styles.bottomBarButton} href={href} title="Go to board">
      <Image src={boardIcon.src} alt="Board" width={42} height={42} />
    </a>
  );
}
