import { isDemo } from "./demo-mode";
import { supabase } from "./supabase";

const apiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (isDemo) {
    const { demoRequest } = await import("./demo-data");
    return demoRequest<T>(path, init.method);
  }
  if (!apiUrl) throw new ApiError("Configuration manquante : VITE_API_URL.", 0);
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const response = await fetch(`${import.meta.env.DEV ? "" : apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!response.ok) {
    const message = await response
      .json()
      .then((body) => {
        if (typeof body?.error === "string") return body.error;
        if (Array.isArray(body?.errors))
          return body.errors
            .map((entry: { message?: string }) => entry.message)
            .filter(Boolean)
            .join(" ");
        return typeof body?.message === "string" ? body.message : null;
      })
      .catch(() => null);

    throw new ApiError(message ?? `Une erreur est survenue (${response.status})`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};
