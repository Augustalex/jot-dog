"use server";

import { kv } from "@vercel/kv";
import { NoteFile } from "../../../jot-one/utils/file-utils";

const FILE_CONTENT_STORAGE_PREFIX = "file_content:";

export async function saveFileContent(
  file: NoteFile,
  content: string,
): Promise<void> {
  const key = FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key;
  await kv.set(key, content);
}

export async function getFileContent(file: NoteFile) {
  const key = FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key;
  const storedContent = await kv.get<string | null>(key);
  if (!storedContent) return null;

  return storedContent;
}

export async function deleteFileContent(file: NoteFile) {
  return await kv.del(FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key);
}
