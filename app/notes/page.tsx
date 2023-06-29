import { createFile } from "./db/files";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Notes() {
  const localId = cookies().get("local-id")?.value;
  if (!localId) redirect("/guest?redirect-to=/notes");

  const file = await createFile();
  return redirect("/notes/" + file.key);
}
