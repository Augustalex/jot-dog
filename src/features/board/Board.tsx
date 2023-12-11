import React from "react";
import styles from "./board.module.css";
import { Header } from "../../design/board/Header";
import { Chip } from "../../design/board/Chip";
import * as Y from "yjs";
import { Y_TEXT_KEY } from "../editor-core/constants";
import * as decoding from "lib0/decoding";

export default function Board({
  localId,
  content,
}: {
  localId: string;
  content: Uint8Array;
}) {
  const items = getItems(content);
  const sections = Array.from(new Set(items.map((i) => i.status)).values());

  return (
    <main className="main editor">
      <div className={styles.window}>
        {sections.map((section) => (
          <Section key={section}>
            <Header text={section} />
            <Chips>
              {items
                .filter((i) => i.status === section)
                .map((i) => (
                  <Chip key={i.title}>{i.title}</Chip>
                ))}
            </Chips>
          </Section>
        ))}
      </div>
    </main>
  );
}

function getItems(content: Uint8Array) {
  const origin = "remote";
  const yDoc = new Y.Doc();
  const yText = yDoc.getText(Y_TEXT_KEY);
  const data = new Uint8Array(content);
  const decoder = decoding.createDecoder(data);

  // Not used here, but needs to be consumed
  const messageType = decoding.readVarUint(decoder);

  const update = decoding.readVarUint8Array(decoder);
  Y.applyUpdate(yDoc, update, origin);

  const textContent = yText.toString();
  const regex = /^##\s*([^\n\r#]*[^#\s])/gm;
  const titles = textContent.match(regex)?.map((s) => s) ?? [];

  const sections = titles
    .map((t) => textContent.indexOf(t))
    .map((i, currentIndex, list) =>
      textContent.substring(i, list[currentIndex + 1] ?? textContent.length)
    );

  return sections
    .map((s) => {
      const [rawTitle, subheading] = s.split("\n");
      const title = rawTitle.substring(2).trim();

      if (!subheading) return null;
      const hashes = subheading.match(/#\w+\b/g);
      if (!hashes) return null;

      return {
        title,
        status: hashes.at(0)?.substring(1).toLowerCase() ?? "inbox",
      };
    })
    .filter(Boolean);
}

function Chips({ children }: { children: React.ReactNode }) {
  return <div className={styles.chips}>{children}</div>;
}

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={styles.section}
      style={{ width: "100%", marginTop: "16px" }}
    >
      {children}
    </div>
  );
}
