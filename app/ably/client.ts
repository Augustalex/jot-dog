"use client";

import { useState, useEffect } from "react";
import * as Ably from "ably/promises";
import { configureAbly } from "@ably-labs/react-hooks";
import vcdiffPlugin from "@ably/vcdiff-decoder";

export const useAblyClient = (localId: string) => {
  const [ably, setAbly] = useState<Ably.Types.RealtimePromise>(null);

  useEffect(() => {
    const newAbly: Ably.Types.RealtimePromise = configureAbly({
      authUrl: "/ably/auth",
      authMethod: "POST",
      clientId: localId,
      plugins: { vcdiff: vcdiffPlugin },
    });
    setAbly(newAbly);

    return () => {
      newAbly.connection.off();
    };
  }, [localId]); // Only run the client

  return {
    ably,
    clientId: localId,
  };
};
