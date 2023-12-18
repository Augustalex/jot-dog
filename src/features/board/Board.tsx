import React from "react";
import styles from "./board.module.css";
import { Header } from "../../design/board/Header";
import { Chip } from "../../design/board/Chip";
import { NoteFile } from "../../utils/file-utils";
import { BottomBarWrapper } from "../bottom-bar/BottomBarWrapper";
import { ShowJotButton } from "../bottom-bar/ShowJotButton";
import { getRawContent } from "../../utils/getRawContent";

export default function Board({
  file,
  content,
}: {
  file: NoteFile;
  content: Uint8Array;
}) {
  const items = getItems(getRawContent(content));
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
                  <Chip key={i.title} href={`/${file.key}?title=${i.title}`}>
                    {i.title}
                  </Chip>
                ))}
            </Chips>
          </Section>
        ))}
      </div>
      <BottomBarWrapper>
        <ShowJotButton file={file} />
      </BottomBarWrapper>
    </main>
  );
}

function getItems(textContent: string) {
  const regex = /^##\s*([^\n\r#]*[^#\s])/gm;
  const titles = textContent.match(regex)?.map((s) => s) ?? [];

  const sections = titles
    .map((t) => textContent.indexOf(t + "\n"))
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
  return <div className={styles.section}>{children}</div>;
}
