import { useSession } from "../store/session";
const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:4000";
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useSession.getState().token;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}), ...init?.headers },
  });
  const body = response.status === 204 ? undefined : await response.json();
  if (!response.ok) throw new Error(body?.error ?? "Request failed");
  return body as T;
}
