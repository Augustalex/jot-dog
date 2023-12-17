import * as Y from "yjs";
import {
  fromBase64StringToUint8Array,
  fromUint8ArrayToBase64String,
} from "../../utils/binary-helpers";
import { Y_TEXT_KEY } from "../editor/constants";
import { NoteFile } from "../../utils/file-utils";

export interface FileBackup {
  day: string;
  dataBase64: string;
}

export function YDocBackup({ file, yDoc }) {
  return {
    getAll,
    backup,
    preview,
    restore,
  };

  function getAll() {
    return getLocalBackups(file);
  }

  function backup() {
    const snapshot = Y.snapshot(yDoc);
    const encodedSnapshot = Y.encodeSnapshot(snapshot);
    localBackup(file, encodedSnapshot);
  }

  function preview(backupFile: FileBackup) {
    const data = fromBase64StringToUint8Array(backupFile.dataBase64);
    return localPreview(yDoc, data);
  }

  function restore(backupFile: FileBackup) {
    const yText = yDoc.getText(Y_TEXT_KEY);
    const undoManager = new Y.UndoManager(yText);
    const data = fromBase64StringToUint8Array(backupFile.dataBase64);
    localRestore(data, undoManager);
  }
}

function localBackup(file: NoteFile, data: Uint8Array) {
  const fileBackupsDirectoryKey = file.key + ":backups";
  const fileBackupsDirectoryJSON = localStorage.getItem(
    fileBackupsDirectoryKey
  );
  const fileBackupsDirectory = JSON.parse(fileBackupsDirectoryJSON) ?? [];

  const day = new Date().toISOString().split("T")[0];
  const existingFile = fileBackupsDirectory.find((f) => f.day === day);
  if (existingFile) {
    existingFile.dataBase64 = fromUint8ArrayToBase64String(data);
  } else {
    fileBackupsDirectory.push({
      day,
      dataBase64: fromUint8ArrayToBase64String(data),
    });
  }

  localStorage.setItem(
    fileBackupsDirectoryKey,
    JSON.stringify(fileBackupsDirectory)
  );
}

function getLocalBackups(file: NoteFile): FileBackup[] {
  const fileBackupsDirectoryKey = file.key + ":backups";
  const fileBackupsDirectoryJSON = localStorage.getItem(
    fileBackupsDirectoryKey
  );
  return JSON.parse(fileBackupsDirectoryJSON) ?? [];
}

function localPreview(yDoc: Y.Doc, restorePoint: Uint8Array) {
  const snapshot = Y.decodeSnapshot(restorePoint);
  yDoc.gc = false;
  return Y.createDocFromSnapshot(yDoc, snapshot);
}

function localRestore(restorePoint: Uint8Array, undoManager: Y.UndoManager) {
  const snap = Y.decodeSnapshot(restorePoint);
  const tempdoc = Y.createDocFromSnapshot(this.yDoc, snap);

  // We cannot simply replace `this.yDoc` because we have to sync with other clients.
  // Replacing `this.yDoc` would be similar to doing `git reset --hard $SNAPSHOT && git push --force`.
  // Instead, we compute an "anti-operation" of all the changes made since that snapshot.
  // This ends up being similar to `git revert $SNAPSHOT..HEAD`.
  const currentStateVector = Y.encodeStateVector(this.yDoc);
  const snapshotStateVector = Y.encodeStateVector(tempdoc);

  // creating undo command encompassing all changes since taking snapshot
  const changesSinceSnapshotUpdate = Y.encodeStateAsUpdate(
    this.yDoc,
    snapshotStateVector
  );
  // In our specific implementation, everything we care about is in a single root Y.Map, which makes
  // it easy to track with a Y.UndoManager. To be honest, your mileage may vary if you don't know which root types need to be tracked
  Y.applyUpdate(tempdoc, changesSinceSnapshotUpdate, null);
  undoManager.undo();

  // applying undo command to this.ydoc
  const revertChangesSinceSnapshotUpdate = Y.encodeStateAsUpdate(
    tempdoc,
    currentStateVector
  );
  Y.applyUpdate(this.yDoc, revertChangesSinceSnapshotUpdate, null);
}
