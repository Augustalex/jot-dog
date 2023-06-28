import {createFile} from "./db/files";
import {redirect} from "next/navigation";

export default async function Notes() {
  const file = await createFile();
  return redirect('/notes/' + file.key);
}
