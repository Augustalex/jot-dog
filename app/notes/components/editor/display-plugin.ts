import {
  ViewPlugin,
  EditorView,
  WidgetType,
  Decoration,
} from "@codemirror/view";
import { Annotation, RangeSet, RangeValue } from "@codemirror/state";
import { setupLiveRanges } from "../../../ably/imperative-ranges";

export const liveRangesUpdater = ({
  liveRangesClient,
}: {
  liveRangesClient: ReturnType<typeof setupLiveRanges>;
}) =>
  EditorView.updateListener.of((viewUpdate) => {
    if (viewUpdate.selectionSet) {
      const selection = viewUpdate.state.selection.ranges[0];
      const { anchor, head } = selection;
      const presence = { s: anchor, e: head };
      liveRangesClient.updateLiveRange(presence);
    }
  });

export const liveRangesRenderer = ({
  localId,
  liveRangesClient,
}: {
  localId: string;
  liveRangesClient: ReturnType<typeof setupLiveRanges>;
}) => [
  ViewPlugin.fromClass(
    class {
      decorations: RangeSet<RangeValue>;

      constructor(view) {
        // Initialize decorations to empty array so CodeMirror doesn't crash.
        this.decorations = RangeSet.of([]);

        const presenceState = new Map<
          string,
          { id: string; start: number; end: number }
        >();

        liveRangesClient.onUpdate((allRanges) => {
          const ranges = allRanges.filter((r) => r.id !== localId);
          const ids = ranges.map((r) => r.id);
          for (let key of Array.from(presenceState.keys())) {
            if (!ids.includes(key)) presenceState.delete(key);
          }
          for (let range of ranges) {
            presenceState.set(range.id, {
              id: range.id,
              start: range.s,
              end: range.e,
            });
          }

          const decorations = Array.from(presenceState.values()).flatMap(
            ({ start, end, id }) => {
              return [
                {
                  from: Math.min(start, end),
                  to: Math.max(end, start),
                  value: Decoration.mark({
                    class: "my-marker",
                  }),
                },
                {
                  from: end,
                  to: end,
                  value: Decoration.widget({
                    widget: new PresenceWidget(id),
                    side: -1,
                    block: false,
                  }),
                },
              ];
            }
          );

          this.decorations = Decoration.set(
            decorations,
            // Without this argument, we get the following error:
            // Uncaught Error: Ranges must be added sorted by `from` position and `startSide`
            true
          );

          // Somehow this triggers re-rendering of the Decorations.
          // Not sure if this is the correct usage of the API.
          // Inspired by https://github.com/yjs/y-codemirror.next/blob/main/src/y-remote-selections.js
          // Set timeout so that the current CodeMirror update finishes
          // before the next ones that render presence begin.
          setTimeout(() => {
            view.dispatch({ annotations: [presenceAnnotation.of(true)] });
          }, 0);
        });
      }
    },
    {
      // @ts-ignore
      decorations: (v) => {
        return v.decorations;
      },
    }
  ),
  presenceTheme,
];

const presenceAnnotation = Annotation.define();

// Displays a single remote presence cursor.
class PresenceWidget extends WidgetType {
  private id: string;

  constructor(id) {
    super();
    this.id = id;
  }

  eq(other) {
    return other.id === this.id;
  }

  toDOM() {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.className = "cm-json1-presence";

    // This child is what actually displays the presence.
    // Nested so that the layout is not impacted.
    //
    // The initial attempt using the top level span to render
    // the cursor caused a wonky layout with adjacent characters shifting
    // left and right by 1 pixel or so.
    span.appendChild(document.createElement("div"));
    return span;
  }

  ignoreEvent() {
    return false;
  }
}

const presenceTheme = EditorView.baseTheme({
  ".my-marker": {
    background: "tomato",
  },
  ".cm-json1-presence": {
    position: "relative",
  },
  ".cm-json1-presence > div": {
    position: "absolute",
    top: "-2px",
    bottom: "-2px",
    left: "0",
    right: "0",
    borderLeft: "2px solid darkred",
    animation: "blink 1.2s steps(2, start) infinite",
  },
});
