import React from "react";

export function CloseButton({
  onClick,
}: {
  onClick(e: React.MouseEvent): void;
}) {
  return (
    <button className="ml-3 hover:scale-125" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="16px"
        width="16px"
        viewBox="0 -960 960 960"
        fill="#18181B"
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </button>
  );
}
