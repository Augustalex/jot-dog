import { NoteFile } from "../../jot-one/utils/file-utils";
import { getAddress } from "./getAddress";

export function isAddressChanged(file: NoteFile, address: string) {
  return getAddress(file.key) !== address;
}
