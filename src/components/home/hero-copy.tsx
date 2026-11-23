"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Hero copy: badge, split-colour headline with a hand-drawn underline, CTA and
 * a pair of service highlights. Each block enters on a short stagger so the
 * eye lands on the headline before the pizza.
 */
export function HeroCopy() {
  const reduceMotion = useReducedMotion();

  const hidden = (y: number) => (reduceMotion ? false : { opacity: 0, y });
  const show = { opacity: 1, y: 0 };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
      <motion.span
        initial={hidden(14)}
        animate={show}
        transition={{ duration: 0.8, ease: EASE }}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-foreground uppercase backdrop-blur-sm dark:border-white/15 dark:bg-white/[0.04] dark:text-white/75 sm:text-[11px]"
      >
        <Flame className="size-3.5 text-[#FFB340]" aria-hidden />
        Fresh from the oven
        <span className="relative flex size-1.5" aria-hidden>
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#FFB340] opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-[#FFB340]" />
        </span>
      </motion.span>

      <motion.h1
        initial={hidden(28)}
        animate={show}
        transition={{ duration: 1, delay: 0.1, ease: EASE }}
        className="mt-6 font-heading text-[clamp(2.6rem,9vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.02em] text-balance text-foreground uppercase dark:text-white"
      >
        <span className="block">Crave more</span>
        <span className="relative mt-1 block">
          <span className="text-[#FF404C] dark:text-[#FFB340]">Bite</span>{" "}
          better
          <svg
            aria-hidden
            viewBox="0 0 320 14"
            fill="none"
            preserveAspectRatio="none"
            className="absolute -bottom-2 left-1/2 h-3 w-[86%] -translate-x-1/2 sm:-bottom-3 sm:h-4"
          >
            <motion.path
              d="M4 9.5C58 3.5 132 2.5 190 5.5C238 8 284 8.5 316 5"
              stroke="#FFB340"
              strokeWidth={5}
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.8, ease: EASE }}
            />
          </svg>
        </span>
      </motion.h1>

      <motion.p
        initial={hidden(22)}
        animate={show}
        transition={{ duration: 0.9, delay: 0.24, ease: EASE }}
        className="mt-6 max-w-xl rounded-xl px-4 py-2 text-[15px] leading-relaxed text-pretty text-foreground font-semibold [text-shadow:0_2px_8px_rgba(0,0,0,0.9)] backdrop-blur-sm dark:text-white sm:mt-7 sm:text-[17px]"
      >
        Discover the ultimate pizza experience with SliceStack. Explore
        delicious pies from top kitchens near you, pick your favourite flavours,
        and we&apos;ll handle the rest.
      </motion.p>

      <motion.div
        initial={hidden(20)}
        animate={show}
        transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
        className="mt-7 flex flex-col items-center gap-4 sm:mt-9"
      >
        <Link
          href="/menu"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group/cta h-13 gap-2.5 rounded-full bg-primary px-7 text-[15px] tracking-wide  shadow-[0_18px_45px_-14px_rgba(255,64,76,0.95)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-9 sm:text-base",
          )}
        >
          Explore Pizza Menu
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1"
            aria-hidden
          />
        </Link>
        {/* <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group/cta gap-2.5 rounded-full bg-primary   tracking-wide    hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-9 sm:text-base group h-14.5   bg-linear-to-r from-[#FF9C18] to-[#F51E50] px-8  font-bold text-white shadow-[0_8px_25px_rgba(244,91,42,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(244,91,42,0.35)] hover:from-[#F98B13] hover:to-[#EA164A]",
          )}
        >
          Explore Pizza Menu
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1"
            aria-hidden
          />
        </Link> */}
      </motion.div>
    </div>
  );
}
