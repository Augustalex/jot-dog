"use server";

import { kv } from "@vercel/kv";
import slugify from "slugify";

const FILES_STORAGE_KEY = "files";

export interface NoteFile {
  name: string;
  key: string;
}

export async function getFiles(): Promise<NoteFile[]> {
  const filesRaw = await kv.get<NoteFile[] | null>(FILES_STORAGE_KEY);
  return filesRaw ?? [];
}

export async function renameFile(fileToRename: NoteFile, newName: string) {
  const files = await getFiles();

  const file = files.find((f) => f.key === fileToRename.key);
  file.name = newName;
  file.key = slugify(newName, { lower: true });

  await kv.set(FILES_STORAGE_KEY, files);

  return file;
}

export async function createFile(): Promise<NoteFile> {
  const isoDate = new Date().toISOString();
  const dateString = isoDate.substring(0, isoDate.indexOf("T"));

  const files = await getFiles();
  const newNameTemplate = `Note ${dateString}`;
  const similarNamesCount = files.filter((f) =>
    f.name.startsWith(newNameTemplate)
  ).length;
  const newName =
    similarNamesCount > 0
      ? `${newNameTemplate} (${similarNamesCount})`
      : newNameTemplate;

  const newKey = slugify(Date.now().toString(), { lower: true });

  const newFile: NoteFile = { name: newName, key: newKey };
  files.push(newFile);

  await kv.set(FILES_STORAGE_KEY, files);

  return newFile;
}

export async function getOrCreateFile(fileKey: string) {
  const files = await getFiles();
  const file = files.find((file) => file.key === fileKey);
  if (!file) {
    const newFile: NoteFile = { name: fileKey, key: fileKey };
    files.push(newFile);
    await kv.set(FILES_STORAGE_KEY, files);

    return newFile;
  } else {
    return file;
  }
}

export async function deleteFile(fileKey: string) {
  const files = await getFiles();
  const fileIndex = files.findIndex((file) => file.key === fileKey);
  if (fileIndex >= 0) {
    files.splice(fileIndex, 1);
    await kv.set(FILES_STORAGE_KEY, files);
  }
}
