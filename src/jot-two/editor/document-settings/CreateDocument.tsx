import { DocumentSettingsModal } from "../DocumentSettingsModal";
import { ReactNode } from "react";
import { NoteFile } from "../../../jot-one/utils/file-utils";
import { createUserFile } from "../../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../../local-user/LocalUserContext";

export function CreateDocument({
  userFiles,
  children,
}: {
  userFiles: NoteFile[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { localUser } = useLocalUserContext();

  return (
    <DocumentSettingsModal creating onSubmit={onSubmit} userFiles={userFiles}>
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
    await createUserFile({
      title: title ?? "Untitled",
      key: address ?? "untitled",
    });
    router.push(`/${localUser.username}/${address}`);
  }
}
