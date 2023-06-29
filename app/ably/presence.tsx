import { useEffect, useState, useCallback, useRef } from "react";
import * as Ably from "ably/promises";
import { useAblyClient } from "./client";
import { NoteFile } from "../notes/utils/file-utils";

export function usePresence(file: NoteFile, localId: string) {
  const { ably: ablyRef, clientId } = useAblyClient(localId);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const channel = useRef<Ably.Types.RealtimeChannelPromise | null>(null);

  const handlePresenceMessage = useCallback(
    (message: Ably.Types.PresenceMessage) => {
      if (message.action === "enter" || message.action === "present") {
        setOnlineUsers((prev) => {
          if (prev.includes(message.clientId) === false) {
            return [...prev, message.clientId];
          } else {
            return prev;
          }
        });
      } else {
        // user has left
        setOnlineUsers((prev) =>
          prev.filter((username) => {
            return username !== message.clientId;
          })
        );
      }
    },
    []
  );

  useEffect(() => {
    if (ablyRef.get() === null) return;
    if (channel.current) return;

    const _channel = ablyRef.get().channels.get(`editors:${file.key}`);
    _channel.presence.subscribe(["enter", "leave"], handlePresenceMessage);

    const getExistingMembers = async () => {
      const messages = await _channel.presence.get();
      messages.forEach(handlePresenceMessage);
    };
    getExistingMembers().catch(console.error);
    _channel.presence.enter().catch(console.error);

    channel.current = _channel;
  }, [ablyRef, channel, file.key, handlePresenceMessage]);

  return {
    onlineUsers,
    userName: clientId,
  };
}
