import { Features } from "../../features";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Home } from "../../jot-two/home/Home";
import { cookies } from "next/headers";

export default function HomePage() {
  if (!Features.jot_two) redirect("/one");

  const localId = cookies().get("local-id")?.value;
  if (!localId) throw new Error("No local id");

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
        <div className="home-wrapper">
          <Home localId={localId} />
        </div>
      </main>
    </>
  );
}
