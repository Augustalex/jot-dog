import { Features } from "../../features";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Home } from "../../jot-two/home/Home";

export default function HomePage() {
  if (!Features.jot_two) redirect("/one");

  return (
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
        <Home />
      </div>
    </main>
  );
}
