import { useEffect } from "react";
import * as Y from "yjs";
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { darkTheme } from "./themes/theme";
import { Y_TEXT_KEY } from "./constants";
import { clickableLinkExtensions } from "./extensions/clickable-links";

const styling = EditorView.baseTheme({
  ".cm-scroller": {
    overflowX: "hidden",
  },
});

export function usePreviewEditor(
  yDoc: Y.Doc,
  editorRef: HTMLDivElement | null
) {
  useEffect(() => {
    if (!editorRef) return;

    (async () => {
      const yText = yDoc.getText(Y_TEXT_KEY);

      const state = EditorState.create({
        doc: yText.toString(),
        extensions: [
          basicSetup,
          styling,
          markdown({
            base: markdownLanguage,
          }),
          EditorView.lineWrapping,
          ...clickableLinkExtensions,
          darkTheme,
          EditorState.readOnly.of(true),
        ],
      });
      new EditorView({
        state,
        parent: editorRef,
      });
    })();
  }, [editorRef, yDoc]);
}
