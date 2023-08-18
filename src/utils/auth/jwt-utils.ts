import { jwtVerify, SignJWT } from "jose";

const TEST_EXPIRY_SECONDS = 60;

export interface TokenPayload {
  fileKey: string;
}

export async function sign(
  payload: TokenPayload,
  secret: string
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TEST_EXPIRY_SECONDS; // one hour

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}

export async function verify(
  token: string,
  secret: string
): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  if (!payload.fileKey || typeof payload?.fileKey !== "string")
    throw new Error("Invalid token");

  return { fileKey: payload.fileKey };
}
