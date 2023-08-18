import * as encoding from "lib0/encoding";
import * as Y from "yjs";
import throttle from "lodash/throttle";
import { NoteFile } from "../../utils/file-utils";
import { YDocBackup } from "./YDocBackup";
import { persistedDocument } from "./message-constants";

export function persistNowWith(file, yDoc, persist) {
  const persistedEncoder = encoding.createEncoder();
  encoding.writeVarUint(persistedEncoder, persistedDocument);
  const state = Y.encodeStateAsUpdate(yDoc);
  encoding.writeVarUint8Array(persistedEncoder, state);
  const data = encoding.toUint8Array(persistedEncoder);
  persist(data).catch((error) => console.error(error, "Persist failed"));
  YDocBackup({ file, yDoc }).backup();
}

export function YDocPersister({
  file,
  yDoc,
  persist,
  persistInterval,
}: {
  file: NoteFile;
  yDoc: Y.Doc;
  persist: (data: Uint8Array) => Promise<void>;
  persistInterval: number;
}) {
  const doPersist = () => {
    persistNowWith(file, yDoc, persist);
  };
  const schedulePersist = throttle(doPersist, persistInterval, {
    leading: false,
    trailing: true,
  });

  return () => {
    schedulePersist();
  };
}
