import React from "react";
import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";
import { Home } from "../features/home/Home";

const ibmPlexSerif = IBM_Plex_Serif({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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
