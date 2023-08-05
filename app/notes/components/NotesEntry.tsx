"use client";

import React, { useMemo } from "react";
import styles from "./notes-entry.module.css";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import dynamic from "next/dynamic";
import { fileClient } from "../db/fileClient";
import { useRegisterView } from "../hooks/useRecentlyViewed";

const Editor = dynamic(() => import("./editor/Editor"), { ssr: false });

export default function NotesEntry({
  file,
  content,
  localId,
}: {
  file: NoteFile;
  content: Uint8Array;
  localId: string;
}) {
  useRegisterView(file);
  const persist = useMemo(
    () => (file: NoteFile, content: Uint8Array) =>
      fileClient.saveBinaryData(file, content),
    []
  );

  return (
    <ClientSwrConfig fallback={{}}>
      <main className="main editor">
        <div className={styles.window}>
          <Editor
            file={file}
            localId={localId}
            serverContent={content}
            persist={(newContent) => persist(file, newContent)}
          />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
