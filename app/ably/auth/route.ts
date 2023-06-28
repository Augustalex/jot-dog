import Ably from "ably/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (!process.env.ABLY_API_KEY) {
    return NextResponse.json(
      {
        errorMessage: `Missing ABLY_API_KEY environment variable.
                If you're running locally, please ensure you have a ./.env file with a value for ABLY_API_KEY=your-key.
                If you're running in Netlify, make sure you've configured env variable ABLY_API_KEY. 
                Please see README.md for more details on configuring your Ably API Key.`,
      },
      { status: 500 }
    );
  } else {
    const requestBody = await request.text();
    console.log(requestBody);
    const clientId = requestBody.split("=")[1] || "NO_CLIENT_ID";
    const client = new Ably.Rest(process.env.ABLY_API_KEY);

    const body = await client.auth.createTokenRequest({
      clientId,
      capability: { "*": ["publish", "subscribe", "presence"] },
    });

    const response = NextResponse.json(body, { status: 200 });
    response.cookies.set({
      name: "local-id",
      value: clientId,
      httpOnly: true,
    });
    return response;
  }
}
