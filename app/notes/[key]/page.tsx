import React from "react";
import { redirect } from "next/navigation";

export default async function Notes({
  params,
}: {
  params: {
    key: string;
  };
}) {
  return redirect(`/${params.key}`);
}
