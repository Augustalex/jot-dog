import { NextRequest, NextResponse } from "next/server";
import { lock } from "../../../jot-one/utils/auth/api-auth";

export async function POST(request: NextRequest) {
  const body: { password: string; fileKey: string } = await request.json();
  if (!body)
    return NextResponse.json({ status: "missing-body" }, { status: 400 });
  if (!body.password)
    return NextResponse.json({ status: "missing-password" }, { status: 400 });
  if (!body.fileKey)
    return NextResponse.json({ status: "missing-file-key" }, { status: 400 });
  if (body.password.length > 128)
    return NextResponse.json({ status: "invalid-password" }, { status: 400 });

  const { password, fileKey } = body;

  let successResponse = NextResponse.json(
    {
      status: "success",
    },
    { status: 200 }
  );
  return await lock({ fileKey, password }, successResponse);
}
