import { getAddress } from "./getAddress";
import { JotTwoFile } from "../file/file-utils";

export function isAddressChanged(file: JotTwoFile, address: string) {
  return getAddress(file.key) !== address;
}
