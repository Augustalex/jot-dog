"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { RevealContext } from "./RevealContext";

import Reveal from "../../../../src/reveal.js-master/dist/reveal.js";
import Markdown from "../../../../src/reveal.js-master/plugin/markdown/markdown.js";
import Notes from "../../../../src/reveal.js-master/plugin/notes/notes.js";
import Zoom from "../../../../src/reveal.js-master/plugin/zoom/zoom.js";

let deck: typeof Reveal | null = null;

export function RevealMain({ children }) {
  const revealRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [initialIndices, setInitialIndices] = useState({});

  const getDeck = useCallback(() => deck, []);
  const isReady = useCallback(() => !!(ready && deck), [ready]);

  const getInitialIndices = useCallback(() => {
    return initialIndices;
  }, [initialIndices]);

  useEffect(() => {
    if (!deck && revealRef.current) {
      const deck = Reveal(revealRef.current);
      deck
        .initialize({
          hash: true,
          plugins: [Markdown, Notes, Zoom],
        })
        .then((e) => {
          setInitialIndices({
            currentSlide: e.currentSlide,
            indexh: e.indexh,
            indexv: e.indexv,
          });
          setReady(true);
        });
    }
  }, []);

  return (
    <div
      ref={revealRef}
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "100%",
      }}
    >
      <RevealContext.Provider value={{ getDeck, isReady, getInitialIndices }}>
        <div className="reveal">
          <div className="slides">
            <section data-markdown>
              <textarea data-template>
                MDSlides Simple markdown presentation tool
                [Ace](https://ace.c9.io/) and --- ## Documentation Check out the
                [documentation](https://docs.mdslides.app/) for further details.
              </textarea>
            </section>
          </div>
        </div>
      </RevealContext.Provider>
    </div>
  );
}
