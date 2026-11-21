import { headers } from "next/headers";
import { BASE_URL } from "@/config/baseURL";
import { auth } from "@/lib/auth";
import { ApiError, type ApiRequestOptions } from "@/types/api";

/** The signed-in user's JWT, minted by Better Auth for this request. */
export async function getApiToken(): Promise<string | null> {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? null;
  } catch {
    return null;
  }
}

function readErrorMessage(payload: unknown, status: number) {
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.error === "string") return record.error;
    if (typeof record.message === "string") return record.message;
  }

  return status === 401
    ? "Please sign in to continue."
    : "Something went wrong. Please try again.";
}

/**
 * Server-side equivalent of apiFetch. Used by Server Components and route
 * guards; it never touches MongoDB directly.
 */
export async function serverApiFetch<T>(
  path: string,
  options: Omit<ApiRequestOptions, "signal"> = {},
): Promise<T> {
  const { method = "GET", body, auth: needsAuth = true } = options;
  const requestHeaders: Record<string, string> = {};
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (needsAuth) {
    const token = await getApiToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  const payload: unknown = text ? safeJson(text) : null;

  if (!response.ok) {
    throw new ApiError(readErrorMessage(payload, response.status), response.status);
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
