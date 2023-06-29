import { useAblyClient } from "./client";
import React, { useEffect } from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";
import { NoteFile } from "../notes/utils/file-utils";

let listener: Types.messageCallback<Types.Message> | null = null;

interface Cursor {
  id: string;
  x: number;
  y: number;
  c: string;
  d: number;
}

type UpdateCursor = (cursor: {
  x: number;
  y: number;
  c: string;
  d: number;
}) => void;

function hookOnToListener(onUpdate: Types.messageCallback<Types.Message>) {
  const setupListener = () => {
    listener = onUpdate;
  };

  setupListener();

  return () => {
    if (listener === onUpdate) listener = null;
  };
}

export function useLiveCursors(
  file: NoteFile,
  localId: string
): [Cursor[], UpdateCursor, Omit<Cursor, "id">] {
  const { ably: ablyRef } = useAblyClient(localId);
  const channel = React.useRef<Types.RealtimeChannelPromise | null>(null);
  const [updateCursor, setUpdateCursor] = React.useState<{
    run: UpdateCursor;
  }>({
    run: () => {},
  });
  const [lastSentLocalCursor, setLastSentLocalCursor] = React.useState<
    Omit<Cursor, "id">
  >({
    x: 0,
    y: 0,
    c: "black",
    d: 0,
  });
  const [cursors, setCursors] = React.useState<Cursor[]>([]);

  const onUpdate = React.useCallback(
    (message: Types.Message) => {
      setCursors([
        ...cursors.filter((c) => c.id !== message.clientId),
        {
          x: message.data.x,
          y: message.data.y,
          c: message.data.c,
          d: message.data.d,
          id: message.clientId,
        },
      ]);
    },
    [cursors]
  );

  React.useEffect(() => {
    return hookOnToListener(onUpdate);
  }, [onUpdate]);

  useEffect(() => {
    if (!ablyRef.get()) return;
    if (channel.current) return;

    const _channel = ablyRef.get().channels.get(`cursors:${file.key}`);
    _channel
      .subscribe((...args) => {
        listener?.(...args);
      })
      .catch(console.error);

    setUpdateCursor({
      run: throttle((cursor: Omit<Cursor, "id">) => {
        setLastSentLocalCursor(cursor);
        _channel.publish("update", cursor).catch(console.error);
      }, 1000),
    });
    channel.current = _channel;
  }, [ablyRef, file.key]); // Only run the client

  return [cursors, updateCursor.run, lastSentLocalCursor];
}
