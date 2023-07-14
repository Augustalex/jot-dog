"use client";

import React from "react";
import styles from "./notes-entry.module.css";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import { Cursors } from "./cursors/Cursors";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./editor/Editor"), { ssr: false });

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
          {/*<Cursors file={file} localId={localId} />*/}
        </div>
      </main>
    </ClientSwrConfig>
  );
}
