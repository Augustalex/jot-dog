import styles from "./history.module.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { NoteFile } from "../../utils/file-utils";
import * as Y from "yjs";
import { usePreviewEditor } from "../editor/preview-editor";
import { IBM_Plex_Mono } from "next/font/google";
import { DocBackup, YDocBackup } from "../collaborative-editor/y-doc-backup";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface HistoryModalProps {
  file: NoteFile;
  yDoc: Y.Doc;
  close(): void;
}

export function HistoryModal({ file, yDoc, close }: HistoryModalProps) {
  const historyModalRoot = useRef<HTMLDivElement>(null);
  const { backups } = useLocalHistory({ file, yDoc });
  const [selectedBackup, setSelectedBackup] = useState<DocBackup | null>(
    backups[0] ?? null
  );
  const [previewEditorRef, setPreviewEditorRef] = useState(null);
  usePreviewEditor(selectedBackup?.text ?? "", previewEditorRef);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <div
      className={`${styles.historyOverlay} ${ibmPlexMono.className}`}
      onClick={onOverlayClick}
    >
      <div ref={historyModalRoot} className={styles.historyRoot}>
        <div className={styles.backupList}>
          {backups.map((backup) => {
            return (
              <button
                key={backup.day}
                onClick={() => setSelectedBackup(backup)}
                className={`${styles.backup} ${
                  backup === selectedBackup ? styles.backupSelected : ""
                }`}
              >
                <span>{backup.day}</span>
              </button>
            );
          })}
          {backups.length === 0 && (
            <div className={`${styles.backup}`}>No backups yet</div>
          )}
        </div>
        <div
          className={styles.previewContainer}
          key={selectedBackup?.day ?? "empty"}
        >
          <div
            ref={(newRef) => setPreviewEditorRef(newRef)}
            key={selectedBackup?.day ?? "empty"}
            className={styles.previewEditor}
          />
        </div>
      </div>
    </div>
  );

  function onOverlayClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (
      target !== historyModalRoot.current &&
      !historyModalRoot.current?.contains(target)
    ) {
      close();
    }
  }
}

function useLocalHistory({ file, yDoc }: { file: NoteFile; yDoc: Y.Doc }) {
  const localBackup = useMemo(() => YDocBackup({ yDoc, file }), [file, yDoc]);
  const backups = useMemo(
    () =>
      localBackup
        .getAll()
        .slice()
        .sort((a, b) => b.day.localeCompare(a.day)),
    [localBackup]
  );

  return {
    backups,
  };
}
