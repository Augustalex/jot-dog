import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { sign, TokenPayload, verify } from "./jwt-utils";

const JWT_SALT = process.env.CRYPT_SALT || undefined;
const TOKEN_EXPIRE_DAYS = 30;
const TOKEN_EXPIRE_TIME = TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000;

export const NO_TOKEN = "No token";
export const NO_ACCESS = "No access";
export const EXPIRED_TOKEN = "Token has expired";

export async function isPrivateNote(fileKey: string) {
  return Boolean(await getPassword(fileKey));
}

export async function publicLogin(
  { fileKey }: { fileKey: string },
  response: NextResponse
) {
  await setLoginToken(fileKey, response);

  return response;
}

export async function verifyFileAccess<T extends NextRequest>(
  fileKey: string,
  request: T
) {
  if (!request.cookies.has("login-token")) throw new Error(NO_TOKEN);
  const { value: token } = request.cookies.get("login-token");

  const payload = await verifyAndCatchExpiredToken(token);
  if (payload.fileKey !== fileKey) throw new Error(NO_ACCESS);

  return payload as TokenPayload;
}

async function verifyAndCatchExpiredToken(token: string) {
  if (!JWT_SALT) throw new Error("Server configuration error 1");

  try {
    return await verify(token, JWT_SALT);
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      throw new Error(EXPIRED_TOKEN);
    } else {
      throw error;
    }
  }
}

export async function getPassword(fileKey: string) {
  return kv.get(passwordStorageKey(fileKey));
}

export async function setLoginToken<T extends NextResponse>(
  fileKey: string,
  response: T
) {
  if (!JWT_SALT) throw new Error("Server configuration error 1");

  const token = await sign({ fileKey }, JWT_SALT);
  response.cookies.set({
    name: "login-token",
    value: token,
    path: `/${fileKey}`,
    sameSite: "strict",
    secure: true,
    maxAge: TOKEN_EXPIRE_TIME,
  });

  return token;
}

export function passwordStorageKey(fileKey: string) {
  return `test-lock:${fileKey}:password`;
}
