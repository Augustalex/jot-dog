"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { capitalize } from "../../jot-one/utils/capitalize";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import { LocalUserProvider } from "../local-user/LocalUserContext";
import { UserLoader } from "../user/UserLoader";
import { UserBubble } from "../user/UserBubble";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home({ localId }: { localId: string }) {
  return (
    <UserLoader>
      <LocalUserProvider localId={localId}>
        <HomeInner />
      </LocalUserProvider>
    </UserLoader>
  );
}

export function HomeInner() {
  const { recentlyViewed, isReady } = useRecentlyViewed();
  if (!isReady) return <div>Loading...</div>;

  return (
    <div className={ibmPlexMono.className}>
      <div className="relative">
        <div className="ml-8 mt-8">
          <div className="flex gap-2 mb-4">
            <UserBubble />
            <h2 className="text-2xl font-bold text-gray-800">
              Recently Viewed
            </h2>
          </div>
          <div className="w-[80vw]">
            {recentlyViewed.slice(0, 7).map(({ file }) => {
              return (
                <a
                  key={file.key}
                  className={ibmPlexMono.className}
                  href={`/${file.key}`}
                >
                  <div className="p-4 my-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5 cursor-pointer">
                    {capitalize(file.key)}
                  </div>
                </a>
              );
            })}
          </div>
          <div className="mt-4 ml-2">
            <span>Any address can be a new note: jot.dog/my-note</span>
          </div>
        </div>
      </div>
    </div>
  );
}
