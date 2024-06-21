import { Features } from "../../features";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const Tiptap = dynamic(() => import("../../jot-two/editor/Tiptap"), {
  ssr: false,
});

export default function Home() {
  if (!Features.jot_two) redirect("/one");

  return (
    <>
      <Tiptap />
    </>
  );
}
