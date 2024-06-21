import * as encoding from "lib0/encoding";
import * as Y from "yjs";
import throttle from "lodash/throttle";
import { NoteFile } from "../../utils/file-utils";
import { persistedDocument } from "./message-constants";

export function persistNowWith(yDoc: Y.Doc, persist: any) {
  const persistedEncoder = encoding.createEncoder();
  encoding.writeVarUint(persistedEncoder, persistedDocument);
  const state = Y.encodeStateAsUpdate(yDoc);
  encoding.writeVarUint8Array(persistedEncoder, state);
  const data = encoding.toUint8Array(persistedEncoder);
  persist(data).catch((error: any) => console.error(error, "Persist failed"));
}

export function YDocPersister({
  yDoc,
  persist,
  persistInterval,
}: {
  yDoc: Y.Doc;
  persist: (data: Uint8Array) => Promise<void>;
  persistInterval: number;
}) {
  const doPersist = () => {
    persistNowWith(yDoc, persist);
  };
  const schedulePersist = throttle(doPersist, persistInterval, {
    leading: false,
    trailing: true,
  });

  return () => {
    schedulePersist();
  };
}
