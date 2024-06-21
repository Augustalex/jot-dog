import { TiptapCollabProvider } from "@hocuspocus/provider";
import { useCallback, useState } from "react";
import * as Y from "yjs";
import { useCurrentEditor } from "@tiptap/react";

export function useCollaborationProvider(doc: Y.Doc): TiptapCollabProvider {
  const room = "room.11";
  const { editor } = useCurrentEditor();

  const onSynced = useCallback(() => {
    if (!doc.getMap("config").get("initialContentLoaded") && editor) {
      doc.getMap("config").set("initialContentLoaded", true);

      editor.commands.setContent(`
        <p>
          This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
        </p>
        <p>
          The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
        </p>
        `);
    }
  }, [doc, editor]);

  const [provider] = useState<TiptapCollabProvider>(
    new TiptapCollabProvider({
      appId: "7j9y6m10",
      name: room,
      document: doc,
      baseUrl: "http://localhost:1234",

      // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content insertion on editor syncs.
      onSynced,
    })
  );

  return provider;
}
