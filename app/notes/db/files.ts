"use server";

import {kv} from "@vercel/kv";
import slugify from "slugify";
import {deleteFileContent, getFile, saveFile} from "./file";
import {generateFileDetails, NoteFile} from "../utils/file-utils";

const FILES_STORAGE_KEY = "files";

export async function getFiles(): Promise<NoteFile[]> {
  const filesRaw = await kv.get<NoteFile[] | null>(FILES_STORAGE_KEY);
  return filesRaw ?? [];
}

export async function renameFile(fileToRename: NoteFile, newName: string) {
  const files = await getFiles();

  const file = files.find((f) => f.key === fileToRename.key);
  file.name = newName;
  file.key = slugify(newName, {lower: true});

  await kv.set(FILES_STORAGE_KEY, files);

  const content = await getFile(fileToRename);

  await Promise.all([
    deleteFileContent(fileToRename),
    saveFile(file, content)
  ])

  return file;
}

export async function createFile(): Promise<NoteFile> {
  const files = await getFiles();
  const newFile = generateFileDetails(files);

  return await forceCreateFile(newFile, files);
}
export async function forceCreateFile(file: NoteFile, files: NoteFile[] = null) {
  files = files ?? await getFiles();
  files.push(file);

  await kv.set(FILES_STORAGE_KEY, files);

  return file;
}

export async function getOrCreateFile(fileKey: string) {
  const files = await getFiles();
  const file = files.find((file) => file.key === fileKey);
  if (!file) {
    const newFile: NoteFile = {name: fileKey, key: fileKey};
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
