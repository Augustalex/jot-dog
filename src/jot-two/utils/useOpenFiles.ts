import { useCallback, useEffect } from "react";
import { NoteFile } from "../file/file-utils";
import { useLocalState } from "./useLocalState";

export interface OpenFile {
  file: NoteFile;
  firstOpenedTime: string;
}

const LOCAL_STORAGE_KEY = "open-files";

export const useOpenFiles = () => {
  const { localState, setLocalState, isReady } = useLocalState<OpenFile[]>(
    LOCAL_STORAGE_KEY,
    [],
  );

  const closeFile = useCallback(
    (file: NoteFile) => {
      const newState = localState.filter((view) => view.file.key !== file.key);
      setLocalState(newState);
    },
    [localState, setLocalState],
  );

  return { openFiles: localState, isReady, closeFile };
};

export const useRegisterOpenFile = (file: NoteFile) => {
  useEffect(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]";
    const recentViews: OpenFile[] = JSON.parse(state);

    const fileAlreadyRegistered = recentViews.find(
      (view) => view.file.key === file.key,
    );
    if (fileAlreadyRegistered) return;

    const newState: OpenFile[] = [
      ...recentViews,
      { file, firstOpenedTime: new Date().toISOString() },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  }, [file]);
};
