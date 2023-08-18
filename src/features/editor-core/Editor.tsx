import styles from "./editor.module.css";
import React, { useState } from "react";
import { useLocalEditorState } from "../../utils/hooks/useLocalEditorState";
import { NoteFile } from "../../utils/file-utils";
import { useSaveShortcut } from "../shortcuts/Shortcuts";
import { useCollaborativeEditor } from "../collaborative-editor/collaborative-editor";
import { persistNowWith } from "../collaborative-editor/y-doc-persister";
import { BottomBar } from "../bottom-bar/BottomBar";

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
  const [editorRef, setEditorRef] = useState(null);
  const { ready, yDoc } = useCollaborativeEditor(
    localId,
    file,
    editorRef,
    serverContent,
    persist
  );

  const persistDoc = React.useCallback(() => {
    if (!ready) return;
    persistNowWith(file, yDoc, persist);
  }, [file, persist, ready, yDoc]);

  useSaveShortcut(persistDoc);

  return (
    <>
      <div
        className={styles.editorWindow}
        style={{
          fontSize: fontSize + "px",
        }}
      >
        <div
          ref={(newEditorRef) => setEditorRef(newEditorRef)}
          className={styles.editorParent}
        />
      </div>
      <BottomBar file={file} yDoc={yDoc} />
    </>
  );
}
