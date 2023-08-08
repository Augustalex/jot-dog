import useSWR from "swr";
import { getConfig } from "../../db-server/editor";

export const EDITOR_CONFIG_KEY = "editor_config";

export function useEditorConfig() {
  return useSWR(EDITOR_CONFIG_KEY, getConfig, { suspense: true });
}
