import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const localId = request.cookies.get("local-id")?.value;

  const response = NextResponse.next();
  if (!localId) {
    response.cookies.set(
      "local-id",
      `${
        Math.round(Math.random() * 9999) +
        "-" +
        Math.round(Math.random() * 9999)
      }`
    );
    console.log("SETTING LOCAL ID IN MIDDLEWARE: ", localId);
  } else {
    console.log("HAS LOCAL ID IN MIDDLEWARE: ", localId);
  }

  return response;
}
