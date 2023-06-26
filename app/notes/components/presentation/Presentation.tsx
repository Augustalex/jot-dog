"use client";

import styles from "./presentation.module.css";
import React, { useCallback } from "react";
import { useSelectedContent } from "../../db/hooks/useSelectedContent";
import { EditorConfig } from "../../db/editor";
import { useLocalEditorState, ViewMode } from "../hooks/useLocalEditorState";
import { RevealMain } from "../reveal/RevealMain";
import { useRevealDeck } from "../reveal/useReveal";

export function Presentation({ editorConfig }: { editorConfig: EditorConfig }) {
  return <PresentationUI editorConfig={editorConfig} />;
}

function PresentationUI({ editorConfig }: { editorConfig: EditorConfig }) {
  const editorStore = useLocalEditorState(editorConfig.selectedFile);
  const content = useSelectedContent().data;
  const { scheduleSave, setUnsavedContent, fontSize } = useLocalEditorState(
    editorConfig.selectedFile
  );
  const [editorWindow, setEditorWindow] = React.useState<HTMLDivElement | null>(
    null
  );

  const mark = `
    ## Slide 1
    this is slide 1
    ---
    ## Slide 2
    this is slide 2
  `;

  return (
    <div
      ref={(newRef) => setEditorWindow(newRef)}
      className={styles.editorWindow}
      style={{
        fontSize: fontSize + "px",
        width: "100%",
        height: "100%",
        flex: "1 0 100%",
        visibility:
          editorStore.viewMode === ViewMode.Presenting ? "visible" : "hidden",
      }}
    >
      <RevealMain>
        <div className="slides">
          <section data-markdown>
            <section data-template>Slide 1</section>
          </section>
        </div>
      </RevealMain>
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
