"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * Panel backdrop: the pizza photo is contained inside the hero card and eases
 * forward into focus from behind the copy. Scrims use theme tokens so the same
 * photo reads as a soft pastel plate in light mode and a moody one in dark.
 */
export function HeroBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={
          reduceMotion
            ? false
            : { opacity: 0, scale: 1.12, filter: "blur(14px)" }
        }
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/hero-image.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 896px, 100vw"
          className=" object-contain opacity-100"
        />
      </motion.div>

      <div className="absolute inset-0 bg-background/10 dark:bg-background/10" />
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,var(--background)_82%)]" /> */}
    </div>
  );
}
