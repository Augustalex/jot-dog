import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser, EmailAddress, User } from "@clerk/nextjs/server";
import { FileType } from "../../../jot-one/utils/file-utils";
import { createFile, getFiles } from "./file-helpers";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { userId } = auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const { title, key }: { title: string; key: string } = await request.json();
  if (!title || !key) {
    return NextResponse.json(
      { error: "Title and Key are required" },
      { status: 400 }
    );
  }

  const username = getUsername(user);
  const file = await createFile(userId, {
    name: title,
    key: `${username}/${key}`,
    fileType: FileType.YDoc,
  });

  return NextResponse.json(file);
}

export async function GET(request: NextRequest) {
  const { userId } = auth().protect();
  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const username = getUsername(user);
  const files = await getFiles(userId);

  return NextResponse.json(
    files.filter((file) => file.key.startsWith(username))
  );
}

function getUsername(user: User) {
  return (
    user.username ??
    getUsernameFromFullName(user.fullName) ??
    getUsernameFromEmail(user.primaryEmailAddress) ??
    user.id
  );
}

function getUsernameFromFullName(fullName: string | null): string | null {
  if (!fullName) return null;

  return fullName.split(" ").join("-");
}

function getUsernameFromEmail(email: EmailAddress | null): string | null {
  if (!email) return null;

  return email.emailAddress.split("@")[0] ?? null;
}
