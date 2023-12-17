import { Y_TEXT_KEY } from "../features/editor/constants";
import * as Y from "yjs";

export function getDocumentText(yDoc: Y.Doc) {
  const yText = yDoc.getText(Y_TEXT_KEY);
  return yText.toString();
}
