import { NextRequest, NextResponse } from "next/server";
import {
  INVALID_PASSWORD,
  login,
  NO_PASSWORD_SET,
} from "../../../jot-one/utils/auth/api-auth";

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
      return NextResponse.json({ status: "no-password-set" }, { status: 400 });
    } else if (error.message === INVALID_PASSWORD) {
      return NextResponse.json({ status: "invalid-password" }, { status: 400 });
    } else {
      return NextResponse.json({ status: "invalid-password" }, { status: 400 });
    }
  }
}
