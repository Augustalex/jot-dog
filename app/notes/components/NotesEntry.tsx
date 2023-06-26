"use server";

import React from "react";
import styles from "./notes-entry.module.css";
import { FileBar } from "./file-bar/FileBar";
import { Editor } from "./editor/Editor";
import { getFiles, NoteFile } from "../db/files";
import { ClientSwrConfig } from "./ClientSwrConfig";
import { FILES_KEY } from "../db/hooks/useFiles";
import { EDITOR_CONFIG_KEY } from "../db/hooks/useEditorConfig";
import { getFile } from "../db/file";
import { getContentKey } from "../db/hooks/useSelectedContent";
import { DynamicPresentation } from "./presentation/DynamicPresentation";

export default async function NotesEntry({
  selectedFile,
}: {
  selectedFile: NoteFile;
}) {
  const files = await getFiles();
  const editorConfig = {
    selectedFile,
  };
  const content = await getFile(editorConfig.selectedFile);

  return (
    <ClientSwrConfig
      fallback={{
        [EDITOR_CONFIG_KEY]: editorConfig,
        [FILES_KEY]: files,
        [getContentKey(selectedFile.key)]: content,
      }}
    >
      <main className="main">
        <div className={styles.window}>
          <FileBar selectedFile={selectedFile} />
          <Editor editorConfig={editorConfig} />
          <DynamicPresentation editorConfig={editorConfig} />
        </div>
      </main>
    </ClientSwrConfig>
  );
}
