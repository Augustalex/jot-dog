import { FileType, NoteFile } from "../utils/file-utils";
import { getFile, saveFile } from "./file";

export const fileClient = {
  async saveBinaryData(file: NoteFile, content: Uint8Array) {
    if (file.fileType !== FileType.YDoc) {
      throw new Error("File does not contain binary data");
    }

    const contentToStore = Buffer.from(content).toString("base64");
    await saveFile(file, contentToStore);
  },
  async getBinaryFile(file: NoteFile) {
    if (file.fileType !== FileType.YDoc) {
      throw new Error("File does not contain binary data");
    }

    const storedContent = await getFile(file);
    if (!storedContent) return null;

    return new Uint8Array(Buffer.from(storedContent, "base64"));
  },
};
