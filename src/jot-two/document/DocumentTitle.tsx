import { useFileContext } from "../file/FileContext";

export function DocumentTitle() {
  const { file } = useFileContext();

  const title = file.name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return <h1 className="text-4xl mb-2">{title}</h1>;
}
