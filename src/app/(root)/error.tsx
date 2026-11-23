"use client";

import { RouteError } from "@/components/common/route-error";

export default function StorefrontError({
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
      title="We could not load this page"
      description="The storefront ran into an unexpected problem. Please try again or head back to the menu."
      homeHref="/menu"
    />
  );
}
