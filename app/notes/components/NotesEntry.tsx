"use client";

import React, { useMemo } from "react";
import styles from "./notes-entry.module.css";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { NoteFile } from "../utils/file-utils";
import { Cursors } from "./cursors/Cursors";
import dynamic from "next/dynamic";
import { saveFile } from "../db/file";
import debounce from "lodash/debounce";
import { fileClient } from "../db/fileClient";

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
  const saveFileSoon = useMemo(
    () =>
      debounce(async (file: NoteFile, content: Uint8Array) => {
        await fileClient.saveBinaryData(file, content);
      }, 5000),
    []
  );

  return (
    <ClientSwrConfig fallback={{}}>
      <main className="main tomato">
        <div className={styles.window}>
          <Editor
            file={file}
            localId={localId}
            serverContent={content}
            persist={async (newContent) => {
              console.log("Calling debounced save file...");
              await saveFileSoon(file, newContent);
            }}
          />
          {/*<Cursors file={file} localId={localId} />*/}
        </div>
      </main>
    </ClientSwrConfig>
  );
}
