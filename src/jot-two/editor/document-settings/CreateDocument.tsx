import { DocumentSettingsModal } from "../DocumentSettingsModal";
import { ReactNode } from "react";
import { FileType, NoteFile } from "../../../jot-one/utils/file-utils";

export function CreateDocument({
  userFiles,
  children,
}: {
  userFiles: NoteFile[];
  children: ReactNode;
}) {
  return (
    <DocumentSettingsModal
      creating
      file={{
        key: "test",
        name: "Test",
        fileType: FileType.YDoc,
      }}
      userFiles={userFiles}
    >
      {children}
    </DocumentSettingsModal>
  );
}
