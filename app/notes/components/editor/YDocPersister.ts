import * as encoding from "lib0/encoding";
import * as Y from "yjs";
import throttle from "lodash/throttle";
import { persistedDocument } from "./message-types";

export function persistNowWith(yDoc, persist) {
  const persistedEncoder = encoding.createEncoder();
  encoding.writeVarUint(persistedEncoder, persistedDocument);
  const state = Y.encodeStateAsUpdate(yDoc);
  encoding.writeVarUint8Array(persistedEncoder, state);
  const data = encoding.toUint8Array(persistedEncoder);
  persist(data).catch((error) => console.error(error, "Persist failed"));
}

export function YDocPersister({ yDoc, persist, persistInterval }) {
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
