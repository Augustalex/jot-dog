import { useFileContext } from "../file/FileContext";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import { CreateFileModal } from "../create-file/CreateFileModal";
import React from "react";
import { LinkFileModal } from "../link-file/LinkFileModal";

export function SideBarContent() {
  const { userFiles, file: openFile } = useFileContext();
  const { recentlyViewed } = useRecentlyViewed();

  const recentlyViewedOthersFiles = recentlyViewed.filter(
    ({ file }) =>
      userFiles.findIndex((userFile) => userFile.key === file.key) === -1,
  );

  return (
    <>
      <div className="mb-6 flex flex-col justify-between gap-2">
        <CreateFileModal>
          <button
            className={`floating-shadow w-full cursor-pointer rounded-lg p-2 text-blue-950 hover:bg-indigo-50`}
          >
            <span>Create new file</span>
          </button>
        </CreateFileModal>
        <LinkFileModal>
          <button
            className={`floating-shadow w-full cursor-pointer rounded-lg p-2 text-blue-950 hover:bg-indigo-50`}
          >
            <span>Link file</span>
          </button>
        </LinkFileModal>
      </div>
      <div>
        <h3 className="text-lg text-gray-800">My files</h3>
        <div className="w-full">
          {userFiles.map((file) => {
            return (
              <a
                key={file.key}
                href={`/${file.key}`}
                className={`my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-indigo-50 ${file.key === openFile.key ? "bg-indigo-100" : ""}`}
              >
                <span>{file.name}</span>
              </a>
            );
          })}
        </div>
      </div>
      {recentlyViewedOthersFiles.length > 0 && (
        <div className="mt-2">
          <h3 className="text-lg text-gray-800">Other files</h3>
          <div className="w-full">
            {recentlyViewedOthersFiles.map(({ file }) => {
              return (
                <a
                  key={file.key}
                  href={`/${file.key}`}
                  className={`my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-indigo-50 ${file.key === openFile.key ? "bg-indigo-100" : ""}`}
                >
                  <span>{file.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
