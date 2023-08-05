import { redirect } from "next/navigation";

export default async function Notes() {
  return redirect("/new");
}
