import { getFiles } from "../files";
import useSWR from "swr";

export const FILES_KEY = "files";

export function useFiles() {
  return useSWR(FILES_KEY, getFiles, { suspense: true });
}
