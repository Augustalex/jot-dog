"use client";

import { useState } from "react";
import { createUserFile } from "../app/(two)/files/user-file-actions";

export function FileTester() {
  const [name, setName] = useState("Sample name");
  const [key, setKey] = useState("sample-key");

  return (
    <div>
      <label>
        <span>Key</span>
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          type="text"
        />
      </label>
      <label>
        <span>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </label>
      <button onClick={createFile}>Create file</button>
    </div>
  );

  async function createFile() {
    try {
      const file = await createUserFile({
        title: name,
        key,
      });
      console.log("Created file", file);
    } catch (err) {
      console.log(err);
    }
  }
}
