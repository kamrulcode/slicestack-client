"use client";

import { RouteError } from "@/components/common/route-error";

export default function DashboardError({
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
      description="We could not load your dashboard data. Check your connection and try again."
      homeHref="/"
    />
  );
}
