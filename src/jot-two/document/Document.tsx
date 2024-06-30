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
import { useLayoutEffect, useState } from "react";
import { DocumentActions } from "./DocumentActions";
import { Features } from "../../features";
import { MobileSideBar } from "../side-bar/MobileSideBar";
import {
  TRANSITION_DURATION,
  TRANSITION_EASE,
  TRANSITION_TRANSFORM,
} from "./animation";

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

const EDITOR_MAX_WIDTH = 620;

function DocumentInner() {
  const sideBarIsOpen = useSideBarState((state) => state.open);

  const [documentWidth, setDocumentWidth] = useState(0);
  useLayoutEffect(() => {
    const onResize = () => {
      setDocumentWidth(window.innerWidth);
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [sideBarIsOpen]);

  const sideBarOffset = sideBarIsOpen ? SIDEBAR_WIDTH : 0;
  const editorWindowWidth = documentWidth - sideBarOffset;
  const editorWidth = Math.min(EDITOR_MAX_WIDTH, documentWidth);

  return (
    <div>
      <div className="relative z-10">
        <div className="fixed left-0 top-0">
          <div className="hidden md:block">
            <SideBar />
          </div>
          <div className="md:hidden">
            <MobileSideBar />
          </div>
        </div>
        <div
          className={`${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE}`}
          style={{
            width: `calc(100% - ${sideBarIsOpen ? SIDEBAR_WIDTH : 0}px)`,
            transform: sideBarIsOpen
              ? `translateX(${SIDEBAR_WIDTH}px)`
              : "translateX(0)",
          }}
        >
          <div className="mb-4 flex w-full max-w-full items-center gap-2 overflow-x-auto p-4">
            <TabBar />
          </div>
          <div
            className={`flex min-h-[100vh] flex-col px-4 ${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE}`}
            style={{
              transform: `translateX(${editorWindowWidth / 2 - editorWidth / 2}px)`,
              width: `${editorWidth}px`,
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
