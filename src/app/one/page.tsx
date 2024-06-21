import { redirect } from "next/navigation";

export default async function Notes() {
  return redirect("/one/new");
}
