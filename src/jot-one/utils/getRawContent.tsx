import { decoding } from "lib0";
import * as Y from "yjs";
import { getDocumentText } from "./getDocumentText";

export function getRawContent(content: Uint8Array) {
  const origin = "remote";
  const yDoc = new Y.Doc();
  const data = new Uint8Array(content);
  const decoder = decoding.createDecoder(data);

  // Not used here, but needs to be consumed to advance the decoder
  const messageType = decoding.readVarUint(decoder);

  const update = decoding.readVarUint8Array(decoder);
  Y.applyUpdate(yDoc, update, origin);

  return getDocumentText(yDoc);
}
