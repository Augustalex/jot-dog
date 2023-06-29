import React from "react";
import { NamePrompt } from "./NamePrompt";

export default async function Guest({
  searchParams,
}: {
  searchParams?: {
    "redirect-to": string | undefined;
  };
}) {
  return (
    <NamePrompt
      redirectTo={searchParams["redirect-to"]?.toString() ?? "/notes"}
    />
  );
}
