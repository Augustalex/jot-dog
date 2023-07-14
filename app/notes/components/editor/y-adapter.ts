import { MutableRefObject, useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { EditorView, basicSetup } from "codemirror";
import { keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import * as random from "lib0/random";
import { EditorState, ChangeSet } from "@codemirror/state";
import { useAblyClient } from "../../../ably/client";
import { yCollab, yUndoManagerKeymap } from "./y-collab";
import { markdown } from "@codemirror/lang-markdown";
import { Types } from "ably";
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
} from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import * as promise from "lib0/promise";
import * as error from "lib0/error";
import { createMutex } from "lib0/mutex";
import { encodeUtf8 } from "lib0/string";
import throttle from "lodash/throttle";

// TODO:
// Introcue Batching and Latency (so we don't hit rate limit)
// Fix saving (and potentially initial sync?)
// Cleanup!

export const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

export const userColor = usercolors[random.uint32() % usercolors.length];

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageBcPeerId = 4;

const createProvider = ({
  ably,
  yDoc,
  yText,
  key,
}: {
  ably: Types.RealtimePromise;
  yDoc: Y.Doc;
  yText: Y.Text;
  key?: CryptoKey | undefined;
}) => {
  const channel = ably.channels.get("ydoc");

  const awareness = new Awareness(yDoc);
  const mux = createMutex();

  const broadcastSoon = broadcast;
  // const broadcastSoon = throttle(broadcast, 1000, {
  //   leading: false,
  //   trailing: true,
  // });

  setup();

  return {
    awareness,
  };

  function setup() {
    console.log("yText", yText);
    yDoc.on("update", (update, origin) => {
      console.log("YDOC RECEIVED UPDATE FROM...", origin);
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);

      console.log("yDoc update");
      broadcastSoon(encoding.toUint8Array(encoder));
    });
    awareness.on("update", ({ added, updated, removed }, origin) => {
      const changedClients = added.concat(updated).concat(removed);
      const encoderAwareness = encoding.createEncoder();
      encoding.writeVarUint(encoderAwareness, messageAwareness);
      encoding.writeVarUint8Array(
        encoderAwareness,
        encodeAwarenessUpdate(awareness, changedClients)
      );

      broadcastSoon(encoding.toUint8Array(encoderAwareness));
    });

    channel.subscribe("update", (message) => {
      if (message.connectionId === ably.connection.id) return;
      const data = message.data;
      decrypt(new Uint8Array(data), key).then((m) =>
        mux(() => {
          console.log("channel subscribe event! update:");
          const reply = readMessage(m);
          if (reply) {
            broadcast(encoding.toUint8Array(reply));
          }
        })
      );
    });
  }

  function broadcast(data: Uint8Array) {
    encrypt(data, key).then((data) => {
      mux(() => {
        console.log("channel publish");
        channel.publish("update", data);
      });
    });
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
        encoding.writeVarUint(encoder, messageSync);
        const syncMessageType = syncProtocol.readSyncMessage(
          decoder,
          encoder,
          doc,
          origin
        );
        if (syncMessageType === syncProtocol.messageYjsSyncStep1) {
          sendReply = true;
        }
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

export function useEditorData(
  localId: string,
  editorRef: HTMLDivElement | null,
  serverContent: string
) {
  const [yDoc, setYDoc] = useState(null);
  const [yText, setYText] = useState(null);
  const [initialDoc, setInitialDoc] = useState(null);
  const [extensions, setExtensions] = useState(null);
  const [editor, setEditor] = useState(null);
  const { ably } = useAblyClient(localId);

  useEffect(() => {
    if (!ably.get()) return;
    if (!editorRef) return;

    (async () => {
      // const key = await deriveKey();
      // console.log("GOT KEY:", key);

      const yDoc = new Y.Doc();
      setYDoc(yDoc);

      const yText = yDoc.getText("codemirror");
      yText.insert(0, serverContent);
      setYText(yText);

      const provider = createProvider({
        ably: ably.get(),
        yDoc,
        yText,
        key: undefined,
      });
      provider.awareness.setLocalStateField("user", {
        name: "Anonymous " + Math.floor(Math.random() * 100),
        color: userColor.color,
        colorLight: userColor.light,
      });

      setInitialDoc(yText.toString());

      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          keymap.of([...yUndoManagerKeymap]),
          basicSetup,
          markdown(),
          EditorView.lineWrapping,
          yCollab(yText, provider.awareness),
        ],
      });
      const view = new EditorView({
        state,
        parent: editorRef,
      });
    })();
  }, [ably, editorRef, serverContent]);

  return {
    ready: yDoc !== null,
    initialDoc,
    extensions,
  };
}

function decrypt(data: Uint8Array, key: CryptoKey): PromiseLike<Uint8Array> {
  if (!key) {
    return promise.resolve(data) as PromiseLike<Uint8Array>;
  }

  const dataDecoder = decoding.createDecoder(data);
  const algorithm = decoding.readVarString(dataDecoder);
  if (algorithm !== "AES-GCM") {
    promise.reject(error.create("Unknown encryption algorithm"));
  }
  const iv = decoding.readVarUint8Array(dataDecoder);
  const cipher = decoding.readVarUint8Array(dataDecoder);
  return crypto.subtle
    .decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      cipher
    )
    .then((data) => new Uint8Array(data));
}

function encrypt(data: Uint8Array, key: CryptoKey): PromiseLike<Uint8Array> {
  if (!key) {
    return promise.resolve(data) as PromiseLike<Uint8Array>;
  }

  const iv = crypto.getRandomValues(new Uint8Array(12));
  return crypto.subtle
    .encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      data
    )
    .then((cipher) => {
      const encryptedDataEncoder = encoding.createEncoder();
      encoding.writeVarString(encryptedDataEncoder, "AES-GCM");
      encoding.writeVarUint8Array(encryptedDataEncoder, iv);
      encoding.writeVarUint8Array(encryptedDataEncoder, new Uint8Array(cipher));
      return encoding.toUint8Array(encryptedDataEncoder);
    });
}

function deriveKey(
  secret: string = "secret",
  username: string = "user"
): PromiseLike<CryptoKey> {
  const secretBuffer = encodeUtf8(secret).buffer;
  const salt = encodeUtf8(username).buffer;
  return crypto.subtle
    .importKey("raw", secretBuffer, "PBKDF2", false, ["deriveKey"])
    .then((keyMaterial) =>
      crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      )
    );
}
