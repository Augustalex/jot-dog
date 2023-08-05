import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, defaultValue: T) {
  const [localState, setLocalState] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const localState = localStorage.getItem(key);
    if (localState) {
      setLocalState(JSON.parse(localState));
    }
    setIsReady(true);
  }, [key]);

  return {
    localState,
    isReady,
  };
}
