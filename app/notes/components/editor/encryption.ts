import * as promise from "lib0/promise";
import * as decoding from "lib0/decoding";
import * as error from "lib0/error";
import * as encoding from "lib0/encoding";
import { encodeUtf8 } from "lib0/string";

function decrypt(data: Uint8Array, key: CryptoKey): PromiseLike<Uint8Array> {
  if (!key) {
    return promise.resolve(data) as PromiseLike<Uint8Array>;
  }

  const dataDecoder = decoding.createDecoder(data);
  const algorithm = decoding.readVarString(dataDecoder);
  if (algorithm !== "AES-GCM") {
    promise.reject(error.create("Unknown encryption algorithm"));
  }
  const iv = decoding.readVarUint8Array(dataDecoder);
  const cipher = decoding.readVarUint8Array(dataDecoder);
  return crypto.subtle
    .decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      cipher
    )
    .then((data) => new Uint8Array(data));
}

function encrypt(data: Uint8Array, key: CryptoKey): PromiseLike<Uint8Array> {
  if (!key) {
    return promise.resolve(data) as PromiseLike<Uint8Array>;
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle
    .encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    )
    .then((cipher) => {
      const encryptedDataEncoder = encoding.createEncoder();
      encoding.writeVarString(encryptedDataEncoder, "AES-GCM");
      encoding.writeVarUint8Array(encryptedDataEncoder, iv);
      encoding.writeVarUint8Array(encryptedDataEncoder, new Uint8Array(cipher));
      return encoding.toUint8Array(encryptedDataEncoder);
    });
}

function deriveKey(
  secret: string = "secret",
  username: string = "user"
): PromiseLike<CryptoKey> {
  const secretBuffer = encodeUtf8(secret).buffer;
  const salt = encodeUtf8(username).buffer;
  return crypto.subtle
    .importKey("raw", secretBuffer, "PBKDF2", false, ["deriveKey"])
    .then((keyMaterial) =>
      crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      )
    );
}
