import { DocumentSettingsModal } from "../DocumentSettingsModal";
import { ReactNode } from "react";
import { useFileContext } from "../../file/FileContext";

export function EditDocument({ children }: { children: ReactNode }) {
  const { file, userFiles } = useFileContext();

  return (
    <DocumentSettingsModal file={file} userFiles={userFiles}>
      {children}
    </DocumentSettingsModal>
  );
}
