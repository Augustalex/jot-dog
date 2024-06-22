import "./styles.scss";
import { useEffect, useState } from "react";
import { useCollaborationContext } from "./CollaborationContext";
import {
  PresenceUser,
  useDocumentEditorContext,
} from "../editor/DocumentEditorProvider";
import { WebSocketStatus } from "@hocuspocus/provider";
import { PresenceAvatar } from "./PresenceAvatar";
import { useLocalUserContext } from "../local-user/LocalUserContext";

export function PresenceRow() {
  const { collaborationProvider } = useCollaborationContext();
  const [status, setStatus] = useState<WebSocketStatus>(
    WebSocketStatus.Disconnected
  );
  const { editor } = useDocumentEditorContext();

  useEffect(() => {
    setStatus(collaborationProvider.status);
    collaborationProvider.on("status", (event: any) => {
      setStatus(event.status);
    });
  }, [collaborationProvider, editor]);

  return (
    <div className="presence">
      {status === "connected" && (
        <AvatarRow users={editor.storage.collaborationCursor.users} />
      )}
      {status !== "connected" && (
        <div className={`presence__status presence__status--${status}`}>
          Offline
        </div>
      )}
    </div>
  );
}

function AvatarRow({ users }: { users: PresenceUser[] }) {
  const { localUser } = useLocalUserContext();
  return (
    <div className="flex space-x-1 relative">
      {users.map((user, index) => (
        <PresenceAvatar
          key={index}
          user={user}
          isLocalUser={localUser.name === user.name}
        />
      ))}
    </div>
  );
}
