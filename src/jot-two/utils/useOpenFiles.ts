import { useCallback, useEffect } from "react";
import { JotTwoFile } from "../file/file-utils";
import { useLocalState } from "./useLocalState";

export interface OpenFile {
  file: JotTwoFile;
  firstOpenedTime: string;
}

const LOCAL_STORAGE_KEY = "open-files";

export const useOpenFiles = () => {
  const { localState, setLocalState, isReady } = useLocalState<OpenFile[]>(
    LOCAL_STORAGE_KEY,
    [],
  );

  const closeFile = useCallback(
    (file: JotTwoFile) => {
      const newState = localState.filter((view) => view.file.key !== file.key);
      setLocalState(newState);
    },
    [localState, setLocalState],
  );

  return { openFiles: localState, isReady, closeFile };
};

export const useRegisterOpenFile = (file: JotTwoFile) => {
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
