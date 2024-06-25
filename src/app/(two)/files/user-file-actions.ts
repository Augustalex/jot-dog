"use server";

import { createFile, getFiles, updateFile } from "./file-helpers";
import { auth, currentUser } from "@clerk/nextjs/server";
import { FileType } from "../../../jot-one/utils/file-utils";
import { getUsername } from "./user-helpers";

export async function createUserFile({
  title,
  key,
}: {
  title: string;
  key: string;
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
    fileType: FileType.YDoc,
  });
}

export async function updateUserFile(
  currentFileKey: string,
  {
    title,
    key,
  }: {
    title: string;
    key: string;
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
    fileType: FileType.YDoc,
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
