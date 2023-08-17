export function useLocalState<T>(key: string, defaultValue: T) {
  const storedItem = localStorage.getItem(key);
  const localState = storedItem ? JSON.parse(storedItem) : defaultValue;

  return {
    localState,
    isReady: true,
  };
}
