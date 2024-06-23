import { Features } from "../../features";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Home } from "../../jot-two/home/Home";
import { cookies } from "next/headers";
import { FileTester } from "../../jot-two/FileTester";
import { getUserFiles } from "./files/user-file-actions";

export default async function HomePage() {
  if (!Features.jot_two) redirect("/one");

  const localId = cookies().get("local-id")?.value;
  if (!localId) throw new Error("No local id");

  const files = await getUserFiles();

  return (
    <>
      <main className={`main`}>
        <div
          style={{
            margin: "0 auto",
            position: "fixed",
            bottom: "-72px",
            right: "0px",
          }}
        >
          <Image
            src={"/jotdog.png"}
            alt={"Jot dog"}
            width={1152 / 4}
            height={1280 / 4}
          />
        </div>
        {/*<FileTester />*/}
        <div className="home-wrapper">
          <Home files={files} localId={localId} />
        </div>
      </main>
    </>
  );
}
