import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import { useFileContext } from "../file/FileContext";
import { useOptionalDocumentEditorContext } from "../editor/DocumentEditorProvider";

const CollaborationContext = createContext<{
  collaborationProvider: TiptapCollabProvider;
} | null>(null);

export function useCollaborationContext() {
  const context = useContext(CollaborationContext);
  if (!context)
    throw new Error(
      "useCollaborationContext must be used within a CollaborationProvider"
    );

  return context;
}

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const { file, doc } = useFileContext();
  const editorContext = useOptionalDocumentEditorContext();

  const onSynced = useCallback(() => {
    if (!doc.getMap("config").get("initialContentLoaded") && editorContext) {
      doc.getMap("config").set("initialContentLoaded", true);

      editorContext.editor.commands.setContent(`
        <p>
          This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
        </p>
        <p>
          The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
        </p>
        `);
    }
  }, [doc, editorContext]);

  const [provider] = useState<TiptapCollabProvider>(
    new TiptapCollabProvider({
      appId: "7j9y6m10",
      name: file.key,
      document: doc,

      baseUrl:
        window.location.hostname === "localhost"
          ? "ws://localhost:1234"
          : "wss://live.jot.dog:443",
      // baseUrl: "ws://37.27.16.141:80",
      // baseUrl: "http://localhost:1234",
      // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content insertion on editor syncs.
      onSynced,
    })
  );

  return (
    <CollaborationContext.Provider value={{ collaborationProvider: provider }}>
      {children}
    </CollaborationContext.Provider>
  );
}
