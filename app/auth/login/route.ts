import { NextRequest, NextResponse } from "next/server";
import { INVALID_PASSWORD, login, NO_PASSWORD_SET } from "../utils/api-auth";

export async function POST(request: NextRequest) {
  const body: { password: string; fileKey: string } | undefined =
    await request.json();
  if (!body)
    return NextResponse.json({ message: "Missing body" }, { status: 400 });
  if (!body.password)
    return NextResponse.json({ message: "Missing password" }, { status: 400 });
  if (!body.fileKey)
    return NextResponse.json({ message: "Missing file key" }, { status: 400 });
  const { password, fileKey } = body;

  const successResponse = NextResponse.json(
    { status: "success" },
    { status: 200 }
  );
  try {
    return await login({ password, fileKey }, successResponse);
  } catch (error) {
    if (error.message === NO_PASSWORD_SET) {
      console.log("LOGIN FAIL! NO PASSWORD SET.", fileKey, password);
      return NextResponse.json({ status: "no-password-set" }, { status: 400 });
    } else if (error.message === INVALID_PASSWORD) {
      console.log("LOGIN FAIL! INVALID PASSWORD.", fileKey, password);
      return NextResponse.json({ status: "invalid-password" }, { status: 400 });
    } else {
      console.log("Failed to get password for note. Is it not locked?", error);
      return NextResponse.json({ status: "invalid-password" }, { status: 400 });
    }
  }
}
