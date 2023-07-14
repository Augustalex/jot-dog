import * as Y from "yjs"; // eslint-disable-line
import * as cmState from "@codemirror/state";

import * as cmView from "@codemirror/view";
import { ySyncFacet, ySyncAnnotation } from "./y-sync";
import { YRange } from "./y-range";
import { createMutex } from "lib0/mutex";

export class YUndoManagerConfig {
  undoManager: Y.UndoManager;

  constructor(undoManager) {
    this.undoManager = undoManager;
  }

  /**
   * @param {any} origin
   */
  addTrackedOrigin(origin) {
    this.undoManager.addTrackedOrigin(origin);
  }

  /**
   * @param {any} origin
   */
  removeTrackedOrigin(origin) {
    this.undoManager.removeTrackedOrigin(origin);
  }

  undo(): boolean {
    return this.undoManager.undo() != null;
  }

  redo(): boolean {
    return this.undoManager.redo() != null;
  }
}

export const yUndoManagerFacet: cmState.Facet<
  YUndoManagerConfig,
  YUndoManagerConfig
> = cmState.Facet.define({
  combine(inputs) {
    return inputs[inputs.length - 1];
  },
});

export const yUndoManagerAnnotation: cmState.AnnotationType<YUndoManagerConfig> =
  cmState.Annotation.define();

class YUndoManagerPluginValue {
  private view: cmView.EditorView;
  private conf: any;
  private _undoManager: any;
  private syncConf: any;
  private _beforeChangeSelection: null | YRange;
  private _mux: any;
  private _onStackItemAdded: ({
    stackItem,
    changedParentTypes,
  }: {
    stackItem: any;
    changedParentTypes: any;
  }) => void;
  private _onStackItemPopped: ({ stackItem }: { stackItem: any }) => void;
  private _storeSelection: () => void;

  constructor(view: cmView.EditorView) {
    this.view = view;
    this.conf = view.state.facet(yUndoManagerFacet);
    this._undoManager = this.conf.undoManager;
    this.syncConf = view.state.facet(ySyncFacet);
    this._beforeChangeSelection = null;
    this._mux = createMutex();

    this._onStackItemAdded = ({ stackItem, changedParentTypes }) => {
      // only store metadata if this type was affected
      if (
        changedParentTypes.has(this.syncConf.ytext) &&
        this._beforeChangeSelection &&
        !stackItem.meta.has(this)
      ) {
        // do not overwrite previous stored selection
        stackItem.meta.set(this, this._beforeChangeSelection);
      }
    };
    this._onStackItemPopped = ({ stackItem }) => {
      const sel = stackItem.meta.get(this);
      if (sel) {
        const selection = this.syncConf.fromYRange(sel);
        view.dispatch(view.state.update({ selection }));
        this._storeSelection();
      }
    };
    /**
     * Do this without mutex, simply use the sync annotation
     */
    this._storeSelection = () => {
      // store the selection before the change is applied so we can restore it with the undo manager.
      this._beforeChangeSelection = this.syncConf.toYRange(
        this.view.state.selection.main
      );
    };
    this._undoManager.on("stack-item-added", this._onStackItemAdded);
    this._undoManager.on("stack-item-popped", this._onStackItemPopped);
    this._undoManager.addTrackedOrigin(this.syncConf);
  }

  update(update: cmView.ViewUpdate) {
    if (
      update.selectionSet &&
      (update.transactions.length === 0 ||
        update.transactions[0].annotation(ySyncAnnotation) !== this.syncConf)
    ) {
      // This only works when YUndoManagerPlugin is included before the sync plugin
      this._storeSelection();
    }
  }

  destroy() {
    this._undoManager.off("stack-item-added", this._onStackItemAdded);
    this._undoManager.off("stack-item-popped", this._onStackItemPopped);
    this._undoManager.removeTrackedOrigin(this.syncConf);
  }
}
export const yUndoManager = cmView.ViewPlugin.fromClass(
  YUndoManagerPluginValue
);

export const undo: cmState.StateCommand = ({ state, dispatch }) =>
  state.facet(yUndoManagerFacet).undo() || true;

export const redo: cmState.StateCommand = ({ state, dispatch }) =>
  state.facet(yUndoManagerFacet).redo() || true;

export const undoDepth: (s: cmState.EditorState) => number = (state) =>
  state.facet(yUndoManagerFacet).undoManager.undoStack.length;

export const redoDepth: (s: cmState.EditorState) => number = (state) =>
  state.facet(yUndoManagerFacet).undoManager.redoStack.length;

/**
 * Default key bindigs for the undo manager.
 */
export const yUndoManagerKeymap: Array<cmView.KeyBinding> = [
  { key: "Mod-z", run: undo, preventDefault: true },
  { key: "Mod-y", mac: "Mod-Shift-z", run: redo, preventDefault: true },
  { key: "Mod-Shift-z", run: redo, preventDefault: true },
];
