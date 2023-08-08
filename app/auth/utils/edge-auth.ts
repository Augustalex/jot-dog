import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { sign, TokenPayload, verify } from "./jwt-utils";

const TEST_JWT_SALT = "$2b$10$0nkMkjrliXMlKkv7C1xI8e";
const TEST_EXPIRY_SECONDS = 60;

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
  const token = await setLoginToken(fileKey, response);
  console.log("LOGIN WITH PUBLIC TOKEN: ", token);

  return response;
}

export async function verifyFileAccess<T extends NextRequest>(
  fileKey: string,
  request: T
) {
  if (!request.cookies.has("test-login-token")) throw new Error(NO_TOKEN);
  const { value: token } = request.cookies.get("test-login-token");

  const payload = await verifyAndCatchExpiredToken(token);
  if (payload.fileKey !== fileKey) throw new Error(NO_ACCESS);

  return payload as TokenPayload;
}

async function verifyAndCatchExpiredToken(token: string) {
  try {
    return await verify(token, TEST_JWT_SALT);
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
  const token = await sign({ fileKey }, TEST_JWT_SALT);
  response.cookies.set({
    name: "test-login-token",
    value: token,
    path: `/${fileKey}`,
    sameSite: "strict",
    secure: true,
    maxAge: TEST_EXPIRY_SECONDS * 1000,
  });

  return token;
}

export function passwordStorageKey(fileKey: string) {
  return `test-lock:${fileKey}:password`;
}
