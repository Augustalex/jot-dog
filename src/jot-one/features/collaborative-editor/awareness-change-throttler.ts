import * as encoding from "lib0/encoding";
import { messageAwareness } from "./message-constants";
import { encodeAwarenessUpdate } from "y-protocols/awareness";
import throttle from "lodash/throttle";

export function AwarenessChangeThrottler({
  awareness,
  send,
  delay,
}: {
  awareness: any;
  send: (data: Uint8Array) => void;
  delay: number;
}) {
  let latestChanges: any[] = [];

  const scheduleUpdate = throttle(doUpdate, delay, {
    leading: false,
    trailing: true,
  });

  return ({
    added,
    updated,
    removed,
  }: {
    added: any[];
    updated: any[];
    removed: any[];
  }) => {
    if (added.length > 0 || removed.length > 0) {
      latestChanges = added.concat(updated).concat(removed);
      doUpdate();
    } else {
      latestChanges = updated;
      scheduleUpdate();
    }
  };

  function doUpdate() {
    const encoderAwareness = encoding.createEncoder();
    encoding.writeVarUint(encoderAwareness, messageAwareness);
    encoding.writeVarUint8Array(
      encoderAwareness,
      encodeAwarenessUpdate(awareness, latestChanges)
    );
    latestChanges = [];

    send(encoding.toUint8Array(encoderAwareness));
  }
}
