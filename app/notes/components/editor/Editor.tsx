"use client";

import styles from "./editor.module.css";
import React, { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useSelectedContent } from "../../db/hooks/useSelectedContent";
import { EditorConfig } from "../../db/editor";
import { useLocalEditorState, ViewMode } from "../hooks/useLocalEditorState";
import { EditorView } from "@codemirror/view";
import { RevealMain } from "../reveal/RevealMain";
import { useRevealDeck } from "../reveal/useReveal";
import { Section, Slides } from "../reveal";

let myTheme = EditorView.theme(
  {
    "&.cm-editor.cm-focused": { outline: "0" },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "var(--color-highlight)",
      borderWidth: "3px",
    },
  },
  { dark: false }
);
const extensions = [markdown({}), myTheme];

export function Editor({ editorConfig }: { editorConfig: EditorConfig }) {
  const editorStore = useLocalEditorState(editorConfig.selectedFile);

  if (editorStore.viewMode !== ViewMode.Editor) return null;
  return <EditorUI editorConfig={editorConfig} />;
}

function EditorUI({ editorConfig }: { editorConfig: EditorConfig }) {
  const content = useSelectedContent().data;
  const { scheduleSave, setUnsavedContent, fontSize } = useLocalEditorState(
    editorConfig.selectedFile
  );
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );

  return (
    <div
      ref={(newRef) => setEditorWindow(newRef)}
      className={styles.editorWindow}
      style={{
        fontSize: fontSize + "px",
        width: "100%",
        height: "100%",
        flex: "1 0 100%",
      }}
    >
      <CodeMirror
        value={content}
        height={editorWindow?.offsetHeight + "px"}
        extensions={extensions}
        onChange={async (newContent) => {
          setUnsavedContent(newContent);
          await scheduleSave(newContent);
        }}
        placeholder={"Make a note..."}
        autoFocus
      />
    </div>
  );
}

function First() {
  const [Deck, { progress }] = useRevealDeck();

  const handleClick = useCallback(() => {
    if (Deck) Deck.right();
  }, [Deck]);

  return (
    <>
      <h1>First Reveal.js</h1>
      <h3>The HTML Presentation Framework</h3>
      <p>
        <small>
          Created by <a href="http://hakim.se">Hakim El Hattab</a> /{" "}
          <a href="http://twitter.com/hakimel">@hakimel</a>
        </small>
        <button onClick={handleClick}>PASSAR ({progress})</button>
      </p>
    </>
  );
}
