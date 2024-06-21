import styles from "./bottom-bar.module.css";
import revertIcon from "../../../app/images/revert.svg";
import Image from "next/image";
import { useState } from "react";
import { HistoryModal } from "../history-modal/HistoryModal";
import { toggles } from "../toggles";
import { NoteFile } from "../../utils/file-utils";
import * as Y from "yjs";
import { createPortal } from "react-dom";

export function LocalHistoryButton({
  file,
  yDoc,
}: {
  file: NoteFile;
  yDoc: Y.Doc;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {toggles.local_history && (
        <button
          className={styles.bottomBarButton}
          onClick={() => setShowModal(true)}
          title="Local history"
        >
          <Image src={revertIcon.src} alt="History" width={42} height={42} />
        </button>
      )}
      {showModal &&
        createPortal(
          <HistoryModal
            file={file}
            yDoc={yDoc}
            close={() => setShowModal(false)}
          />,
          document.body
        )}
    </>
  );
}
