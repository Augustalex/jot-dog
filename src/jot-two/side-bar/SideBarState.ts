import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SIDEBAR_WIDTH = 320;

interface State {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

export const useSideBarState = create(
  persist<State>(
    (set) => ({
      isOpen: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      close: () => set({ isOpen: false }),
      open: () => set({ isOpen: true }),
    }),
    {
      name: "jot-dog-side-bar-state",
    },
  ),
);
