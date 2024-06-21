import styles from "./bottom-bar.module.css";
import lockIcon from "../../../app/images/lock.svg";
import Image from "next/image";
import { useState } from "react";
import { LockModal } from "../lock-modal/LockModal";
import { toggles } from "../toggles";
import { NoteFile } from "../../utils/file-utils";

export function LockNoteButton({ file }: { file: NoteFile }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {toggles.private_notes && (
        <button
          className={styles.bottomBarButton}
          onClick={() => setShowModal(true)}
          title="Lock note"
        >
          <Image src={lockIcon.src} alt="Lock" width={42} height={42} />
        </button>
      )}
      {showModal && <LockModal file={file} close={() => setShowModal(false)} />}
    </>
  );
}
