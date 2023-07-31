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

export function yCollab(
  ytext: Y.Text,
  awareness: any,
  { undoManager = new Y.UndoManager(ytext) } = {}
): cmState.Extension {
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
}
