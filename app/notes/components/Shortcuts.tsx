'use client'

import React, {useCallback} from "react";
import {useLocalEditorState} from "../hooks/useLocalEditorState";
import {EditorConfig} from "../db/editor";
import {useFiles} from "../db/hooks/useFiles";
import {useRouter} from "next/navigation";

export function Shortcuts({editorConfig}: { editorConfig: EditorConfig }) {
  useShortcuts(editorConfig);

  return <></>;
}

function useShortcuts(editorConfig: EditorConfig) {
  const {save} = useLocalEditorState(
    editorConfig.selectedFile
  );

  useSaveShortcut(save);
  useCreateFileShortcut();
}

function useCreateFileShortcut() {
  const router = useRouter();
  const {optimisticCreateFile} = useFiles();
  const onClickCreate = useCallback(async () => {
    const newFile = await optimisticCreateFile();
    router.push("/notes/" + newFile.key);
  }, [optimisticCreateFile]);

  React.useEffect(() => {
    const createShortcut = (e: KeyboardEvent) => {
      console.log(e.key, e.ctrlKey, e.metaKey)
      if (e.key === "n" && (e.altKey)) {
        e.preventDefault();
        e.stopPropagation();
        onClickCreate().catch(console.error);
      }
    };

    document.addEventListener("keydown", createShortcut);
    return () => document.removeEventListener("keydown", createShortcut);
  }, [onClickCreate])
}

function useSaveShortcut(save: () => void) {
  React.useEffect(() => {
    const saveShortcut = (e: KeyboardEvent) => {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        e.stopPropagation();
        save();
      }
    };

    document.addEventListener("keydown", saveShortcut);
    return () => document.removeEventListener("keydown", saveShortcut);
  }, [save]);
}