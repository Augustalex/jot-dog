import { create } from "zustand";
import { persist } from "zustand/middleware";

export const SIDEBAR_WIDTH = 240;

interface State {
  open: boolean;
  toggle: () => void;
}

export const useSideBarState = create(
  persist<State>(
    (set) => ({
      open: false,
      toggle: () => set((state) => ({ open: !state.open })),
    }),
    {
      name: "jot-dog-side-bar-state",
    },
  ),
);
