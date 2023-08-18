import { EditorView } from "codemirror";
import {
  Decoration,
  DecorationSet,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";

const linkStyling = EditorView.baseTheme({
  ".cm-clickable-link": {
    color: "#0000EE",
  },
});

const linkMatcher = new MatchDecorator({
  regexp: /(http:\/\/|https:\/\/|www.)(.*)/gi,
  decoration: (match) => {
    const url = match[0];
    return Decoration.mark({
      class: "cm-clickable-link",
      attributes: { "data-url": url },
    });
  },
});

const clickableLinks = ViewPlugin.fromClass(
  class {
    placeholders: DecorationSet;
    constructor(view: EditorView) {
      this.placeholders = linkMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.placeholders = linkMatcher.updateDeco(update, this.placeholders);
    }
  },
  {
    decorations: (instance) => instance.placeholders,
    provide: (plugin) =>
      EditorView.decorations.of((view) => {
        return view.plugin(plugin)?.placeholders || Decoration.none;
      }),
    // provide: (plugin) =>
    //   EditorView.atomicRanges.of((view) => {
    //     return view.plugin(plugin)?.placeholders || Decoration.none;
    //   }),
  }
);

export const clickableLinkExtensions = [clickableLinks, linkStyling];
