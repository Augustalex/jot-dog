import "./styles.scss";
import { useEffect, useState } from "react";
import { useCollaborationContext } from "./CollaborationContext";
import {
  PresenceUser,
  useDocumentEditorContext,
} from "../editor/DocumentEditorProvider";
import { WebSocketStatus } from "@hocuspocus/provider";
import { Avatar } from "./Avatar";

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
  return (
    <div className="flex -space-x-4 relative">
      {users.map((user, index) => (
        <Avatar key={index} user={user} />
      ))}
    </div>
  );
}
