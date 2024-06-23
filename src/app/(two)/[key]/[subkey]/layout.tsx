import { ReactNode } from "react";
import { RedirectToSignIn, SignedOut } from "@clerk/nextjs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/*<SignedOut>*/}
      {/*  <RedirectToSignIn />*/}
      {/*</SignedOut>*/}
      {children}
    </>
  );
}
