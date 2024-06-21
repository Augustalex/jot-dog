import {Features} from "../../features";
import {redirect} from "next/navigation";
import Tiptap from "../../jot-two/editor/Tiptap";

export default function Home() {
    if(!Features.jot_two) redirect('/one');

    return (
        <>
            <h1 className="text-3xl font-bold underline">
                Hello world!
            </h1>
            <Tiptap />
        </>
    )
}