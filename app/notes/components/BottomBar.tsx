import styles from "./notes-entry.module.css";
import revertIcon from "./revert.svg";
import lockIcon from "../../lock.svg";
import Image from "next/image";
import { useState } from "react";
import { HistoryModal } from "./history-modal/HistoryModal";
import { LockModal } from "./lock-modal/LockModal";

enum View {
  None,
  History,
  LockNote,
}

export function BottomBar({ file, yDoc }) {
  const [view, setView] = useState<View>(View.None);

  return (
    <>
      <div className={styles.bottomBar}>
        <button
          className={styles.bottomBarButton}
          onClick={() => setView(View.LockNote)}
          title="Lock note"
        >
          <Image src={lockIcon.src} alt="Lock" width={42} height={42} />
        </button>
        <button
          className={styles.bottomBarButton}
          onClick={() => setView(View.History)}
          title="Local history"
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
      {view === View.LockNote && (
        <LockModal file={file} close={() => setView(View.None)} />
      )}
    </>
  );
}
