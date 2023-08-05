import { useLocalState } from "./useLocalState";
import { NoteFile } from "../utils/file-utils";
import { useEffect } from "react";

export interface RecentView {
  file: NoteFile;
  viewedDate: string;
}

const LOCAL_STORAGE_KEY = "recent-views";

export const useRecentlyViewed = () => {
  return useLocalState<RecentView[]>(LOCAL_STORAGE_KEY, []);
};

export const useRegisterView = (file: NoteFile) => {
  useEffect(() => {
    const state = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]";
    const recentViews: RecentView[] = JSON.parse(state);
    const viewsWithoutFile = recentViews.filter(
      (view) => view.file.key !== file.key
    );
    const latest7Entries = viewsWithoutFile.slice(0, 7);
    const newState = [
      { file, viewedDate: new Date().toISOString() },
      ...latest7Entries,
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
  }, [file]);
};
