import React, { ReactNode } from "react";
import { updateUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { LinkFileModal } from "./LinkFileModal";
import { useFileContext } from "../file/FileContext";
import { FileType, LinkFile } from "../file/file-utils";

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

  return (
    <LinkFileModal file={linkFile} userFiles={userFiles} onSubmit={onSubmit}>
      {children}
    </LinkFileModal>
  );

  async function onSubmit({ url, key }: { url: string; key: string }) {
    await updateUserFile(linkFile.key, {
      title: url,
      key: key,
      fileType: FileType.Link,
    });
    router.push(`/${localUser.username}/${key}`);
  }
}
