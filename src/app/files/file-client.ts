import { FileType, NoteFile } from "../../utils/file-utils";
import { getFileContent, saveFileContent } from "./file-content-actions";
import {
  fromBase64StringToUint8Array,
  fromUint8ArrayToBase64String,
} from "../../utils/binary-helpers";

export const fileClient = {
  async saveBinaryData(file: NoteFile, content: Uint8Array) {
    if (file.fileType !== FileType.YDoc) {
      throw new Error("File does not contain binary data");
    }

    await saveFileContent(file, fromUint8ArrayToBase64String(content));
  },
  async getBinaryFile(file: NoteFile) {
    if (file.fileType !== FileType.YDoc) {
      throw new Error("File does not contain binary data");
    }

    const storedContent = await getFileContent(file);
    if (!storedContent) return null;

    return fromBase64StringToUint8Array(storedContent);
  },
};
