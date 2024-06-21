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

export function useDocumentEditor() {
  const { localUser } = useLocalUserContext();
  const { doc } = useFileContext();
  const { collaborationProvider } = useCollaborationContext();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      Typography,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: collaborationProvider,
        user: localUser,
      }),
    ],
  });

  // if (!editor) {
  //   throw new Error("No editor found");
  // }
  return editor;
}