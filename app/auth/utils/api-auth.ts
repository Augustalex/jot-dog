import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import bcrypt from "bcrypt";
import {
  getPassword,
  passwordStorageKey,
  publicLogin,
  setLoginToken,
} from "./edge-auth";

const TEST_PASSWORD_SALT = "$2b$10$VxTfpTjFHzr5xDcNGoFRre";

export interface LoginPayload {
  password?: string;
  fileKey: string;
}

export const NO_PASSWORD_SET = "No password set for this file";
export const INVALID_PASSWORD = "Invalid password";

export async function lock<T extends NextResponse>(
  { password, fileKey }: LoginPayload,
  response: T
) {
  const passwordHash = await bcrypt.hash(password, TEST_PASSWORD_SALT);
  await kv.set(passwordStorageKey(fileKey), passwordHash);

  const token = await setLoginToken(fileKey, response);
  console.log("LOCKED NOTE: ", token);

  return response;
}

export async function login(
  { password, fileKey }: LoginPayload,
  response: NextResponse
) {
  const storedPasswordHash = await getPassword(fileKey);
  if (!storedPasswordHash) {
    return await publicLogin({ fileKey }, response);
  }
  if (!password) throw new Error(INVALID_PASSWORD);

  const matchesHash = bcrypt.compare(password, storedPasswordHash);
  if (!matchesHash) throw new Error(INVALID_PASSWORD);

  const token = await setLoginToken(fileKey, response);
  console.log("LOGIN SUCCESS: ", token, ". Did set cookie for:", fileKey);

  return response;
}
