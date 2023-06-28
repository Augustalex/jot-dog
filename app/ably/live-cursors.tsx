import { getAblyClient } from "./client";
import React from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";

const CHANNEL_NAME = "editors";

let setupDone = false;
let listener: Types.messageCallback<Types.Message> | null = null;

interface Cursor {
  id: string;
  x: number;
  y: number;
  c: string;
}

type UpdateCursor = (cursor: { x: number; y: number; c: string }) => void;

function listenToCursors(localId: string): [() => void, UpdateCursor] {
  if (!setupDone) setupPresence(localId).catch(console.error);

  const cleanup = () => {};

  const update = (cursor: { x: number; y: number }) => {
    getAblyClient(localId)
      .channels.get(CHANNEL_NAME)
      .publish("update", cursor)
      .catch(console.error);
  };

  return [cleanup, update];
}

function hookOnToListener(onUpdate: Types.messageCallback<Types.Message>) {
  const setupListener = () => {
    listener = onUpdate;
  };

  setupListener();

  return () => {
    if (listener === onUpdate) listener = null;
  };
}

async function setupPresence(localId: string) {
  try {
    const ablyClient = getAblyClient(localId);
    console.log("SETUP LIVE CURSOR SUB:", ablyClient);
    const channel = ablyClient.channels.get(CHANNEL_NAME);
    await channel.subscribe("update", (...args) => {
      console.log("udpate!");
      listener?.(...args);
    });
    setupDone = true;
  } catch (error) {
    console.error(error);

    return [];
  }
}

export function useLiveCursors(localId: string): [Cursor[], UpdateCursor] {
  const [updateCursor, setUpdateCursor] = React.useState<{ run: UpdateCursor }>(
    { run: () => {} }
  );
  const [cursors, setCursors] = React.useState<Cursor[]>([]);

  const onUpdate = React.useCallback(
    (message: Types.Message) => {
      console.log("UPDATE", message);
      setCursors([
        ...cursors.filter((c) => c.id !== message.clientId),
        {
          x: message.data.x,
          y: message.data.y,
          c: message.data.c,
          id: message.clientId,
        },
      ]);
    },
    [cursors]
  );

  React.useEffect(() => {
    console.log("SETUP LISTENER");
    return hookOnToListener(onUpdate);
  }, [onUpdate]);

  React.useEffect(() => {
    console.log("SETUP ABLY");
    const [cleanup, update] = listenToCursors(localId);
    setUpdateCursor({ run: throttle(update, 1000) });

    return cleanup;
  }, [localId]);

  return [cursors, updateCursor.run];
}
