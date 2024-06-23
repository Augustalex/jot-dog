"use client";

import { useCallback, useEffect, useState } from "react";

export function useLocalState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);

  const setLocalState = useCallback(
    (newState: T) => {
      setValue(newState);
      localStorage.setItem(key, JSON.stringify(newState));
    },
    [key]
  );

  useEffect(() => {
    const localState = localStorage.getItem(key);
    if (localState) {
      setLocalState(JSON.parse(localState));
    }
    setIsReady(true);
  }, [key, setLocalState]);

  return {
    localState: value,
    setLocalState,
    isReady,
  };
}
