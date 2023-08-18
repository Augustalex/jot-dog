import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import bcrypt from "bcrypt";
import {
  getPassword,
  passwordStorageKey,
  publicLogin,
  setLoginToken,
} from "./edge-auth";

const JWT_SALT = process.env.SALT || undefined;

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
  if (!JWT_SALT) throw new Error("Server configuration error 1");

  const passwordHash = await bcrypt.hash(password, JWT_SALT);
  await kv.set(passwordStorageKey(fileKey), passwordHash);

  await setLoginToken(fileKey, response);

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

  const matchesHash = await bcrypt.compare(password, storedPasswordHash);
  if (!matchesHash) throw new Error(INVALID_PASSWORD);

  await setLoginToken(fileKey, response);

  return response;
}
