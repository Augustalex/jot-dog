import * as Y from "yjs"; // eslint-disable-line
import * as cmView from "@codemirror/view";
import * as cmState from "@codemirror/state"; // eslint-disable-line
import { YRange } from "./y-range";
import { ySync, ySyncFacet, YSyncConfig } from "./y-sync";
import {
  yRemoteSelections,
  yRemoteSelectionsTheme,
} from "./y-remote-selections";
import {
  yUndoManager,
  yUndoManagerFacet,
  YUndoManagerConfig,
  undo,
  redo,
  yUndoManagerKeymap,
} from "./y-undomanager";

export {
  YRange,
  yRemoteSelections,
  yRemoteSelectionsTheme,
  ySync,
  ySyncFacet,
  YSyncConfig,
  yUndoManagerKeymap,
};

/**
 * @param {Y.Text} ytext
 * @param {any} awareness
 * @param {Object} [opts]
 * @param {Y.UndoManager | false} [opts.undoManager] Set undoManager to false to disable the undo-redo plugin
 * @return {cmState.Extension}
 */
export const yCollab = (
  ytext,
  awareness,
  { undoManager = new Y.UndoManager(ytext) } = {}
) => {
  const ySyncConfig = new YSyncConfig(ytext, awareness);
  const plugins = [ySyncFacet.of(ySyncConfig), ySync];
  if (awareness) {
    plugins.push(yRemoteSelectionsTheme, yRemoteSelections);
  }
  if (Boolean(undoManager) !== false) {
    // By default, only track changes that are produced by the sync plugin (local edits)
    plugins.push(
      yUndoManagerFacet.of(new YUndoManagerConfig(undoManager)),
      yUndoManager,
      cmView.EditorView.domEventHandlers({
        beforeinput(e, view) {
          if (e.inputType === "historyUndo") return undo(view);
          if (e.inputType === "historyRedo") return redo(view);
          return false;
        },
      })
    );
  }
  return plugins;
};
