import { useState } from "react";

export function DocumentActions() {
  const [status, setStatus] = useState<"ready" | "copied">("ready");

  return (
    <div className="flex">
      <button
        className={`text-zinc rounded-full px-4 py-1.5 text-sm hover:bg-gray-100 ${status !== "ready" ? "bg-green-100 hover:bg-green-100" : ""}`}
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
    setTimeout(() => setStatus("ready"), 3000);
  }
}
