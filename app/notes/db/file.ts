"use server";

import { NoteFile } from "./files";
import { kv } from "@vercel/kv";

const FILE_CONTENT_STORAGE_PREFIX = "file_content:";

export async function saveFile(file: NoteFile, content: string): Promise<void> {
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
