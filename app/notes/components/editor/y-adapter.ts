import { useEffect, useState } from "react";
import * as Y from "yjs";
import { basicSetup, EditorView } from "codemirror";
import {
  Decoration,
  DecorationSet,
  keymap,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import * as random from "lib0/random";
import { EditorState } from "@codemirror/state";
import { useAblyClient } from "../../../ably/client";
import { yCollab, yUndoManagerKeymap } from "./y-collab";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { Types } from "ably";
import {
  applyAwarenessUpdate,
  Awareness,
  encodeAwarenessUpdate,
} from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import throttle from "lodash/throttle";
import { YDocPersister } from "./YDocPersister";
import { indentWithTab } from "@codemirror/commands";
import { NoteFile } from "../../utils/file-utils";
import { myTheme } from "./themes/theme";
import { Y_TEXT_KEY } from "./constants";

const assistTheme = EditorView.baseTheme({
  ".cm-clickable-link": {
    color: "#0000EE",
  },
});

const placeholderMatcher = new MatchDecorator({
  regexp: /(http:\/\/|https:\/\/|www.)(.*)/gi,
  decoration: (match) => {
    const url = match[0];
    return Decoration.mark({
      class: "cm-clickable-link",
      attributes: { "data-url": url },
    });
  },
});

const placeholders = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet;
    constructor(view: EditorView) {
      this.placeholders = placeholderMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.placeholders = placeholderMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.decorations.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
    // provide: (plugin) =>
    //   EditorView.atomicRanges.of((view) => {
    //     return view.plugin(plugin)?.placeholders || Decoration.none;
    //   }),
  }
);

export const userColors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

export const userColor = userColors[random.uint32() % userColors.length];

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageBcPeerId = 4;
const persistedDocument = 7;

export function useEditorData(
  localId: string,
  file: NoteFile,
  editorRef: HTMLDivElement | null,
  serverContent: Uint8Array,
  persist: (data: Uint8Array) => Promise<void>
) {
  const [yDoc, setYDoc] = useState(null);
  const { ably } = useAblyClient(localId);

  useEffect(() => {
    if (!ably.get()) return;
    if (!editorRef) return;

    if (yDoc) return;

    (async () => {
      const yDoc = new Y.Doc();
      setYDoc(yDoc);

      const yText = yDoc.getText(Y_TEXT_KEY);

      const provider = createProvider({
        ably: ably.get(),
        yDoc,
        initialData: serverContent,
        persist,
        file,
      });
      provider.awareness.setLocalStateField("user", {
        name: localId,
        color: userColor.color,
        colorLight: userColor.light,
      });

      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          keymap.of([...yUndoManagerKeymap, indentWithTab]),
          basicSetup,
          assistTheme,
          markdown({
            base: markdownLanguage,
          }),
          EditorView.lineWrapping,
          placeholders,
          yCollab(yText, provider.awareness),
          myTheme,
        ],
      });
      const view = new EditorView({
        state,
        parent: editorRef,
      });

      window.addEventListener("click", (e) => {
        if (triggersSpecialMode(e) && e.target) {
          // @ts-ignore
          const activeLine = e.target?.closest?.(".cm-activeLine");

          if (activeLine) {
            const domElement = view.domAtPos(view.state.selection.main.head);
            const url =
              // @ts-ignore
              domElement?.node?.cmView?.parent?.mark?.attrs?.["data-url"];

            if (url) {
              window.open(url, "_blank");
            }
          }
        }
      });
      window.addEventListener("keydown", (e) => {
        if (triggersSpecialMode(e)) document.body.classList.add("ctrl");
        else document.body.classList.remove("ctrl");
      });
      window.addEventListener("keyup", (e) => {
        if (triggersSpecialMode(e)) document.body.classList.add("ctrl");
        else document.body.classList.remove("ctrl");
      });
    })();
  }, [ably, editorRef, file, persist, serverContent, yDoc]);

  return {
    ready: yDoc !== null,
    yDoc,
  };
}

function triggersSpecialMode(e: any) {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
}

const createProvider = ({
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

function YDocUpdateThrottler({ send, delay }) {
  let queue = [];

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

function AwarenessChangeThrottler({ awareness, send, delay }) {
  let latestChanges = [];

  const doUpdate = () => {
    const encoderAwareness = encoding.createEncoder();
    encoding.writeVarUint(encoderAwareness, messageAwareness);

    encoding.writeVarUint8Array(
      encoderAwareness,
      encodeAwarenessUpdate(awareness, latestChanges)
    );
    latestChanges = [];

    send(encoding.toUint8Array(encoderAwareness));
  };
  const scheduleUpdate = throttle(doUpdate, delay, {
    leading: false,
    trailing: true,
  });

  return ({ added, updated, removed }) => {
    if (added.length > 0 || removed.length > 0) {
      latestChanges = added.concat(updated).concat(removed);
      doUpdate();
    } else {
      latestChanges = updated;
      scheduleUpdate();
    }
  };
}
