import { DocumentSettingsModal } from "./DocumentSettingsModal";
import { ReactNode } from "react";
import { createUserFile } from "../../../app/(two)/files/user-file-actions";
import { useRouter } from "next/navigation";
import { useLocalUserContext } from "../../local-user/LocalUserContext";
import { FileType, JotTwoFile } from "../../file/file-utils";

export function CreateDocument({
  userFiles,
  children,
}: {
  userFiles: JotTwoFile[];
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
      name: title ?? "Untitled",
      key: address ?? "untitled",
      fileType: FileType.YDoc,
    });
    router.push(`/${localUser.username}/${address}`);
  }
}
