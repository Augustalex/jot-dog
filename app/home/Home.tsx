"use client";

import { useRecentlyViewed } from "../notes/hooks/useRecentlyViewed";
import React from "react";
import { LinkCard } from "../design/LinkCard";
import { Grid } from "../design/Grid";
import { capitalize } from "../notes/utils/capitalize";
import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home() {
  const { localState, isReady } = useRecentlyViewed();

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: "var(--s2)" }}>
        <h2>Recently Viewed</h2>
      </div>
      <Grid style={{ width: "80vw" }}>
        {localState.map(({ file }) => {
          return (
            <LinkCard
              style={{ aspectRatio: "3/1" }}
              key={file.key}
              className={ibmPlexMono.className}
              href={`/notes/${file.key}`}
            >
              {capitalize(file.key)}
            </LinkCard>
          );
        })}
      </Grid>
    </div>
  );
}
