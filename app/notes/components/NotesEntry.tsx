"use client";

import React from "react";
import styles from "./notes-entry.module.css";
import { FileBar } from "./file-bar/FileBar";
import { Editor } from "./editor/Editor";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { FILES_KEY } from "../db/hooks/useFiles";
import { EDITOR_CONFIG_KEY } from "../db/hooks/useEditorConfig";
import {NoteFile} from "../utils/file-utils";
import {Shortcuts} from "./Shortcuts";

export default function NotesEntry({
  files,
  selectedFile: routeFile,
}: {
  files: NoteFile[];
  selectedFile?: NoteFile;
}) {
  const selectedFile = routeFile ?? {
    name: "scratch",
    key: "scratch",
  };
  const editorConfig = {
    selectedFile,
  };

  return (
    <ClientSwrConfig
      fallback={{
        [EDITOR_CONFIG_KEY]: editorConfig,
        [FILES_KEY]: files,
      }}
    >
      <main className="main tomato">
        <div className={styles.window}>
          <FileBar selectedFile={selectedFile} />
          <Editor editorConfig={editorConfig} />
          <Shortcuts editorConfig={editorConfig} />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
