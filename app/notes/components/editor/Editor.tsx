import styles from "./editor.module.css";
import React, { useRef, useState } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import { EditorView } from "@codemirror/view";
import { usePresence } from "../../../ably/presence";
import { NoteFile } from "../../utils/file-utils";
import { useDoc } from "../../../ably/live-doc";
import { useSaveShortcut } from "../Shortcuts";
import { useAblyClient } from "../../../ably/client";
import { liveRangesRenderer, liveRangesUpdater } from "./display-plugin";
import Ably from "ably/promises";
import { setupLiveRanges } from "../../../ably/imperative-ranges";
import { useEditorData } from "./y-adapter";

const collabState = {
  ranges: [
    {
      from: 0,
      to: 5,
    },
  ],
};

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
export default EditorWithAbly;

export function EditorWithAbly({
  file,
  serverContent,
  localId,
}: {
  file: NoteFile;
  serverContent: string;
  localId: string;
}) {
  const { ably: ablyRef } = useAblyClient(localId);

  if (!ablyRef.get()) return null;
  return (
    <Editor
      ably={ablyRef.get()}
      file={file}
      serverContent={serverContent}
      localId={localId}
    />
  );
}

export function Editor({
  ably,
  file,
  serverContent,
  localId,
}: {
  ably: Ably.Types.RealtimePromise;
  file: NoteFile;
  serverContent: string;
  localId: string;
}) {
  const refs = React.useRef<ReactCodeMirrorRef>();
  const { fontSize } = useLocalEditorState();
  const { onlineUsers, userName } = usePresence(file, localId);
  const { doc, updateDoc, backup } = useDoc(file, serverContent, localId);
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );
  const [editor, setEditor] = useState(null);
  useSaveShortcut(backup);
  const liveRangesClient = setupLiveRanges(ably, file, updateCollabState);
  const { ready, initialDoc, extensions } = useEditorData(
    localId,
    editor,
    serverContent
  );

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
      <div
        ref={(newEditorRef) => setEditor(newEditorRef)}
        className={styles.editorParent}
      />
      {/*<CodeMirror*/}
      {/*  ref={refs}*/}
      {/*  value={initialDoc}*/}
      {/*  height={editorWindow?.offsetHeight + "px"}*/}
      {/*  basicSetup={{*/}
      {/*    highlightSelectionMatches: false,*/}
      {/*  }}*/}
      {/*  extensions={extensions}*/}
      {/*  placeholder={"Make a note..."}*/}
      {/*  autoFocus*/}
      {/*/>*/}
    </div>
  );
}

function updateCollabState(ranges) {
  collabState.ranges = ranges.map((r) => ({
    from: r.s,
    to: r.e,
  }));
}
