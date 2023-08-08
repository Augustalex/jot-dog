import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  EXPIRED_TOKEN,
  isPrivateNote,
  NO_ACCESS,
  NO_TOKEN,
  publicLogin,
  verifyFileAccess,
} from "./app/auth/utils/edge-auth";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter((s) => s.length > 0);
  console.log("PARTS:", parts, parts.length, url.pathname);
  if (parts.length !== 1) return NextResponse.next();
  const [rootPath] = parts;

  try {
    console.log("VERIFY..");
    await verifyFileAccess(rootPath, request);
    console.log("SUCCESS!");
    return NextResponse.next();
  } catch (error) {
    if (error.message === EXPIRED_TOKEN || error.message === NO_TOKEN) {
      console.log("NO TOKEN!");
      if (await isPrivateNote(rootPath)) {
        console.log("PRIVATE NOTE!");
        const url = request.nextUrl.clone();
        url.pathname = `/${rootPath}/test-login`;
        return NextResponse.redirect(url);
      } else {
        try {
          await publicLogin({ fileKey: rootPath }, NextResponse.next());
        } catch (error) {
          return NextResponse.json({ message: error }, { status: 500 });
        }
      }
    } else if (error.message === NO_ACCESS) {
      console.log("NO ACCESS!");
      return NextResponse.json({ message: error }, { status: 401 });
    } else {
      console.log("ERROR!", error);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
}

export const config = {
  matcher: ["/((?!_next|ably|static|favicon.ico).*)"],
};
