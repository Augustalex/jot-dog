import * as cmView from "@codemirror/view";

import * as cmState from "@codemirror/state";
import * as dom from "lib0/dom";
import * as pair from "lib0/pair";
import * as math from "lib0/math";

import * as Y from "yjs";
import { ySyncFacet } from "./y-sync";

export const yRemoteSelectionsTheme = cmView.EditorView.baseTheme({
  ".cm-ySelection": {},
  ".cm-yLineSelection": {
    padding: 0,
    margin: "0px 2px 0px 4px",
  },
  ".cm-ySelectionCaret": {
    position: "relative",
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    marginLeft: "-1px",
    marginRight: "-1px",
    boxSizing: "border-box",
    display: "inline",
  },
  ".cm-ySelectionCaretDot": {
    borderRadius: "50%",
    position: "absolute",
    width: ".4em",
    height: ".4em",
    top: "-.2em",
    left: "-.2em",
    backgroundColor: "inherit",
    transition: "transform .3s ease-in-out",
    boxSizing: "border-box",
  },
  ".cm-ySelectionCaret:hover > .cm-ySelectionCaretDot": {
    transformOrigin: "bottom center",
    transform: "scale(0)",
  },
  ".cm-ySelectionInfo": {
    position: "absolute",
    top: "-1.05em",
    left: "-1px",
    fontSize: ".75em",
    fontFamily: "serif",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "normal",
    userSelect: "none",
    color: "white",
    paddingLeft: "2px",
    paddingRight: "2px",
    zIndex: 101,
    transition: "opacity .3s ease-in-out",
    backgroundColor: "inherit",
    // these should be separate
    opacity: 0,
    transitionDelay: "0s",
    whiteSpace: "nowrap",
  },
  ".cm-ySelectionCaret:hover > .cm-ySelectionInfo": {
    opacity: 1,
    transitionDelay: "0s",
  },
});

/**
 * @todo specify the users that actually changed. Currently, we recalculate positions for every user.
 */
const yRemoteSelectionsAnnotation: cmState.AnnotationType<Array<number>> =
  cmState.Annotation.define();

class YRemoteCaretWidget extends cmView.WidgetType {
  private readonly color: string;
  private readonly name: string;

  constructor(color: string, name: string) {
    super();
    this.color = color;
    this.name = name;
  }

  toDOM(): HTMLElement {
    return dom.element(
      "span",
      [
        pair.create("class", "cm-ySelectionCaret"),
        pair.create(
          "style",
          `background-color: ${this.color}; border-color: ${this.color}`
        ),
      ],
      [
        dom.text("\u2060"),
        dom.element("div", [pair.create("class", "cm-ySelectionCaretDot")]),
        dom.text("\u2060"),
        dom.element(
          "div",
          [pair.create("class", "cm-ySelectionInfo")],
          [dom.text(this.name)]
        ),
        dom.text("\u2060"),
      ]
    ) as HTMLElement;
  }

  eq(widget: any) {
    return widget.color === this.color;
  }

  compare(widget: any) {
    return widget.color === this.color;
  }

  updateDOM() {
    return false;
  }

  get estimatedHeight() {
    return -1;
  }

  ignoreEvent() {
    return true;
  }
}

export class YRemoteSelectionsPluginValue {
  private conf: any;
  private readonly _listener: any;
  private _awareness: any;

  decorations: cmState.RangeSet<cmView.Decoration>;

  constructor(view: cmView.EditorView) {
    this.conf = view.state.facet(ySyncFacet);
    this._listener = (
      {
        added,
        updated,
        removed,
      }: {
        added: any[];
        updated: any[];
        removed: any[];
      },
      s: any,
      t: any
    ) => {
      const clients = added.concat(updated).concat(removed);
      const someoneRemoteHasBeenChanged =
        clients.findIndex((id) => id !== this.conf.awareness.doc.clientID) >= 0;
      if (someoneRemoteHasBeenChanged) {
        view.dispatch({ annotations: [yRemoteSelectionsAnnotation.of([])] });
      }
    };
    this._awareness = this.conf.awareness;
    this._awareness.on("change", this._listener);
    this.decorations = cmState.RangeSet.of([]);
  }

