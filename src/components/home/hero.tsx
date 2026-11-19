import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { HeroFloaters } from "@/components/home/hero-floaters";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[90dvh] w-full items-center overflow-x-clip bg-background px-4 pt-8 pb-24 text-foreground sm:px-6 sm:pt-10 sm:pb-20 lg:px-8">
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,rgba(255,64,76,0.12),transparent_62%)]"
      /> */}
      <HeroBackdrop />
      <HeroFloaters />

      <div className="mx-auto w-full max-w-4xl">
        <div className="relative isolate overflow-hidden">
          <div className=" relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-5 py-12 text-center sm:px-8 sm:py-20 glassmorphisom">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.2em] text-foreground/80 uppercase backdrop-blur sm:text-xs">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              Fresh from the oven
            </span>

            <h1 className="mt-6 font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance uppercase sm:text-5xl">
              Crave More &middot; Bite{" "}
              <span className="text-primary">Better</span>.
            </h1>

            <p className="mt-4 text-[11px] font-semibold tracking-[0.32em] text-foreground/75 uppercase sm:text-sm ">
              Your Favorite Pizza, Delivered Fresh &amp; Fast.
            </p>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-foreground/80 text-pretty sm:text-lg">
              Discover the ultimate pizza experience with SliceStack. Explore
              delicious pizzas from top restaurants near you, choose your
              favorite flavors, and we&apos;ll handle the rest.
            </p>

            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 h-12 gap-2 rounded-full px-7 shadow-lg shadow-primary/25 z-100 relative",
              )}
            >
              Explore Pizza Menu
              <ArrowRight className="size-4" aria-hidden />
            </Link>

            <p className="mt-4 text-[11px] tracking-[0.18em] text-foreground uppercase sm:text-xs">
              Freshly made · Delivered with love
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
