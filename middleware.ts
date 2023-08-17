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
import { getAdjectiveAnimal } from "./app/guest/animal-name";

export async function middleware(request: NextRequest) {
  const responseOrNull = await ensureLoggedIn(request);
  if (responseOrNull) return responseOrNull;

  console.log("has local id? ", request.cookies.has("local-id"));
  if (!request.cookies.has("local-id")) {
    const response = NextResponse.next();
    response.cookies.set("local-id", getAdjectiveAnimal());
    console.log("setting local id");
    return response;
  } else {
    console.log("NOT setting local id");
  }

  return NextResponse.next();
}

async function ensureLoggedIn(
  request: NextRequest
): Promise<NextResponse | null> {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter((s) => s.length > 0);
  if (parts.length !== 1) return NextResponse.next();
  const [rootPath] = parts;

  try {
    await verifyFileAccess(rootPath, request);
  } catch (error) {
    if (error.message === EXPIRED_TOKEN || error.message === NO_TOKEN) {
      if (await isPrivateNote(rootPath)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${rootPath}/login`;
        return NextResponse.redirect(url);
      } else {
        try {
          await publicLogin({ fileKey: rootPath }, NextResponse.next());
        } catch (error) {
          return NextResponse.json({ message: error }, { status: 500 });
        }
      }
    } else if (error.message === NO_ACCESS) {
      return NextResponse.json({ message: error }, { status: 401 });
    } else {
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }

  return null;
}

export const config = {
  matcher: ["/((?!_next|ably|static|favicon.ico).*)"],
};