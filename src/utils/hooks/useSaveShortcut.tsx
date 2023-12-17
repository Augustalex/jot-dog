"use client";

import React from "react";

export function useSaveShortcut(save: () => void) {
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
