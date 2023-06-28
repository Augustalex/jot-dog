import useAblyClient from "./client";
import React, { useEffect } from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";

const CHANNEL_NAME = "editors";

let listener: Types.messageCallback<Types.Message> | null = null;

interface Cursor {
  id: string;
  x: number;
  y: number;
  c: string;
}

type UpdateCursor = (cursor: { x: number; y: number; c: string }) => void;

function hookOnToListener(onUpdate: Types.messageCallback<Types.Message>) {
  const setupListener = () => {
    listener = onUpdate;
  };

  setupListener();

  return () => {
    if (listener === onUpdate) listener = null;
  };
}

export function useLiveCursors(localId: string): [Cursor[], UpdateCursor] {
  const { ably } = useAblyClient(localId);
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

  useEffect(() => {
    if (!ably) return;

    const _channel = ably.channels.get(CHANNEL_NAME);
    _channel.subscribe((...args) => {
      listener?.(...args);
    });

    setUpdateCursor({
      run: throttle((cursor: { x: number; y: number }) => {
        _channel.publish("update", cursor).catch(console.error);
      }, 1000),
    });

    return () => {
      _channel.unsubscribe();
    };
  }, [ably, localId]); // Only run the client

  return [cursors, updateCursor.run];
}
