// const JOT_DOCS_URL = "https://live.jot.dog/docs";
const JOT_DOCS_URL = "http://localhost:3124/docs";

export const jkv = {
  getJson,
  setJson,
  del,
};

async function getJson<T>(key: string): Promise<T | null> {
  const response = await fetch(
    `${JOT_DOCS_URL}/get?key=${encodeURIComponent(key)}`,
  );
  if (!response.ok)
    throw new Error(
      `Failed to get key "${key}" from JKV: ${response.statusText}`,
    );

  return response.headers.get("content-length") === "0"
    ? null
    : ((await response.json()) as T);
}

async function setJson(key: string, data: any) {
  const response = await fetch(
    `${JOT_DOCS_URL}/set?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  if (!response.ok)
    throw new Error(
      `Failed to set key "${key}" in JKV: ${response.statusText}`,
    );
}

async function del(key: string) {
  const response = await fetch(
    `${JOT_DOCS_URL}/del?key=${encodeURIComponent(key)}`,
    {
      method: "DELETE",
    },
  );
  if (!response.ok)
    throw new Error(
      `Failed to delete key "${key}" in JKV: ${response.statusText}`,
    );
}
