import React, { ReactNode } from "react";
import { updateUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { LinkFileModal } from "./LinkFileModal";
import { useFileContext } from "../file/FileContext";
import { FileType, LinkFile } from "../file/file-utils";
import { isAddressChanged } from "../utils/isAddressChanged";
import { useDeleteCurrentFile } from "../file/deleteCurrentFile";

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
  const deleteCurrentFile = useDeleteCurrentFile(linkFile);

  return (
    <LinkFileModal
      file={linkFile}
      userFiles={userFiles}
      onSubmit={onSubmit}
      onDelete={deleteCurrentFile}
    >
      {children}
    </LinkFileModal>
  );

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
