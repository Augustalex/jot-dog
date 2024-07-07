import React, { ReactNode } from "react";
import { updateUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { FileType } from "../../jot-one/utils/file-utils";
import { LinkFileModal } from "./LinkFileModal";
import { useFileContext } from "../file/FileContext";

export function EditLinkFile({ children }: { children: ReactNode }) {
  const { file, userFiles } = useFileContext();
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <LinkFileModal file={file} userFiles={userFiles} onSubmit={onSubmit}>
      {children}
    </LinkFileModal>
  );

  async function onSubmit({ url, key }: { url: string; key: string }) {
    await updateUserFile(file.key, {
      title: url,
      key: key,
      fileType: FileType.Link,
    });
    router.push(`/${localUser.username}/${key}`);
  }
}
