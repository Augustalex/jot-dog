"use server";

import { createFile, deleteFile, getFiles, updateFile } from "./file-helpers";
import { auth, currentUser } from "@clerk/nextjs/server";

import { getUsername } from "../../../jot-two/utils/getUsername";
import { FileType } from "../../../jot-two/file/file-utils";

export async function createUserFile({
  title,
  key,
  fileType = FileType.YDoc,
}: {
  title: string;
  key: string;
  fileType?: FileType;
}) {
  auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const username = getUsername({
    id: user.id,
    primaryEmailAddress: user.primaryEmailAddress?.emailAddress ?? null,
    username: user.username,
    fullName: user.fullName,
  });
  return await createFile(username, {
    name: title,
    key: `${username}/${key}`,
    fileType,
  });
}

export async function updateUserFile(
  currentFileKey: string,
  {
    title,
    key,
    fileType = FileType.YDoc,
  }: {
    title: string;
    key: string;
    fileType?: FileType;
  },
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
  return await updateFile(username, currentFileKey, {
    name: title,
    key: `${username}/${key}`,
    fileType,
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
