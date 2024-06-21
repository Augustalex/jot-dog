"use server";

import { kv } from "@vercel/kv";
import {
  FileType,
  generateFileDetails,
  NoteFile,
} from "../../jot-one/utils/file-utils";

const FILES_STORAGE_KEY = "files";

export async function getFiles(): Promise<NoteFile[]> {
  const filesRaw = await kv.get<NoteFile[] | null>(FILES_STORAGE_KEY);
  return filesRaw ?? [];
}

export async function createFile(files: NoteFile[] = null): Promise<NoteFile> {
  files = files || (await getFiles());
  const newFile = generateFileDetails(files);

  return await forceCreateFile(newFile, files);
}

export async function forceCreateFile(
  file: NoteFile,
  files: NoteFile[] = null
) {
  files = files ?? (await getFiles());
  files.push(file);

  await kv.set(FILES_STORAGE_KEY, files);

  return file;
}

export async function getOrCreateFile(
  fileKey: string,
  files: NoteFile[] = null
) {
  files = files || (await getFiles());
  const file = files.find((file) => file.key === fileKey);
  if (!file) {
    const newFile: NoteFile = {
      name: fileKey,
      key: fileKey,
      fileType: FileType.YDoc,
    };
    files.push(newFile);
    await kv.set(FILES_STORAGE_KEY, files);

    return newFile;
  } else {
    file.fileType = FileType.YDoc;
    return file;
  }
}
