"use client";

import { create } from "zustand";
interface LocalEditorStore {
  fontSize: number;
  setFontSize(fontSize: number): void;
}

const useLocalEditorStore = create<LocalEditorStore>((set) => ({
  fontSize: 16,
  setFontSize: (fontSize: number) => set((state) => ({ ...state, fontSize })),
}));

export function useLocalEditorState() {
  const { fontSize, setFontSize } = useLocalEditorStore();

  return {
    fontSize,
    setFontSize,
  };
}
