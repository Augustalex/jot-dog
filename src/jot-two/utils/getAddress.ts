export function getAddress(fileKey: string) {
  return fileKey.split("/").pop() ?? "unknown";
}
