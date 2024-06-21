import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ensureLocalId } from "./middlewares/ensureLocalId";

const STEPS = [ensureLocalId];

export async function jotOneMiddleware(request: NextRequest) {
  // Ignore files and images.
  const url = new URL(request.url);
  if (url.pathname.includes(".")) {
    return NextResponse.next();
  }

  return STEPS.map((s) => s(request));
}
