import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SIDEBAR_WIDTH = 320;

interface State {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

export const useSideBarState = create(
  persist<State>(
    (set) => ({
      open: false,
      toggle: () => set((state) => ({ open: !state.open })),
      close: () => set({ open: false }),
    }),
    {
      name: "jot-dog-side-bar-state",
    },
  ),
);
