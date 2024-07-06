import { DocumentSettingsModal } from "../DocumentSettingsModal";
import { ReactNode } from "react";
import { useFileContext } from "../../file/FileContext";
import { useOpenFiles } from "../../utils/useOpenFiles";
import { useRecentlyViewed } from "../../utils/useRecentlyViewed";
import { deleteUserFile } from "../../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../../local-user/LocalUserContext";

export function EditDocument({ children }: { children: ReactNode }) {
  const { file, userFiles } = useFileContext();
  const { closeFile } = useOpenFiles();
  const { removeFileFromRecent } = useRecentlyViewed();
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <DocumentSettingsModal
      file={file}
      userFiles={userFiles}
      onDelete={onDelete}
    >
      {children}
    </DocumentSettingsModal>
  );

  async function onDelete() {
    removeFileFromRecent(file);
    closeFile(file);
    await deleteUserFile(file.key);
    router.push(`/${localUser.username}`);
  }
}
