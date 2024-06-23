"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { capitalize } from "../../jot-one/utils/capitalize";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import {
  LocalUserProvider,
  useLocalUserContext,
} from "../local-user/LocalUserContext";
import { UserLoader } from "../user/UserLoader";
import { UserBubble } from "../user/UserBubble";
import { NoteFile } from "../../jot-one/utils/file-utils";
import { CreateFileModal } from "../create-file/CreateFileModal";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home({
  files,
  localId,
}: {
  files: NoteFile[];
  localId: string;
}) {
  return (
    <UserLoader>
      <LocalUserProvider localId={localId}>
        <HomeInner files={files} />
      </LocalUserProvider>
    </UserLoader>
  );
}

export function HomeInner({ files }: { files: NoteFile[] }) {
  const { localUser } = useLocalUserContext();
  const { recentlyViewed: allRecentlyViewed, isReady } = useRecentlyViewed();
  if (!isReady) return <div>Loading...</div>;

  const myFiles = files.map((file) => ({
    key: file.key,
    name: file.name,
    owner: localUser.username,
  }));
  const recentlyViewed = allRecentlyViewed
    .filter(
      (recentFile) => !recentFile.file.key.includes(`${localUser.username}/`)
    )
    .map(({ file }) => ({
      key: file.key,
      name: file.name,
      owner: file.key.includes("/") ? file.key.split("/")[0] : null,
    }));

  return (
    <div className={ibmPlexMono.className}>
      <div className="relative">
        <div className="ml-8 mt-8">
          <div className="flex gap-2 mb-4">
            <UserBubble />
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, {localUser.name}!
            </h2>
          </div>

          <div className="w-[600px] max-w-[80vw]">
            {myFiles.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl text-gray-800">My files</h3>
                <CreateFileModal>
                  <button className="p-4 my-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5 cursor-pointer">
                    <span>Create new file</span>
                  </button>
                </CreateFileModal>
                <div className="w-full">
                  {myFiles.map((file) => {
                    return (
                      <a
                        key={file.key}
                        href={`/${file.key}`}
                        className="flex p-4 my-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>{capitalize(file.name)}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            {recentlyViewed.length > 0 && (
              <div>
                <h3 className="text-xl text-gray-800">Recently viewed</h3>
                <div className="w-full">
                  {recentlyViewed.slice(0, 7).map((file) => {
                    return (
                      <a
                        key={file.key}
                        href={`/${file.key}`}
                        className="flex p-4 my-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform-gpu hover:-translate-y-0.5 cursor-pointer"
                      >
                        <span>{capitalize(file.name)}</span>
                        {file.owner && (
                          <span className="text-gray-400">
                            &nbsp;by {file.owner}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 ml-2 mb-8">
            <span>Any address can be a new note: jot.dog/my-note</span>
          </div>
        </div>
      </div>
    </div>
  );
}
