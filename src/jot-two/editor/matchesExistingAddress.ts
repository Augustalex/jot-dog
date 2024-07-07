import { getAddress } from "../utils/getAddress";
import { JotTwoFile } from "../file/file-utils";

export function matchesExistingAddress(
  address: string,
  existingFiles: JotTwoFile[],
) {
  return existingFiles.some((file) => getAddress(file.key) === address);
}
