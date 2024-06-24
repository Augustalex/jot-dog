import { useFileContext } from "../file/FileContext";
import { IBM_Plex_Mono } from "next/font/google";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export function DocumentTitle() {
  const { file } = useFileContext();

  const title = file.name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div className={ibmPlexMono.className}>
      <h1 className="spacing mb-2 text-5xl font-semibold tracking-tight text-zinc-900">
        {title}
      </h1>
    </div>
  );
}
