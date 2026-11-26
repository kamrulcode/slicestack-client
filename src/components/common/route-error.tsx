"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared presentation for App Router error boundaries. Keeps the branded
 * look of the storefront while offering a retry and a safe way home.
 */
export function RouteError({
  error,
  reset,
  title = "Something went wrong",
  description = "We hit an unexpected problem while loading this page.",
  homeHref = "/",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
  description?: string;
  homeHref?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-lg flex-col items-center rounded-3xl border border-border/70 bg-card px-6 py-12 text-center shadow-sm sm:px-10">
        <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" aria-hidden />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-bold tracking-tight  sm:text-3xl text-[#ff404c]">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={reset} className="rounded-full px-6">
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>
          <Link
            href={homeHref}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full px-6",
            )}
          >
            <Home className="size-4" aria-hidden />
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
