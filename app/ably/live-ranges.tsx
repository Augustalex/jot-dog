import { useAblyClient } from "./client";
import React, { useEffect } from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";
import { NoteFile } from "../notes/utils/file-utils";

let listener: Types.messageCallback<Types.Message> | null = null;

interface LiveRange {
  id: string;
  s: number;
  e: number;
}

type UpdateLiveRange = (cursor: { s: number; e: number }) => void;

function hookOnToListener(onUpdate: Types.messageCallback<Types.Message>) {
  const setupListener = () => {
    listener = onUpdate;
  };

  setupListener();

  return () => {
    if (listener === onUpdate) listener = null;
  };
}

export function useLiveRanges(
  file: NoteFile,
  localId: string,
  imperativeUpdate: (ranges: LiveRange[]) => void
): [LiveRange[], UpdateLiveRange, Omit<LiveRange, "id">] {
  const { ably: ablyRef } = useAblyClient(localId);
  const channel = React.useRef<Types.RealtimeChannelPromise | null>(null);
  const [updateLiveRange, setUpdateLiveRange] = React.useState<{
    run: UpdateLiveRange;
  }>({
    run: () => {},
  });
  const [lastSentLiveRange, setLastSentLiveRange] = React.useState<
    Omit<LiveRange, "id">
  >({
    s: 0,
    e: 0,
  });
  const [liveRanges, setLiveRanges] = React.useState<LiveRange[]>([]);

  const onUpdate = React.useCallback(
    (message: Types.Message) => {
      const newRanges = [
        ...liveRanges.filter((c) => c.id !== message.clientId),
        {
          s: message.data.s,
          e: message.data.e,
          id: message.clientId,
        },
      ];
      setLiveRanges(newRanges);
      imperativeUpdate(newRanges);
    },
    [liveRanges]
  );

  React.useEffect(() => {
    return hookOnToListener(onUpdate);
  }, [onUpdate]);

  useEffect(() => {
    if (!ablyRef.get()) return;
    if (channel.current) return;

    const _channel = ablyRef.get().channels.get(`ranges:${file.key}`);
    _channel
      .subscribe((...args) => {
        listener?.(...args);
      })
      .catch(console.error);

    setUpdateLiveRange({
      run: throttle((cursor: Omit<LiveRange, "id">) => {
        setLastSentLiveRange(cursor);
        _channel.publish("update", cursor).catch(console.error);
      }, 1000),
    });
    channel.current = _channel;
  }, [ablyRef, file.key]); // Only run the client

  return [liveRanges, updateLiveRange.run, lastSentLiveRange];
}
