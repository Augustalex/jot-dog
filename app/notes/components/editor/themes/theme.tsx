import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

// Color system
const hidden = "#00000000";
const bg = "#222222",
  text = "#ffffff",
  link = text,
  base02 = "#B9D2FF",
  base03 = "#b0b0b0",
  base04 = "#d0d0d0",
  base05 = "#e0e0e0",
  // textWeak = "#9e9ea2", // gutter text
  textWeak = "#b2b2b2", // gutter text
  textWeaker = "#7a7a7a", // gutter text
  textDiscreet = "#474747", // gutter text
  positive = "#56b680",
  base07 = "#000000",
  base08 = "#A54543",
  base09 = "#fc6d24",
  base0A = "#fda331",
  base0B = "#8abeb7",
  base0C = "#b5bd68",
  base0D = "#6fb3d2",
  base0E = "#cc99cc",
  base0F = "#6987AF";

const border = "#292930";
const surface = "#292930";
const surfaceRaised = "#5a5a6b";
const onSurface = "#ababcc";

// Theme constants
const panelColor = bg;
const gutterTextColor = textDiscreet;

const invalid = base09,
  cursor = text;

/// The editor theme styles for Basic Dark.
export const basicDarkTheme = EditorView.theme(
  {
    "&": {
      color: text,
      backgroundColor: bg,
    },

    ".cm-content": {
      caretColor: cursor,
    },

    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: cursor,
      borderWidth: "2px",
      marginLeft: ".5px",
    },

    ".cm-activeLine": { backgroundColor: surface },
    ".cm-activeLineGutter": {
      backgroundColor: surface,
    },

    // Makes sure highlight sits above text, otherwise it won't be visible
    ".cm-selectionLayer:has(.cm-selectionBackground) ": {
      zIndex: "1 !important",
      pointerEvents: "none",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
      {
        background: onSurface + "42" + " !important",
        backgroundColor: onSurface + "42" + " !important",
      },

    ".cm-panels": { backgroundColor: panelColor, color: base03 },
    ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
    ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

    ".cm-searchMatch": {
      // backgroundColor: base02,
      backgroundColor: "red",
      outline: `1px solid ${base03}`,
      // color: base07,
      color: "red",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      // backgroundColor: base05,
      backgroundColor: "red",
      // color: base07,
      color: "red",
    },
    ".cm-selectionMatch": { backgroundColor: surface },

    // --- Matching brackets: [ ] ( ) { }
    "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
      // outline: `1px solid ${base03}`,
    },
    "&.cm-focused .cm-matchingBracket": {
      // backgroundColor: base02,
      backgroundColor: surfaceRaised,
      // color: base07,
      color: text,
    },
    // ---

    ".cm-gutters": {
      // borderRight: `1px solid #ffffff10`,
      color: gutterTextColor,
      backgroundColor: panelColor,
    },

    ".cm-foldPlaceholder": {
      backgroundColor: "transparent",
      border: "none",
      color: base02,
    },

    ".cm-tooltip": {
      border: "none",
      backgroundColor: text,
    },
    ".cm-tooltip .cm-tooltip-arrow:before": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent",
    },
    ".cm-tooltip .cm-tooltip-arrow:after": {
      borderTopColor: text,
      borderBottomColor: text,
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li[aria-selected]": {
        backgroundColor: surface,
        color: base03,
      },
    },

    // Custom link color
    ".cm-clickable-link": {
      color: link,
      textDecoration: "underline",
    },
  },
  { dark: true }
);

/// The highlighting style for code in the Basic Light theme.

