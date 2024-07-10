import { deleteUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { useFileContext } from "./FileContext";
import { JotTwoFile } from "./file-utils";
import { useOpenFiles } from "../utils/useOpenFiles";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";

export function useDeleteCurrentFile(file: JotTwoFile) {
  const { userFiles } = useFileContext();
  const router = useRouter();
  const { localUser } = useLocalUserContext();
  const { closeFile } = useOpenFiles();
  const { recentlyViewed, removeFileFromRecent } = useRecentlyViewed();

  return async function deleteCurrentFile() {
    removeFileFromRecent(file);
    closeFile(file);
    await deleteUserFile(file.key);

    const recentlyViewedOwnedFile = recentlyViewed
      .toSorted((a, b) => b.viewedDate.localeCompare(a.viewedDate))
      .find(
        (recent) =>
          recent.file.key.startsWith(localUser.username) &&
          recent.file.key !== file.key,
      );

    if (recentlyViewedOwnedFile) {
      router.push(`/${recentlyViewedOwnedFile?.file.key}`);
    }

    const firstOwnedFile = userFiles.find((file) => file.key !== file.key);
    if (firstOwnedFile) {
      router.push(`/${firstOwnedFile.key}`);
    }

    router.push("/");
  };
}
