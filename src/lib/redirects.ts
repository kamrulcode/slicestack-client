export function safeRedirectPath(value: unknown, fallback = "/dashboard") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  // Backslashes and control characters can be normalised into an off-site URL.
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  if (value.startsWith("/sign-in") || value.startsWith("/sign-up")) {
    return fallback;
  }
  return value;
}
