import { API_URL } from "../constants/api";

type GetToken = (opts?: { template?: string }) => Promise<string | null>;

export async function apiFetch(
  getToken: GetToken,
  path: string,
  options: RequestInit = {}
) {
  const token = await getToken({ template: "backend" });
  if (!token) throw new Error("Missing auth token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body;
}

export async function getMe(getToken: GetToken) {
  return apiFetch(getToken, "/me", { method: "GET" });
}
