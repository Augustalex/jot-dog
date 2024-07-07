import { useFileContext } from "../file/FileContext";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import React from "react";
import { FileType } from "../../jot-one/utils/file-utils";
import { getAddress } from "../utils/getAddress";
import { CreateDocument } from "../editor/document-settings/CreateDocument";
import { CreateLinkFile } from "../link-file/CreateLinkFile";

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
        <CreateDocument userFiles={userFiles}>
          <button
            className={`floating-shadow w-full cursor-pointer rounded-lg p-2 text-blue-950 hover:bg-indigo-50`}
          >
            <span>Create new file</span>
          </button>
        </CreateDocument>
        <CreateLinkFile userFiles={userFiles}>
          <button
            className={`floating-shadow w-full cursor-pointer rounded-lg p-2 text-blue-950 hover:bg-indigo-50`}
          >
            <span>Link file</span>
          </button>
        </CreateLinkFile>
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
                <span>
                  {file.fileType === FileType.YDoc
                    ? file.name
                    : getAddress(file.key)}
                </span>
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
