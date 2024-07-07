import { getAddress } from "../utils/getAddress";
import { NoteFile } from "../file/file-utils";

export function matchesExistingAddress(
  address: string,
  existingFiles: NoteFile[],
) {
  return existingFiles.some((file) => getAddress(file.key) === address);
}
