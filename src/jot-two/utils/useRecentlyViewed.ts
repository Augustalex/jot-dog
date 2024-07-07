import { useCallback, useEffect } from "react";
import { useLocalState } from "../../jot-one/utils/hooks/useLocalState";
import { NoteFile } from "../file/file-utils";

export interface RecentView {
  file: NoteFile;
  viewedDate: string;
}

const LOCAL_STORAGE_KEY = "recently-viewed";

export const useRecentlyViewed = () => {
  const { localState, setLocalState, isReady } = useLocalState<RecentView[]>(
    LOCAL_STORAGE_KEY,
    [],
  );

  const removeFileFromRecent = useCallback(
    (file: NoteFile) => {
      const newState = localState.filter((view) => view.file.key !== file.key);
      setLocalState(newState);
    },
    [localState, setLocalState],
  );

  return { recentlyViewed: localState, isReady, removeFileFromRecent };
};

export const useRegisterView = (file: NoteFile) => {
  useEffect(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]";
    const recentViews: RecentView[] = JSON.parse(state);
    const viewsWithoutFile = recentViews.filter(
      (view) => view.file.key !== file.key,
    );
    const latest7Entries = viewsWithoutFile.slice(0, 7);
    const newState = [
      { file, viewedDate: new Date().toISOString() },
      ...latest7Entries,
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  }, [file]);
};
