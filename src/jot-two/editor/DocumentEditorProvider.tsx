import { Editor } from "@tiptap/react";
import { createContext, ReactNode, useContext } from "react";
import { LocalUser } from "../local-user/LocalUserContext";
import { useDocumentEditor } from "./useDocumentEditor";

export type PresenceUser = LocalUser & { clientId: number };

const DocumentEditorContext = createContext<{
  editor: Editor;
} | null>(null);

export function useOptionalDocumentEditorContext() {
  return useContext(DocumentEditorContext);
}

export function useDocumentEditorContext() {
  const context = useContext(DocumentEditorContext);
  if (!context) {
    throw new Error(
      "useDocumentEditorContext must be used within a DocumentEditorProvider"
    );
  }

  return context;
}

export function DocumentEditorProvider({ children }: { children: ReactNode }) {
  const editor = useDocumentEditor();

  if (!editor) return null;

  return (
    <DocumentEditorContext.Provider value={{ editor }}>
      {children}
    </DocumentEditorContext.Provider>
  );
}
