import { Features } from "../../features";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Home } from "../../jot-two/home/Home";
import { cookies } from "next/headers";
import { getUserFiles } from "./files/user-file-actions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export default async function HomePage() {
  if (!Features.jot_two) redirect("/one");

  const localId = cookies().get("local-id")?.value;
  if (!localId) throw new Error("No local id");

  const files = await getUserFiles();

  return (
    <>
      <SignedIn>
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
            <Home files={files} localId={localId} />
          </div>
        </main>
      </SignedIn>
      <SignedOut>
        <div className="mt-[120px] flex w-svw flex-col items-center justify-center">
          <div
            style={{
              margin: "0 auto",
              width: "min(100vw, 1600px)",
              position: "fixed",
              bottom: "0",
            }}
          >
            <Image
              src={"/splash.png"}
              alt={"App screenshot"}
              width={2017 / 1.2}
              height={1270 / 1.2}
              className="bottom-[-10%] mx-auto max-w-[70%]"
            />

            <Image
              src={"/jotdog.png"}
              alt={"Jot dog"}
              width={1152 / 1.5}
              height={1280 / 1.5}
              className="absolute -bottom-[72px] right-[50px]"
              style={{
                width: "40%",
              }}
            />
          </div>

          <div className="mb-12">
            <div className={ibmPlexMono.className}>
              <h1 className="mb-8 mt-4 text-center text-8xl font-bold text-zinc-900">
                Jot
              </h1>
            </div>
            <h2 className="text-center text-4xl font-bold text-zinc-900">
              notes together.
            </h2>
          </div>
          <SignInButton>
            <button
              className={`floating-shadow flex cursor-pointer items-center justify-center rounded-lg bg-indigo-100 px-8 py-4 text-xl font-bold text-blue-950 hover:bg-indigo-50`}
            >
              Get started
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
