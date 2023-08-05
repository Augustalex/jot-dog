import React from "react";

export default function OldHome() {
  const responses = [
    "Nothing to see here.",
    "Where you looking for something specific?",
    // 'Wrong place at the "' + new Date().toLocaleTimeString() + '" time.',
    "The right website lies within, not on a screen. Especially not on your screen.",
    "This is not the right website for you, but look at the person to your right and tell them you found the right website for them.",
  ];
  const randomIndex = Math.round(Math.random() * (responses.length - 1));
  const response = responses[randomIndex];

  return <span>{response}</span>;
}
