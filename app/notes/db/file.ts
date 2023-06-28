"use server";

import { kv } from "@vercel/kv";
import { NoteFile } from "../utils/file-utils";

const FILE_CONTENT_STORAGE_PREFIX = "file_content:";

export async function saveFile(file: NoteFile, content: string): Promise<void> {
  console.log("SAVING FILE: " + file.key + ", " + file.name);
  await kv.set(FILE_CONTENT_STORAGE_PREFIX + file.key, content);
}

export async function getFile(file: NoteFile) {
  return (
    (await kv.get<string | null>(FILE_CONTENT_STORAGE_PREFIX + file.key)) ?? ""
  );
}

export async function deleteFileContent(file: NoteFile) {
  return await kv.del(FILE_CONTENT_STORAGE_PREFIX + file.key);
}
