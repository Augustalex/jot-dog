import styles from "./history.module.css";
import React, { useMemo, useRef, useState } from "react";
import { FileBackup, YDocBackup } from "../collaborative-editor/y-doc-backup";
import { NoteFile } from "../../utils/file-utils";
import * as Y from "yjs";
import { usePreviewEditor } from "../editor-core/preview-editor";
import { IBM_Plex_Mono } from "next/font/google";

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
  const [selectedBackup, setSelectedBackup] = useState<FileBackup | null>(
    backups[0] ?? null
  );
  const previewDoc = useMemo(() => {
    if (!selectedBackup) return new Y.Doc();
    return YDocBackup({ file, yDoc }).preview(selectedBackup);
  }, [file, selectedBackup, yDoc]);
  const [previewEditorRef, setPreviewEditorRef] = useState(null);
  usePreviewEditor(previewDoc, previewEditorRef);

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
                onClick={() => previewBackup(backup)}
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

  function previewBackup(backup: FileBackup) {
    setSelectedBackup(backup);
  }

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