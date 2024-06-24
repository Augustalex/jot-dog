"use client";

import { NoteFile } from "../../jot-one/utils/file-utils";
import { CollaborationProvider } from "../presence/CollaborationContext";
import { FileProvider } from "../file/FileContext";
import { PresenceRow } from "../presence/PresenceRow";
import { DocumentEditorProvider } from "../editor/DocumentEditorProvider";
import { LocalUserProvider } from "../local-user/LocalUserContext";
import DocumentEditor from "../editor/DocumentEditor";
import { DocumentTitle } from "./DocumentTitle";
import { useRegisterView } from "../utils/useRecentlyViewed";
import { TabBar } from "../tab-bar/TabBar";
import { UserLoader } from "../user/UserLoader";
import { SideBar } from "../side-bar/SideBar";
import { SIDEBAR_WIDTH, useSideBarState } from "../side-bar/SideBarState";
import { useEffect, useState } from "react";
import { DocumentActions } from "./DocumentActions";
import { Features } from "../../features";

export function Document({
  userFiles,
  file,
  localId,
}: {
  userFiles: NoteFile[];
  file: NoteFile;
  localId: string;
}) {
  useRegisterView(file);

  return (
    <UserLoader>
      <FileProvider file={file} userFiles={userFiles}>
        <LocalUserProvider localId={localId}>
          <CollaborationProvider>
            <DocumentEditorProvider>
              <DocumentInner />
            </DocumentEditorProvider>
          </CollaborationProvider>
        </LocalUserProvider>
      </FileProvider>
    </UserLoader>
  );
}

function DocumentInner() {
  const sideBarIsOpen = useSideBarState((state) => state.open);

  const [leftMargin, setLeftMargin] = useState(0);

  // get required left margin for the document editor to be centered based on its width (635px) and the windows height, also listen to window resize events.
  useEffect(() => {
    const updateLeftMargin = () => {
      const windowWidth = window.innerWidth;
      const documentWidth = 635;
      const margin = (windowWidth - documentWidth) / 2;
      setLeftMargin(margin);
    };
    updateLeftMargin();
    window.addEventListener("resize", updateLeftMargin);
    return () => window.removeEventListener("resize", updateLeftMargin);
  }, []);

  return (
    <div>
      <div className="relative z-10">
        <SideBar />
        <div
          className="w-full transition-transform duration-200 ease-in-out"
          style={{
            transform: sideBarIsOpen
              ? `translateX(${SIDEBAR_WIDTH}px)`
              : "translateX(0)",
          }}
        >
          <div className="mb-4 flex items-center justify-between p-4">
            <TabBar />
          </div>
          <div
            className="flex min-h-[100vh] w-[635px] flex-col px-4 transition-[margin] duration-200 ease-in-out"
            style={{
              marginLeft: sideBarIsOpen ? "4px" : `${leftMargin}px`,
            }}
          >
            <DocumentTitle />
            <div className="my-4 flex items-center gap-4 border-b-[1px] border-gray-200 pb-4">
              {Features.document_actions && <DocumentActions />}
              <PresenceRow />
            </div>
            <DocumentEditor />
          </div>
        </div>
      </div>
    </div>
  );
}
