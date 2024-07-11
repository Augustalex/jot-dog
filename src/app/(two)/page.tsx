import { Features } from "../../features";
import { redirect } from "next/navigation";
import Image from "next/image";
import React from "react";
import { Home } from "../../jot-two/home/Home";
import { cookies } from "next/headers";
import { getUserFiles } from "./files/user-file-actions";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

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
        <div className="flex h-svh w-svw items-center justify-center">
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
              width={1152 / 2}
              height={1280 / 2}
            />
          </div>
          <SignInButton>
            <button
              className={`floating-shadow flex cursor-pointer items-center justify-center rounded-lg bg-indigo-100 px-8 py-4 text-xl text-blue-950 hover:bg-indigo-50`}
            >
              <span>Get started</span>
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}
