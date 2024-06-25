import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import { CloseButton } from "./CloseButton";
import { useFileContext } from "../file/FileContext";
import { useRouter } from "next/navigation";

export function FileBar() {
  const { file } = useFileContext();
  const { recentlyViewed, isReady, removeFileFromRecent } = useRecentlyViewed();
  const router = useRouter();

  const recentTabs = recentlyViewed
    .sort((a, b) => a.file.name.localeCompare(b.file.name))
    .map((recentFile) => {
      const selected = file.key === recentFile.file.key;

      return (
        <a
          key={recentFile.file.key}
          href={`/${recentFile.file.key}`}
          className={`floating-shadow flex min-w-[96px] items-center justify-between rounded-lg p-2 text-zinc-900 ${selected ? "bg-indigo-100 text-blue-950" : "bg-white"} ${selected ? "" : "cursor-pointer hover:bg-indigo-50"} `}
        >
          <div className="text-sm">{recentFile.file.name}</div>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              removeFileFromRecent(recentFile.file);

              if (selected) {
                const anotherRecentFile = recentlyViewed.find(
                  (recent) => recent.file.key !== file.key,
                );
                if (anotherRecentFile) {
                  router.push(`/${anotherRecentFile.file.key}`);
                } else {
                  router.push(`/`);
                }
              }
            }}
          />
        </a>
      );
    });

  if (!isReady) return null;

  return <div className="flex gap-2">{recentTabs}</div>;
}
