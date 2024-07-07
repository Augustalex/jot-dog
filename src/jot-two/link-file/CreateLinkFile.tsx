import React, { ReactNode } from "react";
import { createUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { FileType, NoteFile } from "../../jot-one/utils/file-utils";
import { LinkFileModal } from "./LinkFileModal";

export function CreateLinkFile({
  userFiles,
  children,
}: {
  userFiles: NoteFile[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <LinkFileModal userFiles={userFiles} onSubmit={onSubmit}>
      {children}
    </LinkFileModal>
  );

  async function onSubmit({ url, key }: { url: string; key: string }) {
    await createUserFile({
      title: url,
      key: key,
      fileType: FileType.Link,
    });
    router.push(`/${localUser.username}/${key}`);
  }
}
