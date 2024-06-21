import styles from "./editor.module.css";
import React, { useState } from "react";
import { useLocalEditorState } from "../../utils/hooks/useLocalEditorState";
import { NoteFile } from "../../utils/file-utils";
import { useSaveShortcut } from "../../utils/hooks/useSaveShortcut";
import { useCollaborativeEditor } from "../collaborative-editor/collaborative-editor";
import { persistNowWith } from "../collaborative-editor/y-doc-persister";
import { BottomBarWrapper } from "../bottom-bar/BottomBarWrapper";
import { DownloadButton } from "../bottom-bar/DownloadButton";

export default Editor;

export function Editor({
  file,
  serverContent,
  persist,
  localId,
  gotoTitle,
}: {
  file: NoteFile;
  serverContent: Uint8Array;
  persist: (content: Uint8Array) => Promise<void>;
  localId: string;
  gotoTitle: string | undefined;
}) {
  const { fontSize } = useLocalEditorState();
  const [editorRef, setEditorRef] = useState<any>(null);
  const { ready, yDoc } = useCollaborativeEditor(
    localId,
    file,
    editorRef,
    serverContent,
    persist,
    gotoTitle
  );

  const persistDoc = React.useCallback(() => {
    if (!ready || !yDoc) return;
    persistNowWith(yDoc, persist);
  }, [persist, ready, yDoc]);

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
      <BottomBarWrapper>
        <DownloadButton file={file} yDoc={yDoc} />
      </BottomBarWrapper>
    </>
  );
}
