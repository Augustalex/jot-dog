"use client";

import styles from "./editor.module.css";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useSelectedContent } from "../../db/hooks/useSelectedContent";
import { EditorConfig } from "../../db/editor";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import { EditorView } from "@codemirror/view";
import { usePresence } from "../../../ably/presence";
import { NoteFile } from "../../utils/file-utils";

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

export function Editor({
  file,
  content,
  localId,
}: {
  file: NoteFile;
  content: string;
  localId: string;
}) {
  const { scheduleSave, setUnsavedContent, fontSize } =
    useLocalEditorState(file);
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );
  const { clients } = usePresence(localId);

  return (
    <div
      ref={(newRef) => setEditorWindow(newRef)}
      className={styles.editorWindow}
      style={{
        fontSize: fontSize + "px",
      }}
    >
      <div>
        {clients.map((c) => {
          return <span key={c}>{c}, </span>;
        })}
      </div>
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
