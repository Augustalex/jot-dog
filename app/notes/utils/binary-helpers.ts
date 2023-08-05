export function fromUint8ArrayToBase64String(data: Uint8Array): string {
  return Buffer.from(data).toString("base64");
}

export function fromBase64StringToUint8Array(data: string): Uint8Array {
  return new Uint8Array(Buffer.from(data, "base64"));
}
