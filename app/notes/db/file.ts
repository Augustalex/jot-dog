"use server";

import { kv } from "@vercel/kv";
import { NoteFile } from "../utils/file-utils";

const FILE_CONTENT_STORAGE_PREFIX = "file_content:";

export async function saveFile(file: NoteFile, content: string): Promise<void> {
  const key = FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key;
  console.log(
    `SAVING FILE: ${file.name} on key "${key}" using file type: ${file.fileType}`
  );
  await kv.set(key, content);
}

export async function getFile(file: NoteFile) {
  const key = FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key;
  console.log(
    `GETTING FILE: ${file.name} on key "${key}" using file type: ${file.fileType}`
  );
  const storedContent = await kv.get<string | null>(key);
  console.log("GOT CONTENT:", storedContent);
  if (!storedContent) return null;

  return storedContent;
}

export async function deleteFileContent(file: NoteFile) {
  return await kv.del(FILE_CONTENT_STORAGE_PREFIX + file.fileType + file.key);
}
