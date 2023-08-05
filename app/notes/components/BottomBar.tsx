import styles from "./notes-entry.module.css";
import revertIcon from "./revert.svg";
import Image from "next/image";
import { useState } from "react";
import { HistoryModal } from "./history-modal/HistoryModal";

enum View {
  None,
  History,
}

export function BottomBar({ file, yDoc }) {
  const [view, setView] = useState<View>(View.None);

  return (
    <>
      <div className={styles.bottomBar}>
        <button
          className={styles.bottomBarButton}
          onClick={() => setView(View.History)}
        >
          <Image src={revertIcon.src} alt="History" width={42} height={42} />
        </button>
      </div>
      {view === View.History && (
        <HistoryModal
          file={file}
          yDoc={yDoc}
          close={() => setView(View.None)}
        />
      )}
    </>
  );
}
