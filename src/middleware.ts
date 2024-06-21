import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jotOneMiddleware} from "./jot-one/middleware";

export async function middleware(request: NextRequest) {
  if(request.url.startsWith('/one')) return jotOneMiddleware(request);
  else return NextResponse.next();
}

/*
  This config is global for both Jot One and Jot Two.
 */
export const config = {
  matcher: ["/((?!_next|ably|static|favicon.ico).*)"],
};
