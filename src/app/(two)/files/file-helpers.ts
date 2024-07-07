import { jkv } from "../../../jot-two/jkv/jkv";
import { JotTwoFile } from "../../../jot-two/file/file-utils";

const FILES_STORAGE_KEY = "files";

export async function getFiles(username: string): Promise<JotTwoFile[]> {
  // await DANGEROUS_DELETE(username); // Use this for development to clear corrupt data
  const filesRaw = await jkv.getJson<JotTwoFile[] | null>(
    getFileStorageKey(username),
  );
  return filesRaw ?? [];
}

export async function createFile(
  username: string,
  file: JotTwoFile,
  files: JotTwoFile[] | null = null, // Used to not call getFiles() twice
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
  mergeFile: JotTwoFile,
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

export async function deleteFile(fileKey: string, username: string) {
  const currentFiles = await getFiles(username);
  console.log("key", fileKey);
  const newFiles = currentFiles.filter((f) => f.key !== fileKey);
  await setFiles(username, newFiles);
}

function getFileStorageKey(username: string) {
  return `${username}:${FILES_STORAGE_KEY}`;
}

function setFiles(username: string, files: JotTwoFile[]) {
  return jkv.setJson(getFileStorageKey(username), files);
}

function DANGEROUS_DELETE(username: string) {
  return jkv.del(getFileStorageKey(username));
}
