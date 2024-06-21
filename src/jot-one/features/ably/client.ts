"use client";

import { useState, useEffect } from "react";
import * as Ably from "ably/promises";
import { configureAbly } from "@ably-labs/react-hooks";

let ablyClient: Ably.Types.RealtimePromise | null = null;

export function getAbly() {
  return ablyClient;
}

export const useAblyClient = (localId: string) => {
  const [ably, setAbly] = useState<{
    get: () => Ably.Types.RealtimePromise | null;
  }>({
    get: () => getAbly(),
  });

  useEffect(() => {
    const currentClient = ably.get();
    if (currentClient !== null) return;

    ablyClient = configureAbly({
      authUrl: "/ably/auth",
      authMethod: "POST",
      clientId: localId,
      // plugins: { vcdiff: vcdiffPlugin },
      useBinaryProtocol: true,
    });
    setAbly({
      get: () => getAbly(),
    });
  }, [ably, localId]); // Only run the client

  return {
    ably,
    clientId: localId,
  };
};
