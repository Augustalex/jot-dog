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
  return (
    <div className="">
      <TabBar />
      <div className="m-auto w-[635px] px-4 py-8 min-h-[100vh] flex flex-col">
        <DocumentTitle />
        <PresenceRow />

        <DocumentEditor />
      </div>
    </div>
  );
}
