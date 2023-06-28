"use client";

import React from "react";
import styles from "./notes-entry.module.css";
import { Editor } from "./editor/Editor";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import { Cursors } from "./cursors/Cursors";

export default function NotesEntry({
  file,
  content,
  localId,
}: {
  file: NoteFile;
  content: string;
  localId: string;
}) {
  return (
    <ClientSwrConfig fallback={{}}>
      <main className="main tomato">
        <div className={styles.window}>
          <Editor file={file} localId={localId} serverContent={content} />
          <Cursors localId={localId} />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
