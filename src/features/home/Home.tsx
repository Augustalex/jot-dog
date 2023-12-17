"use client";

import { useRecentlyViewed } from "../../utils/hooks/useRecentlyViewed";
import React from "react";
import { LinkCard } from "../../design/LinkCard";
import { Grid } from "../../design/Grid";
import { capitalize } from "../../utils/capitalize";
import { IBM_Plex_Mono } from "next/font/google";
import { InfoCard } from "../../design/InfoCard";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home() {
  const { recentlyViewed, isReady } = useRecentlyViewed();

  if (!isReady) return <div>Loading...</div>;

  return (
    <div>
      <div
        style={{ marginBottom: "var(--s2)", color: "var(--color-dark-text)" }}
      >
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
          <InfoCard className={ibmPlexMono.className}>
            <span>Any address can be a new note:</span>
            jot.dog/my-note
          </InfoCard>
        )}
        <InfoCard className={ibmPlexMono.className}>
          <span>
            Create a new <em>unique</em> note at:
          </span>
          jot.dog/new
        </InfoCard>
      </Grid>
    </div>
  );
}
