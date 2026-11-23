"use client";

/**
 * Last-resort boundary. It replaces the root layout, so it must render its own
 * <html>/<body> and cannot rely on theme providers or Tailwind tokens.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#100b09",
          color: "#fdf6ef",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.75rem", margin: 0 }}>
            SliceStack hit a snag
          </h1>
          <p style={{ marginTop: "0.75rem", opacity: 0.75, lineHeight: 1.6 }}>
            An unexpected error stopped the app from rendering. Please reload
            the page to try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              cursor: "pointer",
              border: 0,
              borderRadius: "9999px",
              background: "#ff404c",
              color: "#fff",
              padding: "0.75rem 1.75rem",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            Reload
          </button>
          {error.digest ? (
            <p style={{ marginTop: "1rem", opacity: 0.5, fontSize: "0.75rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
