import { kv } from "@vercel/kv";
import { NoteFile } from "../../../jot-one/utils/file-utils";

const FILES_STORAGE_KEY = "files";

export async function getFiles(username: string): Promise<NoteFile[]> {
  const filesRaw = await kv.get<NoteFile[] | null>(getFileKey(username));
  return filesRaw ?? [];
}

export async function createFile(
  username: string,
  file: NoteFile,
  files: NoteFile[] | null = null // Used to not call getFiles() twice
) {
  files = files ?? (await getFiles(username));

  const fileAlreadyExists = files.some((f) => f.key === file.key);
  if (fileAlreadyExists) throw new Error("File already exists");

  files.push(file);

  await kv.set(getFileKey(username), files);

  return file;
}

function getFileKey(username: string) {
  return `${username}:${FILES_STORAGE_KEY}`;
}
