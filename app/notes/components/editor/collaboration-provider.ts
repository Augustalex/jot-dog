import { Types } from "ably";
import * as Y from "yjs";
import { NoteFile } from "../../utils/file-utils";
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import { YDocUpdateThrottler } from "./y-doc-update-throttler";
import { YDocPersister } from "./YDocPersister";
import { AwarenessChangeThrottler } from "./awareness-change-throttler";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import {
  messageAwareness,
  messageBcPeerId,
  messageQueryAwareness,
  messageSync,
  persistedDocument,
} from "./message-constants";

export const CollaborationProvider = ({
  ably,
  yDoc,
  file,
  initialData,
  persist,
}: {
  ably: Types.RealtimePromise;
  yDoc: Y.Doc;
  file: NoteFile;
  initialData?: Uint8Array;
  persist: (data: Uint8Array) => Promise<void>;
}) => {
  const channel = ably.channels.get(`ydoc:${file.key}`);

  const awareness = new Awareness(yDoc);

  const scheduleYDocUpdate = YDocUpdateThrottler({
    send: broadcast,
    delay: 1000,
  });
  const schedulePersist = YDocPersister({
    file,
    yDoc,
    persist,
    persistInterval: 3 * 1000,
  });
  const scheduleAwarenessUpdate = AwarenessChangeThrottler({
    awareness,
    send: broadcast,
    delay: 1000,
  });

  setup();

  return {
    awareness,
  };

  function setup() {
    yDoc.on("update", (update, origin) => {
      if (origin === "remote") return;
      scheduleYDocUpdate(update);
      schedulePersist();
    });
    awareness.on("update", ({ added, updated, removed }, origin) => {
      scheduleAwarenessUpdate({ added, updated, removed });
    });

    channel.subscribe("update", (message) => {
      if (message.connectionId === ably.connection.id) return;
      const rawData = message.data;
      const data = new Uint8Array(rawData);
      const reply = readMessage(data);
      if (reply) {
        broadcast(encoding.toUint8Array(reply));
      }
    });

    // Apply initial data
    if (initialData) {
      try {
        readMessage(new Uint8Array(initialData));
      } catch (error) {
        console.error(error);
      }
    }
  }

  function broadcast(data: Uint8Array) {
    channel.publish("update", data);
  }

  function readMessage(buf: Uint8Array): encoding.Encoder | null {
    const origin = "remote"; // originally: room, What should the origin be? Remote? ClientID?
    const decoder = decoding.createDecoder(buf);
    const encoder = encoding.createEncoder();

    const messageType = decoding.readVarUint(decoder);
    const doc: Y.Doc = yDoc;
    let sendReply = false;
    switch (messageType) {
      case messageSync: {
        const update = decoding.readVarUint8Array(decoder);
        Y.applyUpdate(doc, update, origin);

        break;
      }
      case messageQueryAwareness:
        encoding.writeVarUint(encoder, messageAwareness);
        encoding.writeVarUint8Array(
          encoder,
          encodeAwarenessUpdate(
            awareness,
            Array.from(awareness.getStates().keys())
          )
        );
        sendReply = true;
        break;
      case messageAwareness:
        applyAwarenessUpdate(
          awareness,
          decoding.readVarUint8Array(decoder),
          origin
        );
        break;
      case messageBcPeerId: {
        // Not needed?
        break;
      }
      case persistedDocument: {
        const update = decoding.readVarUint8Array(decoder);
        Y.applyUpdate(doc, update, origin);
        break;
      }
      default:
        console.error("Unable to compute message");
        return encoder;
    }
    if (!sendReply) {
      // nothing has been written, no answer created
      return null;
    }
    return encoder;
  }
};
