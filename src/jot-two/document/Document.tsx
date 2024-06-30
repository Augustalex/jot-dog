"use client";

import { FileType, NoteFile } from "../../jot-one/utils/file-utils";
import { CollaborationProvider } from "../presence/CollaborationContext";
import { FileProvider, useFileContext } from "../file/FileContext";
import { PresenceRow } from "../presence/PresenceRow";
import { DocumentEditorProvider } from "../editor/DocumentEditorProvider";
import { LocalUserProvider } from "../local-user/LocalUserContext";
import DocumentEditor from "../editor/DocumentEditor";
import { DocumentTitle } from "./DocumentTitle";
import { useRegisterView } from "../utils/useRecentlyViewed";
import { TabBar } from "../tab-bar/TabBar";
import { UserLoader } from "../user/UserLoader";
import { DesktopSideBar } from "../side-bar/DesktopSideBar";
import { SIDEBAR_WIDTH, useSideBarState } from "../side-bar/SideBarState";
import { useLayoutEffect, useState } from "react";
import { DocumentActions } from "./DocumentActions";
import { Features } from "../../features";
import {
  TRANSITION_DURATION,
  TRANSITION_EASE,
  TRANSITION_TRANSFORM,
} from "./animation";
import { useRegisterOpenFile } from "../utils/useOpenFiles";
import { MobileSideBar } from "../side-bar/MobileSideBar";

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
  useRegisterOpenFile(file);

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
  const { file } = useFileContext();
  const sideBarIsOpen = useSideBarState((state) => state.open);

  return (
    <div className="relative">
      <div className="hidden md:block">
        <DesktopSideBar />
      </div>
      <div className="md:hidden">
        <MobileSideBar />
      </div>
      <div
        className={`${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE} z-0 flex h-svh flex-col`}
        style={{
          width: `calc(100% - ${sideBarIsOpen ? SIDEBAR_WIDTH : 0}px)`,
          transform: sideBarIsOpen
            ? `translateX(${SIDEBAR_WIDTH}px)`
            : "translateX(0)",
        }}
      >
        <div className="flex w-full max-w-full flex-auto flex-shrink-0 flex-grow-0 items-center gap-2 overflow-x-auto p-4">
          <TabBar />
        </div>
        {file.fileType === FileType.YDoc && <DocumentEditorWindow />}
        {file.fileType === FileType.Link && (
          <iframe
            className="mx-4 mb-4 flex-grow rounded-lg border-2 border-gray-200"
            src={file.name}
          />
        )}
      </div>
    </div>
  );
}

function DocumentEditorWindow() {
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
    <div
      className={`mx-4 mt-4 flex flex-grow flex-col ${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE}`}
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
  );
}
