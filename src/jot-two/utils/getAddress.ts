export function getAddress(fileKey: string) {
  return fileKey.split("/").pop() ?? "unknown";
}

export function getUsernameFromKey(fileKey: string) {
  return fileKey.split("/")[0];
}