const headingCommonStyles = {
  // fontSize: "1.5em",
  fontWeight: "bold",
  paddingBottom: "0.3em",
  // marginBottom: "1em",
  lineHeight: "2.5em",
  top: "-.18em",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "80vw",
    borderBottom: `2px solid ${border}`,
  },
};
export const basicDarkHighlightStyle = HighlightStyle.define([
  { tag: [t.string], color: base0C },
  { tag: t.keyword, color: base0A },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: base0C,
  },
  { tag: [t.variableName], color: base0D },
  { tag: [t.function(t.variableName)], color: base0A },
  { tag: [t.labelName], color: base09 },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: base0A,
  },
  { tag: [t.definition(t.name), t.separator], color: base0E },
  { tag: [t.brace], color: base0E },
  {
    tag: [t.annotation],
    color: invalid,
  },
  {
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: base0A,
  },
  {
    tag: [t.typeName, t.className],
    color: base0D,
  },
  {
    tag: [t.operator, t.operatorKeyword],
    color: base0E,
  },
  {
    tag: [t.tagName],
    color: base0A,
  },
  {
    tag: [t.squareBracket],
    color: base0E,
  },
  {
    tag: [t.angleBracket],
    color: base0E,
  },
  {
    tag: [t.attributeName],
    color: base0D,
  },
  {
    tag: [t.regexp],
    color: base0A,
  },
  {
    tag: [t.quote],
    color: text,
  },
  {
    // Dash lists, numbered lists etc.
    tag: [t.processingInstruction],
    color: textWeak,
  },
  {
    tag: t.link,
    color: positive,
    textDecoration: "underline",
    textUnderlinePosition: "under",
  },
  {
    tag: [t.url, t.escape, t.special(t.string)],
    color: base0B,
  },
  { tag: [t.meta], color: "yellow" },
  { tag: [t.comment], color: textWeak, fontStyle: "italic" },
  { tag: t.monospace, color: text },
  { tag: t.strong, fontWeight: "bold", color: base0A },
  { tag: t.emphasis, fontStyle: "italic", color: base0D },
  { tag: t.strikethrough, textDecoration: "line-through" },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: base0B },
  // {
  //   tag: [t.list],
  //   color: "red",
  // },
  {
    // Dash lists, numbered lists etc.
    tag: [t.inserted],
    color: "red",
  },
  // {
  //   // Dash lists, numbered lists etc.
  //   tag: [t.processingInstruction, t.inserted],
  //   color: "red",
  // },
  // {
  //   tag: [t.contentSeparator],
  //   color: textWeak,
  // },
  { tag: t.invalid, color: base02, borderBottom: `1px dotted ${invalid}` },
  // { tag: t.heading, fontWeight: "bold" },

  {
    tag: t.heading2,
    fontSize: "2em",
    ...headingCommonStyles,
  },
  {
    tag: t.heading3,
    fontSize: "1.5em",
    ...headingCommonStyles,
  },
  {
    tag: t.heading4,
    fontSize: "1.25em",
    ...headingCommonStyles,
  },
  {
    tag: t.heading5,
    fontSize: "1em",
    ...headingCommonStyles,
  },
  {
    tag: t.heading6,
    fontSize: ".85em",
    ...headingCommonStyles,
    color: textWeaker,
  },

  // Useful after fixing so that = and - doesn't result in a 1 or 2 heading.
  // {
  //   tag: t.heading1,
  //   fontSize: "2em",
  //   ...headingCommonStyles,
  // },
  // {
  //   tag: t.heading2,
  //   fontSize: "1.5em",
  //   ...headingCommonStyles,
  // },
  // {
  //   tag: t.heading3,
  //   fontSize: "1.25em",
  //   ...headingCommonStyles,
  // },
  // {
  //   tag: t.heading4,
  //   fontSize: "1em",
  //   ...headingCommonStyles,
  // },
  // {
  //   tag: t.heading5,
  //   fontSize: ".875em",
  //   ...headingCommonStyles,
  // },
  // {
  //   tag: t.heading6,
  //   fontSize: ".85em",
  //   ...headingCommonStyles,
  //   color: textWeaker,
  // },
]);

/// Extension to enable the Basic Dark theme (both the editor theme and
/// the highlight style).
export const myTheme: Extension = [
  basicDarkTheme,
  syntaxHighlighting(basicDarkHighlightStyle),
];
