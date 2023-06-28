"use client";

import React from "react";
import styles from "./notes-entry.module.css";
import { Editor } from "./editor/Editor";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import { Shortcuts } from "./Shortcuts";
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
          <Editor file={file} content={content} localId={localId} />
          <Cursors localId={localId} />
          <Shortcuts file={file} />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
