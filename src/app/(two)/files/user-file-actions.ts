"use server";

import { createFile, deleteFile, getFiles, updateFile } from "./file-helpers";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getUsername } from "../../../jot-two/utils/getUsername";
import { FileType, JotTwoFile } from "../../../jot-two/file/file-utils";
import {
  getAddress,
  getUsernameFromKey,
} from "../../../jot-two/utils/getAddress";

export async function createUserFile<File extends JotTwoFile>(file: File) {
  auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const username = getUsername({
    id: user.id,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    username: user.username,
    fullName: user.fullName,
  });
  const { key, ...misc } = file;
  return await createFile(username, {
    key: `${username}/${key}`,
    ...misc,
  });
}

export async function updateUserFile<File extends JotTwoFile>(
  currentFileKey: string,
  newFile: File,
) {
  auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const username = getUsername({
    id: user.id,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    username: user.username,
    fullName: user.fullName,
  });

  const { key, ...misc } = newFile;
  return await updateFile(username, currentFileKey, {
    key: `${username}/${getAddress(newFile.key)}`,
    ...misc,
  });
}

export async function getUserFiles() {
  const user = await currentUser();
  if (!user) return [];

  return await getFiles(
    getUsername({
      id: user.id,
      primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
      username: user.username,
      fullName: user.fullName,
    }),
  );
}

export async function checkIfUserFileExists(fileKey: string) {
  const username = getUsernameFromKey(fileKey);

  const files = await getFiles(username);
  return files.some((f) => f.key === fileKey);
}

export async function getOrCreateUserFile({
  username,
  fileKey,
}: {
  username: string;
  fileKey: string;
}) {
  const files = await getFiles(username);
  const file = files.find((f) => f.key === `${username}/${fileKey}`);
  if (!file) {
    const user = await currentUser();
    if (
      user &&
      getUsername({
        id: user.id,
        primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
        username: user.username,
        fullName: user.fullName,
      }) === username
    ) {
      return await createFile(username, {
        name: fileKey,
        key: `${username}/${fileKey}`,
        fileType: FileType.YDoc,
      });
    } else {
      throw new Error("File not found");
    }
  }

  return file;
}

export async function deleteUserFile(fileKey: string) {
  auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const username = getUsername({
    id: user.id,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    username: user.username,
    fullName: user.fullName,
  });
  return await deleteFile(fileKey, username);
}
