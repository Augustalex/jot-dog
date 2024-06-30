import { kv } from "@vercel/kv";
import { NoteFile } from "../../../jot-one/utils/file-utils";

const FILES_STORAGE_KEY = "files";

export async function getFiles(username: string): Promise<NoteFile[]> {
  // await DANGEROUS_DELETE(username); // Use this for development to clear corrupt data
  const filesRaw = await kv.get<NoteFile[] | null>(getFileStorageKey(username));
  return filesRaw ?? [];
}

export async function createFile(
  username: string,
  file: NoteFile,
  files: NoteFile[] | null = null, // Used to not call getFiles() twice
) {
  files = files ?? (await getFiles(username));

  const fileAlreadyExists = files.some((f) => f.key === file.key);
  if (fileAlreadyExists) throw new Error("File already exists");

  files.push(file);

  await setFiles(username, files);

  return file;
}

export async function updateFile(
  username: string,
  currentFileKey: string,
  mergeFile: NoteFile,
) {
  const currentFiles = await getFiles(username);
  const currentFile = currentFiles.find((f) => f.key === currentFileKey);
  if (!currentFile) throw new Error("File not found");

  const newFiles = [
    ...currentFiles.filter((f) => f !== currentFile),
    {
      key: mergeFile.key,
      name: mergeFile.name,
      fileType: mergeFile.fileType,
    },
  ];
  await setFiles(username, newFiles);

  return mergeFile;
}

function getFileStorageKey(username: string) {
  return `${username}:${FILES_STORAGE_KEY}`;
}

function setFiles(username: string, files: NoteFile[]) {
  return kv.set(getFileStorageKey(username), files);
}

function DANGEROUS_DELETE(username: string) {
  return kv.del(getFileStorageKey(username));
}
