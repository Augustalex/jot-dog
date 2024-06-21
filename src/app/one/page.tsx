import React from "react";
import Image from "next/image";
import { Home } from "../../jot-one/features/home/Home";

export default function Root() {
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
