import * as Y from "yjs";
import * as cmState from "@codemirror/state"; // eslint-disable-line
import * as cmView from "@codemirror/view"; // eslint-disable-line
import { YRange } from "./y-range";

export class YSyncConfig {
  private readonly ytext: any;
  private awareness: any;
  private undoManager: Y.UndoManager;
  constructor(ytext, awareness) {
    this.ytext = ytext;
    this.awareness = awareness;
    this.undoManager = new Y.UndoManager(ytext);
  }

  /**
   * Helper function to transform an absolute index position to a Yjs-based relative position
   * (https://docs.yjs.dev/api/relative-positions).
   *
   * A relative position can be transformed back to an absolute position even after the document has changed. The position is
   * automatically adapted. This does not require any position transformations. Relative positions are computed based on
   * the internal Yjs document model. Peers that share content through Yjs are guaranteed that their positions will always
   * synced up when using relatve positions.
   *
   * ```js
   * import { ySyncFacet } from 'y-codemirror'
   *
   * ..
   * const ysync = view.state.facet(ySyncFacet)
   * // transform an absolute index position to a ypos
   * const ypos = ysync.getYPos(3)
   * // transform the ypos back to an absolute position
   * ysync.fromYPos(ypos) // => 3
   * ```
   *
   * It cannot be guaranteed that absolute index positions can be synced up between peers.
   * This might lead to undesired behavior when implementing features that require that all peers see the
   * same marked range (e.g. a comment plugin).
   */
  toYPos(pos: number, assoc: number = 0) {
    return Y.createRelativePositionFromTypeIndex(this.ytext, pos, assoc);
  }

  fromYPos(rpos: Y.RelativePosition | Object) {
    const pos = Y.createAbsolutePositionFromRelativePosition(
      Y.createRelativePositionFromJSON(rpos),
      this.ytext.doc
    );
    if (pos == null || pos.type !== this.ytext) {
      throw new Error(
        "[y-codemirror] The position you want to retrieve was created by a different document"
      );
    }
    return {
      pos: pos.index,
      assoc: pos.assoc,
    };
  }

  toYRange(range: cmState.SelectionRange): YRange {
    const assoc = range.assoc;
    const yanchor = this.toYPos(range.anchor, assoc);
    const yhead = this.toYPos(range.head, assoc);
    return new YRange(yanchor, yhead);
  }

  fromYRange(yrange: YRange) {
    const anchor = this.fromYPos(yrange.yanchor);
    const head = this.fromYPos(yrange.yhead);
    if (anchor.pos === head.pos) {
      return cmState.EditorSelection.cursor(head.pos, head.assoc);
    }
    return cmState.EditorSelection.range(anchor.pos, head.pos);
  }
}

export const ySyncFacet: cmState.Facet<YSyncConfig, YSyncConfig> =
  cmState.Facet.define({
    combine(inputs) {
      return inputs[inputs.length - 1];
    },
  });

export const ySyncAnnotation: cmState.AnnotationType<YSyncConfig> =
  cmState.Annotation.define();

class YSyncPluginValue {
  private view: any;
  private readonly conf: any;
  private _ytext: Y.Text;

  private readonly _observer: (event, tr) => void;

  constructor(view: cmView.EditorView) {
    this.view = view;
    this.conf = view.state.facet(ySyncFacet);

    this._observer = (event, tr: Y.Transaction) => {
      if (tr.origin) {
        // Is null when from local changes
        const delta = event.delta;
        const changes = [];
        let pos = 0;
        for (let i = 0; i < delta.length; i++) {
          const d = delta[i];
          if (d.insert != null) {
            changes.push({ from: pos, to: pos, insert: d.insert });
          } else if (d.delete != null) {
            changes.push({ from: pos, to: pos + d.delete, insert: "" });
            pos += d.delete;
          } else {
            pos += d.retain;
          }
        }
        const newTransaction = {
          changes,
          annotations: [ySyncAnnotation.of(this.conf)],
        };
        view.dispatch(newTransaction);
      }
    };
    this._ytext = this.conf.ytext;
    this._ytext.observe(this._observer);
  }

  update(update: cmView.ViewUpdate) {
    if (
      !update.docChanged ||
      (update.transactions.length > 0 &&
        update.transactions[0].annotation(ySyncAnnotation) === this.conf)
    ) {
      return;
    }
    const ytext = this.conf.ytext;
    ytext.doc.transact(() => {
      /**
       * This variable adjusts the fromA position to the current position in the Y.Text type.
       */
      let adj = 0;
      update.changes.iterChanges((fromA, toA, fromB, toB, insert) => {
        const insertText = insert.sliceString(0, insert.length, "\n");
        if (fromA !== toA) {
          ytext.delete(fromA + adj, toA - fromA);
        }
        if (insertText.length > 0) {
          ytext.insert(fromA + adj, insertText);
        }
        adj += insertText.length - (toA - fromA);
      });
    }, null);
  }

  destroy() {
    this._ytext.unobserve(this._observer);
  }
}

export const ySync = cmView.ViewPlugin.fromClass(YSyncPluginValue);
