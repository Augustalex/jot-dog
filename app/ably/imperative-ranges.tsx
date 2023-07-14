import Ably from "ably/promises";
import throttle from "lodash/throttle";
import { NoteFile } from "../notes/utils/file-utils";

interface LiveRange {
  id: string;
  s: number;
  e: number;
}

let instance = null;

export function setupLiveRanges(
  ably: Ably.Types.RealtimePromise,
  file: NoteFile,
  imperativeUpdate: (ranges: LiveRange[]) => void
): ReturnType<typeof setupLiveRangesActual> {
  if (instance) return instance;
  instance = setupLiveRangesActual(ably, file, imperativeUpdate);
}

function setupLiveRangesActual(
  ably: Ably.Types.RealtimePromise,
  file: NoteFile,
  imperativeUpdate: (ranges: LiveRange[]) => void
) {
  let listeners: ((liveRanges: LiveRange[]) => void)[] = [];

  const updateLiveRange = throttle((cursor: Omit<LiveRange, "id">) => {
    channel.publish("update", cursor).catch(console.error);
  }, 1000);
  let liveRanges: LiveRange[] = [];

  const channel = ably.channels.get(`ranges:${file.key}`);
  channel
    .subscribe((message) => {
      liveRanges = [
        ...liveRanges.filter((c) => c.id !== message.clientId),
        {
          s: message.data.s,
          e: message.data.e,
          id: message.clientId,
        },
      ];
      for (let l of listeners) {
        l(liveRanges);
      }
      imperativeUpdate(liveRanges);
    })
    .catch(console.error);

  return {
    onUpdate,
    updateLiveRange,
  };

  function onUpdate(listener: (liveRanges: LiveRange[]) => void) {
    listeners.push(listener);
  }
}
