import React from "react";

export { RevealContext } from "./RevealContext";
export { RevealMain } from "./RevealMain";
export { useRevealDeck } from "./useReveal";

export function Slides({ children }: React.PropsWithChildren) {
  return <div className="slides">{children}</div>;
}

export function Section({ children }: React.PropsWithChildren) {
  return <section>{children}</section>;
}
