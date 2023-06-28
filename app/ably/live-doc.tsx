import { useAblyClient } from "./client";
import React, { useEffect } from "react";
import { Types } from "ably/promises";
import throttle from "lodash/throttle";
import { NoteFile } from "../notes/utils/file-utils";
import { saveFile } from "../notes/db/file";

let listener: Types.messageCallback<Types.Message> | null = null;

type UpdateDoc = (content: string) => void;

function hookOnToListener(onUpdate: Types.messageCallback<Types.Message>) {
  const setupListener = () => {
    listener = onUpdate;
  };

  setupListener();

  return () => {
    if (listener === onUpdate) listener = null;
  };
}

function useLiveDoc(file: NoteFile, serverContent: string, localId: string) {
  const { ably } = useAblyClient(localId);
  const updateDocNow = React.useRef<{
    run: UpdateDoc;
  }>({
    run: () => {},
  });
  const updateDocSoon = React.useRef<{
    run: UpdateDoc;
  }>({
    run: () => {},
  });
  const [updateLocalDoc, setUpdateLocalDoc] = React.useState<{
    run: UpdateDoc;
  }>({
    run: () => {},
  });
  const channel = React.useRef<Types.RealtimeChannelPromise | null>(null);
  const [lastReceivedDoc, setLastReceivedDoc] = React.useState<string>("");
  const [doc, setDoc] = React.useState<string>(serverContent.toString());

  const onUpdate = React.useCallback(
    (message: Types.Message) => {
      setLastReceivedDoc(message.data);
      if (message.data === doc) return;
      setDoc(message.data);
    },
    [doc]
  );

  React.useEffect(() => {
    return hookOnToListener(onUpdate);
  }, [onUpdate]);

  useEffect(() => {
    if (!ably) return;

    if (!channel.current) {
      const _channel = ably.channels.get(`doc:${file.key}`);
      _channel.setOptions({
        params: {
          delta: "vcdiff",
        },
      });
      _channel.subscribe((...args) => {
        listener?.(...args);
      });

      updateDocNow.current = {
        run: (latestDoc: string) => {
          saveFile(file, latestDoc).catch(console.error);

          _channel.publish("update", latestDoc).catch(console.error);
        },
      };
      updateDocSoon.current = {
        run: throttle(updateDocNow.current.run, 200),
      };
      setUpdateLocalDoc({
        run: (newLocalDoc: string) => {
          setDoc(newLocalDoc);
          updateDocSoon.current.run(newLocalDoc);
        },
      });

      channel.current = _channel;
    }

    return () => {
      channel.current?.unsubscribe();
    };
  }, [ably, file, file.key, updateDocSoon]); // Only run the client

  return {
    doc,
    updateDoc: updateLocalDoc.run,
    updateDocNow: updateDocNow.current.run,
    lastReceivedDoc: lastReceivedDoc,
  };
}

export function useDoc(file: NoteFile, serverContent: string, localId: string) {
  const { doc, updateDoc, updateDocNow, lastReceivedDoc } = useLiveDoc(
    file,
    serverContent,
    localId
  );

  const backup = React.useCallback(() => {
    if (doc === lastReceivedDoc) return;
    updateDocNow(doc);
  }, [doc, lastReceivedDoc, updateDocNow]);

  return { doc, updateDoc, backup };
}
