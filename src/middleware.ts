import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  EXPIRED_TOKEN,
  isPrivateNote,
  NO_ACCESS,
  NO_TOKEN,
  publicLogin,
  verifyFileAccess,
} from "./utils/auth/edge-auth";
import { getAdjectiveAnimal } from "./utils/animal-name";

export async function middleware(request: NextRequest) {
  // Ignore files and images.
  const url = new URL(request.url);
  if (url.pathname.includes(".")) {
    return NextResponse.next();
  }

  // Ensure that user has a local-id, if not then set the cookie and
  // redirect back to same URL to ensure cookie is in the request object
  if (!request.cookies.has("local-id")) {
    const response = NextResponse.redirect(request.nextUrl.clone());
    response.cookies.set("local-id", getAdjectiveAnimal());
    return response;
  }

  const responseOrNull = await ensureLoggedIn(request);
  if (responseOrNull) return responseOrNull;

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
          return NextResponse.json(
            {
              message: error?.message ?? "unknown error",
              context: "public login",
            },
            { status: 500 }
          );
        }
      }
    } else if (error.message === NO_ACCESS) {
      return NextResponse.json(
        { message: error, context: "verifying access" },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { message: "Something went wrong", context: "verifying access" },
        { status: 500 }
      );
    }
  }

  return null;
}

export const config = {
  matcher: ["/((?!_next|ably|static|favicon.ico).*)"],
};