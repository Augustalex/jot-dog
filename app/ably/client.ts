"use client";

import { Realtime } from "ably/promises";

let ablyClient: Realtime;

export function getAblyClient(localId: string) {
  if (ablyClient) return ablyClient;

  if (!localId) {
    console.error("Trying to use Ably without a local ID. This is a bug.");
  }

  ablyClient = new Realtime({
    authUrl: "https://www.agge.dev/ably/auth",
    closeOnUnload: true,
    authHeaders: {
      Cookie: `local-id=${localId}`,
    },
    transportParams: { heartbeatInterval: 10000 },
  });

  return ablyClient;
}
