import { useEffect } from "react";
import * as Y from "yjs";
import { basicSetup, EditorView } from "codemirror";
import {
  Decoration,
  DecorationSet,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { myTheme } from "./themes/theme";
import { Y_TEXT_KEY } from "./constants";

const assistTheme = EditorView.baseTheme({
  ".cm-clickable-link": {
    color: "#0000EE",
  },
  ".cm-scroller": {
    overflowX: "hidden",
  },
});

const placeholderMatcher = new MatchDecorator({
  regexp: /(http:\/\/|https:\/\/|www.)(.*)/gi,
  decoration: (match) => {
    const url = match[0];
    return Decoration.mark({
      class: "cm-clickable-link",
      attributes: { "data-url": url },
    });
  },
});

const placeholders = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet;
    constructor(view: EditorView) {
      this.placeholders = placeholderMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.placeholders = placeholderMatcher.updateDeco(
        update,
        this.placeholders
      );
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.decorations.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
  }
);

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
          assistTheme,
          markdown({
            base: markdownLanguage,
          }),
          EditorView.lineWrapping,
          placeholders,
          myTheme,
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
