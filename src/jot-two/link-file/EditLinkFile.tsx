import React, { ReactNode } from "react";
import {
  deleteUserFile,
  updateUserFile,
} from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { LinkFileModal } from "./LinkFileModal";
import { useFileContext } from "../file/FileContext";
import { FileType, LinkFile } from "../file/file-utils";
import { isAddressChanged } from "../utils/isAddressChanged";
import { useOpenFiles } from "../utils/useOpenFiles";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";

export function EditLinkFile({
  linkFile,
  children,
}: {
  linkFile: LinkFile;
  children: ReactNode;
}) {
  const { userFiles } = useFileContext();
  const router = useRouter();
  const { localUser } = useLocalUserContext();
  const { closeFile } = useOpenFiles();
  const { recentlyViewed, removeFileFromRecent } = useRecentlyViewed();

  return (
    <LinkFileModal
      file={linkFile}
      userFiles={userFiles}
      onSubmit={onSubmit}
      onDelete={onDelete}
    >
      {children}
    </LinkFileModal>
  );

  async function onDelete() {
    removeFileFromRecent(linkFile);
    closeFile(linkFile);
    await deleteUserFile(linkFile.key);

    const recentlyViewedOwnedFile = recentlyViewed
      .toSorted((a, b) => b.viewedDate.localeCompare(a.viewedDate))
      .find((recent) => recent.file.key.startsWith(localUser.username));

    if (recentlyViewedOwnedFile) {
      router.push(`/${recentlyViewedOwnedFile?.file.key}`);
    }

    const firstOwnedFile = userFiles[0];
    if (firstOwnedFile) {
      router.push(`/${firstOwnedFile.key}`);
    }

    router.push("/");
  }

  async function onSubmit({
    title,
    url,
    key,
  }: {
    title: string;
    url: string;
    key: string;
  }) {
    await updateUserFile(linkFile.key, {
      name: title,
      key,
      url,
      fileType: FileType.Link,
    });
    if (isAddressChanged(linkFile, key)) {
      router.push(`/${localUser.username}/${key}`);
    } else {
      window.location.reload();
    }
  }
}
