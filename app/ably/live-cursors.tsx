import { useAblyClient } from "./client";
import React, { useEffect } from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";
import { NoteFile } from "../notes/utils/file-utils";

let listener: Types.messageCallback<Types.Message> | null = null;

interface Cursor extends CursorData {
  id: string;
}

interface CursorData {
  x: number;
  y: number;
  c: string;
  d: number;
}

interface BatchItem {
  cursor: CursorData;
  clock: number;
}

interface Batch {
  items: BatchItem[];
  startTime: number;
}

type UpdateCursor = (cursorBatch: BatchItem[]) => void;
type UpdateSingleCursor = (cursor: CursorData) => void;

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
): [Cursor[], UpdateSingleCursor, Omit<Cursor, "id">] {
  const { ably: ablyRef } = useAblyClient(localId);
  const batch = React.useRef<Batch>({ items: [], startTime: 0 });
  const processBatchByClientId = React.useRef<Map<string, Batch>>(new Map());
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

  useEffect(() => {
    let running = true;

    const loop = () => {
      if (!running) return;

      let newCursors = null;

      // Process remote cursor batches
      for (const [clientId, batch] of Array.from(
        processBatchByClientId.current.entries()
      )) {
        const [items, color] = batch.items;

        if (items.length === 0) {
          processBatchByClientId.current.delete(clientId);
          continue;
        }

        const duration = Date.now() - batch.startTime;
        const clock = items[0][3];
        if (duration >= clock * 1.1) {
          const [x, y, d] = items.shift();
          if (newCursors === null) newCursors = [];

          newCursors = [
            ...(newCursors || cursors).filter((c) => c.id !== clientId),
            {
              x,
              y,
              d,
              c: color,
              id: clientId,
            },
          ];
        }
      }

      if (newCursors !== null) {
        setCursors(newCursors);
      }

      // Send local cursor update batch
      if (
        Date.now() - batch.current.startTime > 500 &&
        batch.current.items.length > 0
      ) {
        const size = batch.current.items.length;
        const mod = Math.ceil(size / 16);
        const slicedBatch = batch.current.items.reduce((acc, item, i) => {
          if (i % mod === 0 || i === size - 1) {
            acc.push(item);
          }
          return acc;
        }, []);

        updateCursor.run([slicedBatch, batch.current.color]);
        batch.current.items = [];
      }

      requestAnimationFrame(loop);
    };
    loop();
    return () => {
      running = false;
    };
  }, [cursors, updateCursor]);

  const onUpdate = React.useCallback((message: Types.Message) => {
    const batches = processBatchByClientId.current;
    batches.set(message.clientId, {
      items: message.data,
      startTime: Date.now(),
    });
  }, []);

  React.useEffect(() => {
    return hookOnToListener(onUpdate);
  }, [onUpdate]);

  const batchUpdateCursor = React.useCallback(
    (cursor: { x: number; y: number; c: string; d: number }) => {
      if (batch.current.items.length === 0) {
        batch.current.startTime = Date.now();
      }

      const duration = Date.now() - batch.current.startTime;
      const { x, y, d } = cursor;
      batch.current.color = cursor.c;
      batch.current.items.push([x, y, d, duration]);
    },
    []
  );

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
      run: (cursor: BatchItem[]) => {
        const [x, y, d] = cursor[0][cursor[0].length - 1];
        setLastSentLocalCursor({ x, y, d, c: cursor[1] });

        _channel.publish("update", cursor).catch(console.error);
      },
    });
    channel.current = _channel;
  }, [ablyRef, file.key]); // Only run the client

  return [cursors, batchUpdateCursor, lastSentLocalCursor];
}