  destroy() {
    this._awareness.off("change", this._listener);
  }

  update(update: cmView.ViewUpdate) {
    const ytext = this.conf.ytext;
    const ydoc: Y.Doc = ytext.doc;
    const awareness = this.conf.awareness;
    const decorations: Array<cmState.Range<cmView.Decoration>> = [];
    const localAwarenessState = this.conf.awareness.getLocalState();

    // set local awareness state (update cursors)
    if (localAwarenessState != null) {
      const hasFocus =
        update.view.hasFocus && update.view.dom.ownerDocument.hasFocus();
      const sel = hasFocus ? update.state.selection.main : null;
      const currentAnchor =
        localAwarenessState.cursor == null
          ? null
          : localAwarenessState.cursor.anchor;
      const currentHead =
        localAwarenessState.cursor == null
          ? null
          : localAwarenessState.cursor.head;

      if (sel != null) {
        const anchor = Y.createRelativePositionFromTypeIndex(ytext, sel.anchor);
        const head = Y.createRelativePositionFromTypeIndex(ytext, sel.head);

        if (
          localAwarenessState.cursor == null ||
          !Y.compareRelativePositions(currentAnchor, anchor) ||
          !Y.compareRelativePositions(currentHead, head)
        ) {
          awareness.setLocalStateField("cursor", {
            anchor,
            head,
          });
        }
      } else if (localAwarenessState.cursor != null && hasFocus) {
        awareness.setLocalStateField("cursor", null);
      }
    }

    // update decorations (remote selections)
    const remoteStates = awareness.getStates();
    remoteStates.forEach((state: any) => {
      const cursor = state.cursor;
      const local = state.user.name === localAwarenessState.user.name;
      if (
        cursor == null ||
        cursor.anchor == null ||
        cursor.head == null ||
        local
      ) {
        return;
      }

      const anchor = Y.createAbsolutePositionFromRelativePosition(
        cursor.anchor,
        ydoc
      );
      const head = Y.createAbsolutePositionFromRelativePosition(
        cursor.head,
        ydoc
      );
      if (
        anchor == null ||
        head == null ||
        anchor.type !== ytext ||
        head.type !== ytext
      ) {
        return;
      }
      const { color = "#30bced", name = "Anonymous" } = state.user || {};
      const colorLight = (state.user && state.user.colorLight) || color + "33";
      const start = math.min(anchor.index, head.index);
      const end = math.max(anchor.index, head.index);
      const startLine = update.view.state.doc.lineAt(start);
      const endLine = update.view.state.doc.lineAt(end);
      if (startLine.number === endLine.number) {
        // selected content in a single line.
        decorations.push({
          from: start,
          to: end,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection",
          }),
        });
      } else {
        // selected content in multiple lines
        // first, render text-selection in the first line
        decorations.push({
          from: start,
          to: startLine.from + startLine.length,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection",
          }),
        });
        // render text-selection in the last line
        decorations.push({
          from: endLine.from,
          to: end,
          value: cmView.Decoration.mark({
            attributes: { style: `background-color: ${colorLight}` },
            class: "cm-ySelection",
          }),
        });
        for (let i = startLine.number + 1; i < endLine.number; i++) {
          const linePos = update.view.state.doc.line(i).from;
          decorations.push({
            from: linePos,
            to: linePos,
            value: cmView.Decoration.line({
              attributes: {
                style: `background-color: ${colorLight}`,
                class: "cm-yLineSelection",
              },
            }),
          });
        }
      }
      decorations.push({
        from: head.index,
        to: head.index,
        value: cmView.Decoration.widget({
          side: head.index - anchor.index > 0 ? -1 : 1, // the local cursor should be rendered outside the remote selection
          block: false,
          widget: new YRemoteCaretWidget(color, name),
        }),
      });
    });
    this.decorations = cmView.Decoration.set(decorations, true);
  }
}

export const yRemoteSelections = cmView.ViewPlugin.fromClass(
  YRemoteSelectionsPluginValue,
  {
    decorations: (v) => v.decorations,
  }
);
