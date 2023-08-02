import styles from "./editor.module.css";
import React, { useState } from "react";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import { usePresence } from "../../../ably/presence";
import { NoteFile } from "../../utils/file-utils";
import { useSaveShortcut } from "../Shortcuts";
import { useEditorData } from "./y-adapter";
import { persistNowWith } from "./YDocPersister";

export default Editor;

export function Editor({
  file,
  serverContent,
  persist,
  localId,
}: {
  file: NoteFile;
  serverContent: Uint8Array;
  persist: (content: Uint8Array) => Promise<void>;
  localId: string;
}) {
  const { fontSize } = useLocalEditorState();
  const { onlineUsers, userName } = usePresence(file, localId);
  const [editorRef, setEditorRef] = useState(null);
  const { ready, yDoc } = useEditorData(
    localId,
    file,
    editorRef,
    serverContent,
    persist
  );

  const persistDoc = React.useCallback(() => {
    if (!ready) return;
    persistNowWith(yDoc, persist);
  }, [persist, ready, yDoc]);

  useSaveShortcut(persistDoc);

  return (
    <div
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
        ref={(newEditorRef) => setEditorRef(newEditorRef)}
        className={styles.editorParent}
      />
    </div>
  );
}
