import {forceCreateFile, getFiles} from "../files";
import useSWR, {mutate} from "swr";
import {generateFileDetails} from "../../utils/file-utils";

export const FILES_KEY = "files";

export function useFiles() {
  const response = useSWR(FILES_KEY, getFiles, {suspense: true});

  return {
    ...response,
    optimisticCreateFile
  };

  async function optimisticCreateFile() {
    if (response.isLoading) throw new Error('Trying to optimistically create a file before all files has loaded. This is not possible.');

    const files = [...response.data];

    const newFile = generateFileDetails(files);
    files.push(newFile);

    forceCreateFile(newFile).catch(console.error);
    mutate(FILES_KEY, files, {revalidate: false}).catch(console.error);

    return newFile;
  }
}
