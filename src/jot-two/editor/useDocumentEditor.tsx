import { useEditor } from "@tiptap/react";
import { useFileContext } from "../file/FileContext";
import { useCollaborationContext } from "../presence/CollaborationContext";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import Link from "@tiptap/extension-link";

export function useDocumentEditor() {
  const { localUser } = useLocalUserContext();
  const { doc } = useFileContext();
  const { collaborationProvider } = useCollaborationContext();

  return useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      Typography,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: collaborationProvider,
        user: {
          ...localUser,
          color: localUser.primaryColor,
        },
      }),
    ],
  });
}
