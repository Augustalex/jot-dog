import { useRecentlyViewed } from "../utils/useRecentlyViewed";
import { CloseButton } from "./CloseButton";
import { useFileContext } from "../file/FileContext";

export function TabBar() {
  const { file } = useFileContext();
  const { recentlyViewed, isReady } = useRecentlyViewed();

  const tabs = recentlyViewed
    .sort((a, b) => a.file.name.localeCompare(b.file.name))
    .map((recentFile) => {
      const selected = file.key === recentFile.file.key;
      console.log("secleted", selected, file.key, recentFile.file.key);
      return (
        <a
          key={recentFile.file.key}
          href={`/${recentFile.file.key}`}
          className={`
           flex p-2 rounded-lg
           
           min-w-[96px]
           justify-between items-center
           
           floating-shadow
           
           text-zinc-900
           
           ${selected ? "bg-indigo-100 text-blue-950" : "bg-white"}
           ${selected ? "" : "hover:bg-indigo-50 cursor-pointer"}
       `}
        >
          <div className="text-sm">{recentFile.file.name}</div>
          <CloseButton />
        </a>
      );
    });

  if (!isReady) return null;

  return (
    <div
      className="
        flex
        gap-2
        p-2
    "
    >
      {tabs}
    </div>
  );
}
