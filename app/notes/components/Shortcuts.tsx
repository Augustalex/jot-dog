'use client'

import React from "react";
import {useLocalEditorState} from "../hooks/useLocalEditorState";
import {NoteFile} from "../utils/file-utils";

export function Shortcuts({file}: {
  file: NoteFile
}) {
  useShortcuts(file);

  return null;
}

function useShortcuts(file: NoteFile) {
  const {save} = useLocalEditorState(file);

  useSaveShortcut(save);
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