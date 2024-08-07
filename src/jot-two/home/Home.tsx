"use client";

import React from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { capitalize } from "../../jot-one/utils/capitalize";
import {
  RecentlyViewedChecker,
  useRecentlyViewed,
} from "../utils/useRecentlyViewed";
import {
  LocalUserProvider,
  useLocalUserContext,
} from "../local-user/LocalUserContext";
import { UserLoader } from "../user/UserLoader";
import { UserBubble } from "../user/UserBubble";
import { CreateDocument } from "../editor/document-settings/CreateDocument";
import { CreateLinkFile } from "../link-file/CreateLinkFile";
import { JotTwoFile } from "../file/file-utils";
import { getUsernameFromKey } from "../utils/getAddress";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Home({
  files,
  localId,
}: {
  files: JotTwoFile[];
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

export function HomeInner({ files }: { files: JotTwoFile[] }) {
  const { localUser } = useLocalUserContext();
  const { recentlyViewed: allRecentlyViewed } = useRecentlyViewed();

  const myFiles = files.map((file) => ({
    key: file.key,
    name: file.name,
    owner: localUser.username,
  }));
  const recentlyViewed = allRecentlyViewed
    .filter(
      (recentFile) => !recentFile.file.key.includes(`${localUser.username}/`),
    )
    .map(({ file }) => ({
      file,
      owner: getUsernameFromKey(file.key),
    }));

  return (
    <div>
      <div className="relative">
        <div className="ml-8 mt-8">
          <div className="mb-8">
            <div className="mb-4 flex gap-2">
              <UserBubble />
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome, {localUser.name}!
              </h2>
            </div>
            <div className="flex flex-row gap-3">
              <CreateDocument userFiles={files}>
                <button
                  className={`floating-shadow flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg bg-indigo-100 p-2 text-blue-950 hover:bg-indigo-50`}
                >
                  <span>Create new file</span>
                </button>
              </CreateDocument>

              <CreateLinkFile userFiles={files}>
                <button
                  className={`floating-shadow flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg p-2 text-blue-950 hover:bg-indigo-50`}
                >
                  <span>Link file</span>
                </button>
              </CreateLinkFile>
            </div>
          </div>

          <div className="w-[600px] max-w-[80vw]">
            {myFiles.length > 0 && (
              <div className="mb-4">
                <h3 className="text-xl text-gray-800">My files</h3>
                <div className="w-full">
                  {myFiles.map((file) => {
                    return (
                      <a
                        key={file.key}
                        href={`/${file.key}`}
                        className="my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-indigo-50"
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
                  {recentlyViewed.slice(0, 7).map(({ file, owner }) => {
                    return (
                      <RecentlyViewedChecker key={file.key} file={file}>
                        <a
                          key={file.key}
                          href={`/${file.key}`}
                          className="my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-indigo-50"
                        >
                          <span>{capitalize(file.name)}</span>
                          <span className="text-gray-400">
                            &nbsp;by {owner}
                          </span>
                        </a>
                      </RecentlyViewedChecker>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div className="mb-8 ml-2 mt-4">
            <span>Any address can be a new note: jot.dog/my-note</span>
          </div>
        </div>
      </div>
    </div>
  );
}
