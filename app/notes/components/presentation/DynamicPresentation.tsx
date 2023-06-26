"use client";
import dynamic from "next/dynamic";

export const DynamicPresentation = dynamic(
  () => import("./Presentation").then((m) => m.Presentation),
  {
    ssr: false,
  }
);
