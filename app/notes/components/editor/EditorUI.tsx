"use client";

import styles from "./editor.module.css";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useSelectedContent } from "../../db/hooks/useSelectedContent";
import { EditorConfig } from "../../db/editor";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import { EditorView } from "@codemirror/view";

let myTheme = EditorView.theme(
  {
    "&.cm-editor.cm-focused": { outline: "0" },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "var(--color-highlight)",
      borderWidth: "3px",
    },
  },
  { dark: false }
);
const extensions = [markdown({}), myTheme];

export function EditorUI({ editorConfig }: { editorConfig: EditorConfig }) {
  const content = useSelectedContent().data;
  const { scheduleSave, setUnsavedContent, fontSize } = useLocalEditorState(
    editorConfig.selectedFile
  );
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );

  return (
    <div
      ref={(newRef) => setEditorWindow(newRef)}
      className={styles.editorWindow}
      style={{
        fontSize: fontSize + "px",
      }}
    >
      <CodeMirror
        value={content}
        height={editorWindow?.offsetHeight + "px"}
        extensions={extensions}
        onChange={async (newContent) => {
          setUnsavedContent(newContent);
          await scheduleSave(newContent);
        }}
        placeholder={"Make a note..."}
        autoFocus
      />
    </div>
  );
}
