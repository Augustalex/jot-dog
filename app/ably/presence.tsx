import { getAblyClient } from "./client";
import React from "react";

const CHANNEL_NAME = "editors";

let setupDone = false;
const listeners = [];

function listenToPresence(
  localId: string,
  setClients: (clients: string[]) => void
) {
  const listener = () => {
    getAblyClient(localId)
      .channels.get(CHANNEL_NAME)
      .presence.get()
      .then((clients) => setClients(clients.map((c) => c.clientId)));
  };

  const setupListener = () => {
    listener();
    listeners.push(listener);
  };

  if (!setupDone) setupPresence(localId).then(setupListener);
  else setupListener();

  return () => {
    const index = listeners.indexOf(listener);
    if (index >= 0) listeners.splice(listeners.indexOf(listener), 1);
  };
}

async function setupPresence(localId: string) {
  try {
    const channel = getAblyClient(localId).channels.get(CHANNEL_NAME);
    setupDone = true;

    await channel.presence.enter("editing");
    await channel.presence.subscribe((...args) => {
      for (const listener of listeners) {
        listener(...args);
      }
    });

    return await channel.presence.get();
  } catch (error) {
    console.error(error);

    return [];
  }
}

export function usePresence(localId: string) {
  const [clients, setClients] = React.useState<string[]>([]);

  React.useEffect(() => {
    return listenToPresence(localId, setClients);
  }, [localId]);

  return { clients };
}
