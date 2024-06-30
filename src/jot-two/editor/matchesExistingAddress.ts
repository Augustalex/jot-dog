import { NoteFile } from "../../jot-one/utils/file-utils";
import { getAddress } from "../utils/getAddress";

export function matchesExistingAddress(
  address: string,
  existingFiles: NoteFile[],
) {
  return existingFiles.some((file) => getAddress(file.key) === address);
}
