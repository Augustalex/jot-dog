import Ably from "ably";
import { NextRequest, NextResponse } from "next/server";

const key = process.env.ABLY_API_KEY;
if (!key) {
  throw "Cannot run without an Ably API key.";
}

const ably = new Ably.Rest.Promise({ key: key });

export async function GET(request: NextRequest) {
  const local = request.cookies.get("local-id");
  let clientId =
    local?.value ?? `unknown-${Math.round(Math.random() * 9999).toString()}`;

  const body = await ably.auth.createTokenRequest({
    clientId,
    capability: { "*": ["publish", "subscribe", "presence"] },
  });
  return NextResponse.json(body);
}
