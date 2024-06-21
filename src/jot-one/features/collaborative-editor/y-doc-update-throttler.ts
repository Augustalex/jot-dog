import * as Y from "yjs";
import * as encoding from "lib0/encoding";
import { messageSync } from "./message-constants";
import throttle from "lodash/throttle";

export function YDocUpdateThrottler({
  send,
  delay,
}: {
  send: (data: Uint8Array) => void;
  delay: number;
}) {
  let queue: any[] = [];

  const doUpdate = () => {
    const update = Y.mergeUpdates(queue);
    queue = [];

    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarUint8Array(encoder, update);

    send(encoding.toUint8Array(encoder));
  };
  const scheduleUpdate = throttle(doUpdate, delay, {
    leading: false,
    trailing: true,
  });

  return (update: any) => {
    queue.push(update);
    scheduleUpdate();
  };
}
