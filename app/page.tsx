import React from "react";
import Image from "next/image";
import { IBM_Plex_Serif } from "next/font/google";

const ibmPlexSerif = IBM_Plex_Serif({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Home() {
  const responses = [
    "Nothing to see here.",
    "Where you looking for something specific?",
    'Wrong place at the "' + new Date().toLocaleTimeString() + '" time.',
    "The right website lies within, not on a screen. Especially not on your screen.",
    "This is not the right website for you, but look at the person to your right and tell them you found the right website for them.",
  ];
  const randomIndex = Math.round(Math.random() * (responses.length - 1));
  const response = responses[randomIndex];

  return (
    <main className="main">
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
      <span className={ibmPlexSerif.className}>{response}</span>
    </main>
  );
}
