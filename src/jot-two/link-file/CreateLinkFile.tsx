import React, { ReactNode } from "react";
import { createUserFile } from "../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../local-user/LocalUserContext";
import { LinkFileModal } from "./LinkFileModal";
import { FileType, JotTwoFile } from "../file/file-utils";

export function CreateLinkFile({
  userFiles,
  children,
}: {
  userFiles: JotTwoFile[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <LinkFileModal userFiles={userFiles} onSubmit={onSubmit}>
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
    await createUserFile({
      name: title,
      key: key,
      url,
      fileType: FileType.Link,
    });
    router.push(`/${localUser.username}/${key}`);
  }
}
