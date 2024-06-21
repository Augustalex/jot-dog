import { useEffect, useState } from "react";
import * as Y from "yjs";
import { basicSetup, EditorView } from "codemirror";
import { keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { useAblyClient } from "../ably/client";
import { yCollab, yUndoManagerKeymap } from "./y-collab";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { indentWithTab } from "@codemirror/commands";
import { NoteFile } from "../../utils/file-utils";
import { darkTheme } from "../editor/themes/theme";
import { Y_TEXT_KEY } from "../editor/constants";
import { clickableLinkExtensions } from "../editor/extensions/clickable-links";
import { userColor } from "./awareness-colors";
import { CollaborationProvider } from "./collaboration-provider";
import { languages } from "@codemirror/language-data";

export function useCollaborativeEditor(
  localId: string,
  file: NoteFile,
  editorRef: HTMLDivElement | null,
  serverContent: Uint8Array,
  persist: (data: Uint8Array) => Promise<void>,
  gotoTitle: string | undefined
) {
  const [yDoc, setYDoc] = useState(null);
  const { ably } = useAblyClient(localId);

  useEffect(() => {
    if (!ably.get()) return;
    if (!editorRef) return;
    if (yDoc) return;

    (async () => {
      const yDoc = new Y.Doc();
      setYDoc(yDoc);

      const yText = yDoc.getText(Y_TEXT_KEY);

      const provider = CollaborationProvider({
        ably: ably.get(),
        yDoc,
        initialData: serverContent,
        persist,
        file,
      });
      provider.awareness.setLocalStateField("user", {
        name: localId,
        color: userColor.color,
        colorLight: userColor.light,
      });

      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          keymap.of([...yUndoManagerKeymap, indentWithTab]),
          basicSetup,
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
            extensions: [
              {
                remove: ["SetextHeading"],
              },
            ],
          }),
          EditorView.lineWrapping,
          ...clickableLinkExtensions,
          yCollab(yText, provider.awareness),
          darkTheme,
        ],
      });
      const view = new EditorView({
        state,
        parent: editorRef,
      });

      if (gotoTitle) {
        view.focus();

        const searchString = `## ${gotoTitle}`;
        const lineOfText = view.state.doc
          .toString()
          .split("\n")
          .findIndex((l) => l === searchString);
        const line = view.state.doc.line(lineOfText + 1);
        view.dispatch({
          selection: {
            anchor: line.from,
            head: line.to,
          },
          effects: EditorView.scrollIntoView(line.from, {
            y: "center",
          }),
        });
      }

      window.addEventListener("click", (e) => {
        if (triggersSpecialMode(e) && e.target) {
          // @ts-ignore
          const activeLine = e.target?.closest?.(".cm-activeLine");

          if (activeLine) {
            const domElement = view.domAtPos(view.state.selection.main.head);
            const url =
              // @ts-ignore
              domElement?.node?.cmView?.parent?.mark?.attrs?.["data-url"];

            if (url) {
              window.open(url, "_blank");
            }
          }
        }
      });
      window.addEventListener("keydown", (e) => {
        if (triggersSpecialMode(e)) document.body.classList.add("ctrl");
        else document.body.classList.remove("ctrl");
      });
      window.addEventListener("keyup", (e) => {
        if (triggersSpecialMode(e)) document.body.classList.add("ctrl");
        else document.body.classList.remove("ctrl");
      });
    })();
  }, [ably, editorRef, file, persist, serverContent, yDoc]);

  return {
    ready: yDoc !== null,
    yDoc,
  };
}

function triggersSpecialMode(e: any) {
  return e.ctrlKey || e.metaKey || e.altKey || e.shiftKey;
}
