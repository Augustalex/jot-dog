import { NextRequest, NextResponse } from "next/server";
import { getAdjectiveAnimal } from "./jot-one/utils/animal-name";

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

  return NextResponse.next();
}

/*
  This config is global for both Jot One and Jot Two.
 */
export const config = {
  matcher: ["/((?!_next|ably|static|favicon.ico).*)"],
};
