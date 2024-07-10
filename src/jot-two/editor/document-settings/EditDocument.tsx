import { DocumentSettingsModal } from "./DocumentSettingsModal";
import { ReactNode } from "react";
import { useFileContext } from "../../file/FileContext";
import { useOpenFiles } from "../../utils/useOpenFiles";
import { updateUserFile } from "../../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../../local-user/LocalUserContext";
import { isAddressChanged } from "../../utils/isAddressChanged";
import { useRecentlyViewed } from "../../utils/useRecentlyViewed";
import { FileType } from "../../file/file-utils";
import { useDeleteCurrentFile } from "../../file/deleteCurrentFile";

export function EditDocument({ children }: { children: ReactNode }) {
  const { file, userFiles } = useFileContext();
  const { closeFile } = useOpenFiles();
  const { removeFileFromRecent } = useRecentlyViewed();
  const router = useRouter();
  const { localUser } = useLocalUserContext();
  const deleteCurrentFile = useDeleteCurrentFile(file);

  return (
    <DocumentSettingsModal
      file={file}
      userFiles={userFiles}
      onDelete={deleteCurrentFile}
      onSubmit={onSubmit}
    >
      {children}
    </DocumentSettingsModal>
  );

  async function onSubmit({
    title,
    address,
  }: {
    title: string;
    address: string;
  }) {
    await updateUserFile(file.key, {
      name: title ?? "Untitled",
      key: address ?? "untitled",
      fileType: FileType.YDoc,
    });

    if (isAddressChanged(file, address)) {
      removeFileFromRecent(file);
      closeFile(file);
      router.push(`/${localUser.username}/${address}`);
    } else if (title !== file.name) {
      window.location.reload();
    }
  }
}
