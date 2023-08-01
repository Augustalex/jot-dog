import * as Y from "yjs";

/**
 * Defines a range on text using relative positions that can be transformed back to
 * absolute positions. (https://docs.yjs.dev/api/relative-positions)
 */
export class YRange {
  yanchor: Y.RelativePosition;
  yhead: Y.RelativePosition;

  constructor(yanchor: Y.RelativePosition, yhead: Y.RelativePosition) {
    this.yanchor = yanchor;
    this.yhead = yhead;
  }

  toJSON() {
    return {
      yanchor: Y.relativePositionToJSON(this.yanchor),
      yhead: Y.relativePositionToJSON(this.yhead),
    };
  }

  static fromJSON(json: any): YRange {
    return new YRange(
      Y.createRelativePositionFromJSON(json.yanchor),
      Y.createRelativePositionFromJSON(json.yhead)
    );
  }
}
