"use client";

import { useRecentlyViewed } from "../notes/hooks/useRecentlyViewed";
import React from "react";
import { LinkCard } from "../design/LinkCard";
import { Grid } from "../design/Grid";
import { capitalize } from "../notes/utils/capitalize";
import { IBM_Plex_Mono } from "next/font/google";
import { InfoCard } from "../design/InfoCard";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home() {
  const { recentlyViewed, isReady } = useRecentlyViewed();

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: "var(--s2)" }}>
        <h2>Recently Viewed</h2>
      </div>
      <Grid style={{ width: "80vw" }}>
        {recentlyViewed.slice(0, 7).map(({ file }) => {
          return (
            <LinkCard
              key={file.key}
              className={ibmPlexMono.className}
              href={`/notes/${file.key}`}
            >
              {capitalize(file.key)}
            </LinkCard>
          );
        })}
        {recentlyViewed.length < 7 && (
          <InfoCard
            style={{
              fontStyle: "italic",
            }}
            className={ibmPlexMono.className}
          >
            Any address can be a note:
            <br />
            jot.dog/my-note
          </InfoCard>
        )}
        <InfoCard
          style={{
            fontStyle: "italic",
          }}
          className={ibmPlexMono.className}
        >
          Get a new unique note at:
          <br />
          jot.dog/new
        </InfoCard>
      </Grid>
    </div>
  );
}
