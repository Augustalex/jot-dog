import { useEffect } from "react";
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { darkTheme } from "./themes/theme";
import { clickableLinkExtensions } from "./extensions/clickable-links";

const styling = EditorView.baseTheme({
  ".cm-scroller": {
    overflowX: "hidden",
  },
});

export function usePreviewEditor(
  text: string,
  editorRef: HTMLDivElement | null
) {
  useEffect(() => {
    if (!editorRef) return;

    (async () => {
      const state = EditorState.create({
        doc: text,
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
  }, [editorRef, text]);
}
