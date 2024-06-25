import { useState } from "react";

export function DocumentActions() {
  const [status, setStatus] = useState<"ready" | "copied">("ready");

  return (
    <div className="flex">
      <button
        className={`rounded-full bg-gray-400 px-4 py-1 text-sm text-white hover:bg-blue-400 ${status === "ready" ? "hover:bg-blue-400" : "bg-green-500"}`}
        onClick={share}
        disabled={status !== "ready"}
      >
        {status === "ready" ? "Share" : "Copied link!"}
      </button>
    </div>
  );

  async function share() {
    await navigator.clipboard.writeText(window.location.href);
    setStatus("copied");
    setTimeout(() => setStatus("ready"), 5000);
  }
}
