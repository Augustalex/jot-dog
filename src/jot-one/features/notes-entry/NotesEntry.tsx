"use client";

import React, { useMemo } from "react";
import styles from "./notes-entry.module.css";
import { NoteFile } from "../../utils/file-utils";
import dynamic from "next/dynamic";
import { fileClient } from "../../../app/one/files/file-client";
import { useRegisterView } from "../../utils/hooks/useRecentlyViewed";

const Editor = dynamic(() => import("../editor/Editor"), {
  ssr: false,
});

export default function NotesEntry({
  file,
  content,
  localId,
  gotoTitle,
}: {
  file: NoteFile;
  content: Uint8Array;
  localId: string;
  gotoTitle: string | undefined;
}) {
  useRegisterView(file);
  const persist = useMemo(
    () => (file: NoteFile, content: Uint8Array) =>
      fileClient.saveBinaryData(file, content),
    []
  );

  return (
    <main className="main editor">
      <div className={styles.window}>
        <Editor
          file={file}
          localId={localId}
          serverContent={content}
          persist={(newContent) => persist(file, newContent)}
          gotoTitle={gotoTitle}
        />
      </div>
    </main>
  );
}
