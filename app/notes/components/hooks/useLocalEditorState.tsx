"use client";

import React, { useCallback } from "react";
import debounce from "lodash/debounce";
import { saveFile } from "../../db/file";
import { mutate } from "swr";
import { getContentKey } from "../../db/hooks/useSelectedContent";
import { NoteFile } from "../../db/files";
import { create } from "zustand";

const SAVE_DEBOUNCE_TIME = 20 * 1000;
export const debouncedSaveFile = debounce(saveFile, SAVE_DEBOUNCE_TIME);

export enum ViewMode {
  Editor = "editor",
  Presenting = "presenting",
}

interface LocalEditorStore {
  unsavedContent: string | null;

  setUnsavedContent(unsavedContent: string | null): void;

  fontSize: number;

  setFontSize(fontSize: number): void;

  viewMode: ViewMode;

  present(): void;

  exitPresentation(): void;
}

const useLocalEditorStore = create<LocalEditorStore>((set) => ({
  unsavedContent: null as string | null,
  setUnsavedContent: (unsavedContent: string | null) =>
    set((state) => ({ ...state, unsavedContent })),
  fontSize: 16,
  setFontSize: (fontSize: number) => set((state) => ({ ...state, fontSize })),
  viewMode: ViewMode.Editor,
  present: () => set((state) => ({ ...state, viewMode: ViewMode.Presenting })),
  exitPresentation: () =>
    set((state) => ({ ...state, viewMode: ViewMode.Editor })),
}));

export function useLocalEditorState(selectedFile: NoteFile) {
  const {
    unsavedContent,
    setUnsavedContent,
    fontSize,
    setFontSize,
    viewMode,
    present,
    exitPresentation,
  } = useLocalEditorStore();

  const save = React.useCallback(async () => {
    await saveFile(selectedFile, unsavedContent);
    await mutate(getContentKey(selectedFile.key), unsavedContent, {
      revalidate: false,
    });
    setUnsavedContent(null);
  }, [selectedFile, setUnsavedContent, unsavedContent]);

  const scheduleSave = useCallback(
    async (newContent: string) => {
      setUnsavedContent(newContent);
      debouncedSaveFile(selectedFile, newContent);
      await mutate(getContentKey(selectedFile.key), newContent, {
        revalidate: false,
      });
    },
    [selectedFile, setUnsavedContent]
  );

  return {
    scheduleSave,
    setUnsavedContent,
    save,
    isSaved: unsavedContent === null,
    fontSize,
    setFontSize,
    viewMode,
    present,
    exitPresentation,
  };
}
