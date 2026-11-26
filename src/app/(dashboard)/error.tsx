"use client";

import { RouteError } from "@/components/common/route-error";

/**
 * Catches failures from the dashboard layout itself (session lookup, shell
 * chrome). Errors thrown by individual pages are handled by the more specific
 * `dashboard/error.tsx` boundary.
 */
export default function DashboardGroupError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="This workspace could not load"
      description="We could not verify your session. Your account is still signed in — try again."
      homeHref="/dashboard"
    />
  );
}
