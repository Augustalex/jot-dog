import { useEffect } from "react";

const CHANNEL_NAME = "editors";

import { useState, useCallback } from "react";

import * as Ably from "ably/promises";
import useAblyClient from "./client";

export function usePresence(localId: string) {
  const { ably, clientId } = useAblyClient(localId);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [channel, setChannel] =
    useState<Ably.Types.RealtimeChannelPromise | null>(null);

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
    if (ably === null) return;

    // If not already subscribed to a channel, subscribe
    if (channel === null) {
      const _channel: Ably.Types.RealtimeChannelPromise =
        ably.channels.get(CHANNEL_NAME);
      setChannel(_channel);

      // Note: the 'present' event doesn't always seem to fire
      // so we use presence.get() later to get the initial list of users
      // _channel.presence.subscribe(['present', 'enter', 'leave'], handlePresenceMessage)
      _channel.presence.subscribe(["enter", "leave"], handlePresenceMessage);

      const getExistingMembers = async () => {
        const messages = await _channel.presence.get();
        messages.forEach(handlePresenceMessage);
      };
      getExistingMembers();

      _channel.presence.enter();
    }
  }, [ably, channel, handlePresenceMessage]);

  return {
    onlineUsers,
    userName: clientId,
  };
}
