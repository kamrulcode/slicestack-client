"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Floater = {
  src: string;
  width: number;
  height: number;
  className: string;
  from: { x: number; y: number; rotate: number; scale: number };
  rotate: number;
  delay: number;
  floatDistance: number;
  floatDuration: number;
};

const floaters: Floater[] = [
  {
    src: "/images/basil.png",
    width: 1101,
    height: 887,
    className: "top-[20%] left-[12%] w-24 lg:w-28",
    from: { x: -120, y: 30, rotate: -26, scale: 0.7 },
    rotate: -8,
    delay: 0.5,
    floatDistance: 12,
    floatDuration: 7,
  },
  {
    src: "/images/onion.png",
    width: 731,
    height: 887,
    className: "top-[32%] right-[10%] w-20 lg:w-24",
    from: { x: 120, y: 24, rotate: 24, scale: 0.72 },
    rotate: 9,
    delay: 0.72,
    floatDistance: 8,
    floatDuration: 6,
  },
  {
    src: "/images/garlic.png",
    width: 600,
    height: 600,
    className: "top-[63%] left-[5%] w-30 lg:w-40",
    from: { x: -100, y: 70, rotate: -18, scale: 0.7 },
    rotate: 4,
    delay: 0.92,
    floatDistance: 10,
    floatDuration: 8,
  },
];

/**
 * Produce accents that slide in from the panel edges after the copy settles,
 * then keep drifting gently behind the text.
 */
export function HeroFloaters() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {floaters.map((floater) => (
        <motion.div
          key={floater.src}
          className={cn("absolute", floater.className)}
          initial={reduceMotion ? false : { opacity: 0, ...floater.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: floater.rotate, scale: 1 }}
          transition={{
            duration: 1,
            delay: floater.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.div
            animate={
              reduceMotion ? undefined : { y: [0, -floater.floatDistance, 0] }
            }
            transition={{
              duration: floater.floatDuration,
              delay: floater.delay + 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={floater.src}
              alt=""
              width={floater.width}
              height={floater.height}
              className="h-auto w-full drop-shadow-[0_16px_22px_rgba(18,22,25,0.28)]"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
