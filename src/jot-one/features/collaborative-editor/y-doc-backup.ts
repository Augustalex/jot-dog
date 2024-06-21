import * as Y from "yjs";
import { NoteFile } from "../../utils/file-utils";
import { getDocumentText } from "../../utils/getDocumentText";

export interface DocBackup {
  day: string;
  text: string;
}

export function YDocBackup({ file, yDoc }) {
  return {
    getAll,
    backup,
  };

  function getAll() {
    return getLocalBackups(file);
  }

  function backup() {
    localBackup(file, yDoc);
  }
}

function localBackup(file: NoteFile, yDoc: Y.Doc) {
  const fileBackupsDirectoryKey = file.key + ":raw_backups";
  const fileBackupsDirectoryJSON = localStorage.getItem(
    fileBackupsDirectoryKey
  );
  const fileBackupsDirectory: DocBackup[] =
    JSON.parse(fileBackupsDirectoryJSON) ?? [];

  const day = new Date().toISOString().split("T")[0];
  const existingFile = fileBackupsDirectory.find((f) => f.day === day);
  if (existingFile) {
    existingFile.text = getDocumentText(yDoc);
  } else {
    fileBackupsDirectory.push({
      day,
      text: getDocumentText(yDoc),
    });
  }

  localStorage.setItem(
    fileBackupsDirectoryKey,
    JSON.stringify(fileBackupsDirectory)
  );
}

function getLocalBackups(file: NoteFile): DocBackup[] {
  const fileBackupsDirectoryKey = file.key + ":raw_backups";
  const fileBackupsDirectoryJSON = localStorage.getItem(
    fileBackupsDirectoryKey
  );
  return JSON.parse(fileBackupsDirectoryJSON) ?? [];
}
