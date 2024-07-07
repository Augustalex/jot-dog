import { getAddress } from "./getAddress";
import { NoteFile } from "../file/file-utils";

export function isAddressChanged(file: NoteFile, address: string) {
  return getAddress(file.key) !== address;
}
