"use client";

import styles from "./editor.module.css";
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import { EditorView } from "@codemirror/view";
import { usePresence } from "../../../ably/presence";
import { NoteFile } from "../../utils/file-utils";
import { useDoc } from "../../../ably/live-doc";
import { useSaveShortcut } from "../Shortcuts";

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
  serverContent,
  localId,
}: {
  file: NoteFile;
  serverContent: string;
  localId: string;
}) {
  const { fontSize } = useLocalEditorState();
  const { onlineUsers, userName } = usePresence(file, localId);
  const { doc, updateDoc, backup } = useDoc(file, serverContent, localId);
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );
  useSaveShortcut(backup);

  return (
    <div
      ref={(newRef) => setEditorWindow(newRef)}
      className={styles.editorWindow}
      style={{
        fontSize: fontSize + "px",
      }}
    >
      <div style={{ display: "none" }}>
        <span>You ({userName})</span>
        {onlineUsers.map((c) => {
          return <span key={c}>, {c}</span>;
        })}
      </div>
      <CodeMirror
        value={doc}
        height={editorWindow?.offsetHeight + "px"}
        extensions={extensions}
        onChange={updateDoc}
        placeholder={"Make a note..."}
        autoFocus
      />
    </div>
  );
}
