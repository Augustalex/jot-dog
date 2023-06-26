import { useEditorConfig } from "./useEditorConfig";
import { getFile } from "../file";
import useSWR from "swr";

export const getContentKey = (key: string) => `content:${key}`;

export function useSelectedContent() {
  const { data, isLoading } = useEditorConfig();
  const contentResponse = useSWR(
    !data ? null : getContentKey(data.selectedFile?.key ?? "no-file"),
    () => {
      if (!data) return;
      return getFile(data.selectedFile);
    },
    { suspense: true }
  );

  if (!isLoading && !data) throw new Error("No editor config found");
  if (isLoading || contentResponse.isLoading)
    return { data: "", isLoading: true };

  return {
    data: contentResponse.data,
    isLoading: false,
  };
}
