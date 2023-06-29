"use client";
import styles from "./cursors.module.css";
import { useLiveCursors } from "../../../ably/live-cursors";
import React, { useEffect, useState } from "react";
import { NoteFile } from "../../utils/file-utils";

// List of 10 esthetically pleasing colors in different hues with same brightness and saturation, but paired with a less bright color of the same hue
const COLOR_PAIRS = [
  ["#f94144", "#f3722c"],
  ["#f8961e", "#f9844a"],
  ["#f9c74f", "#90be6d"],
  ["#43aa8b", "#4d908e"],
  ["#577590", "#277da1"],
  ["#264653", "#2a9d8f"],
  ["#e63946", "#f1faee"],
  ["#a8dadc", "#457b9d"],
  ["#1d3557", "#e63946"],
  ["#fca311", "#14213d"],
];

export function Cursors({
  file,
  localId,
}: {
  file: NoteFile;
  localId: string;
}) {
  const [cursors, updateCursor, lastSentCursor] = useLiveCursors(file, localId);
  const [localMouse, setLocalMouse] = useState({
    x: 0,
    y: 0,
    time: Date.now(),
  });
  const [color] = useState(
    COLOR_PAIRS[Math.floor(Math.random() * COLOR_PAIRS.length)]
  );

  const onMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const clientY = e.clientY;
      const clientX = e.clientX;
      const direction = Math.atan2(
        clientY - lastSentCursor.y,
        clientX - lastSentCursor.x
      );
      if (Date.now() > localMouse.time + 600) {
        setLocalMouse({
          x: clientX,
          y: clientY,
          time: Date.now(),
        });
      }
      updateCursor({
        x: clientX,
        y: clientY,
        c: color.join(":"),
        d: direction,
      });
    },
    [color, lastSentCursor.x, lastSentCursor.y, localMouse.time, updateCursor]
  );

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      onMouseMove(e);
    };
    window.addEventListener("mousemove", listener);

    return () => {
      window.removeEventListener("mousemove", listener);
    };
  }, [onMouseMove]);

  return (
    <div className={styles.cursorWindow}>
      {cursors.map((c) => {
        if (c.id === localId) return null;

        const x = c.x;
        const y = c.y;
        const [fill] = c.c.split(":");
        return (
          <CursorIcon
            key={c.id}
            x={x}
            y={y}
            fill={fill}
            angle={c.d + Math.PI * 0.5}
            userName={c.id}
          />
        );
      })}
    </div>
  );
}

function CursorIcon({
  x,
  y,
  fill = "red",
  angle = 0,
  userName = "Anonymous",
}: {
  x: number;
  y: number;
  fill?: string;
  angle: number;
  userName?: string | undefined | null;
}) {
  return (
    <div
      className={styles.cursor}
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
      }}
    >
      <div
        className={styles.cursor}
        style={{
          transform: `rotate(${angle}rad)`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          style={{
            transform: "translate(0px, 25%)",
          }}
        >
          <path
            d="M52.48,50.05,33.34,11.34a1.5,1.5,0,0,0-2.68,0L11.52,50.05A1.5,1.5,0,0,0,13.66,52L32,40.43,50.34,52A1.51,1.51,0,0,0,52.48,50.05Z"
            fill={fill}
          />
        </svg>
      </div>
      <span
        className={styles.cursorName}
        style={{
          color: fill,
          transform: `translate(calc(-50% + ${Math.round(
            Math.cos(angle + Math.PI * 0.5) * 64
          )}px + 16px), calc(-50% + ${Math.round(
            Math.sin(angle + Math.PI * 0.5) * 32
          )}px + 16px))`,
        }}
      >
        {userName}
      </span>
    </div>
  );
}

//
// function CursorIcon({
//   x,
//   y,
//   fill = "red",
//   border = "black",
// }: {
//   x: number;
//   y: number;
//   fill?: string;
//   border?: string;
// }) {
//   return (
//     <svg
//       className={styles.cursor}
//       style={{
//         transform: `translate(${x}px, ${y}px)`,
//       }}
//       version="1.1"
//       id="Layer_1"
//       xmlns="http://www.w3.org/2000/svg"
//       x="0px"
//       y="0px"
//       viewBox="0 0 28 28"
//     >
//       <polygon
//         fill={border}
//         points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6 "
//       />
//       <polygon fill={border} points="17.3,21.6 13.7,23.1 9,12 12.7,10.5 " />
//       <rect
//         x="12.5"
//         y="13.6"
//         transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)"
//         width="2"
//         height="8"
//         fill={fill}
//       />
//       <polygon
//         points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "
//         fill={fill}
//       />
//     </svg>
//   );
// }
