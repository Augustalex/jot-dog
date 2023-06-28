"use client";

import { useState, useEffect } from "react";

import * as Ably from "ably/promises";
import { configureAbly } from "@ably-labs/react-hooks";

export default function useAblyClient(localId: string) {
  const [ably, setAbly] = useState<Ably.Types.RealtimePromise>(null);
  const [clientId, setClientId] = useState<string>(localId);

  useEffect(() => {
    let clientId = localId;
    if (!clientId) {
      clientId =
        prompt("What is your name?") ??
        `Lab rat #${Math.floor(Math.random() * 1000)}`;
      setClientId(clientId);
    }

    const newAbly: Ably.Types.RealtimePromise = configureAbly({
      authUrl: "/ably/auth",
      authMethod: "POST",
      clientId,
    });
    setAbly(newAbly);

    return () => {
      newAbly.connection.off();
    };
  }, [localId]); // Only run the client

  return { ably, clientId };
}
