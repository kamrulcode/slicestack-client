"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Floater = {
  key: string;
  className: string;
  rotate: number;
  delay: number;
  floatDistance: number;
  floatDuration: number;
  from: { x: number; y: number; rotate: number; scale: number };
  content: ReactNode;
};

function TomatoSlice() {
  const seeds = Array.from({ length: 8 }, (_, index) => index * 45);

  return (
    <svg viewBox="0 0 120 120" className="h-auto w-full" aria-hidden>
      <defs>
        <radialGradient id="hero-tomato" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#ff8c6b" />
          <stop offset="55%" stopColor="#f4453c" />
          <stop offset="100%" stopColor="#c2241f" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="52" fill="url(#hero-tomato)" />
      <circle cx="60" cy="60" r="43" fill="#ff5d4a" opacity="0.55" />
      <circle cx="60" cy="60" r="32" fill="#ff7d63" opacity="0.55" />
      {seeds.map((angle) => (
        <ellipse
          key={angle}
          cx="60"
          cy="33"
          rx="4"
          ry="7"
          fill="#ffe6ad"
          transform={`rotate(${angle} 60 60)`}
        />
      ))}
      <ellipse
        cx="40"
        cy="34"
        rx="13"
        ry="8"
        fill="#ffffff"
        opacity="0.18"
        transform="rotate(-28 40 34)"
      />
    </svg>
  );
}

function CheeseCube() {
  return (
    <svg viewBox="0 0 100 100" className="h-auto w-full" aria-hidden>
      <path d="M50 6 94 30 50 54 6 30Z" fill="#ffd35c" />
      <path d="M6 30 50 54v40L6 70Z" fill="#f0b62f" />
      <path d="M94 30 50 54v40l44-24Z" fill="#d99a1c" />
      <circle cx="42" cy="26" r="5" fill="#e8a91f" opacity="0.7" />
      <circle cx="66" cy="36" r="3.5" fill="#e8a91f" opacity="0.7" />
      <circle cx="28" cy="52" r="4" fill="#ffdf8a" opacity="0.55" />
      <circle cx="74" cy="62" r="3" fill="#ffdf8a" opacity="0.4" />
    </svg>
  );
}

const floaters: Floater[] = [
  {
    key: "basil",
    className: "top-[24%] left-[3%] w-24 xl:left-[6%] xl:w-28",
    rotate: -10,
    delay: 0.55,
    floatDistance: 12,
    floatDuration: 7,
    from: { x: -110, y: 26, rotate: -34, scale: 0.7 },
    content: (
      <Image
        src="/images/basil.webp"
        alt=""
        width={1101}
        height={887}
        sizes="112px"
        className="h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
      />
    ),
  },
  {
    key: "onion",
    className: "top-[30%] right-[4%] w-20 xl:right-[7%] xl:w-24",
    rotate: 8,
    delay: 0.7,
    floatDistance: 9,
    floatDuration: 6,
    from: { x: 110, y: 22, rotate: 30, scale: 0.72 },
    content: (
      <Image
        src="/images/onion.webp"
        alt=""
        width={731}
        height={887}
        sizes="96px"
        className="h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
      />
    ),
  },
  {
    key: "garlic",
    className: "bottom-[16%] left-[6%] w-28 xl:left-[9%] xl:w-36",
    rotate: 6,
    delay: 0.85,
    floatDistance: 10,
    floatDuration: 8,
    from: { x: -100, y: 60, rotate: -20, scale: 0.7 },
    content: (
      <Image
        src="/images/garlic.png"
        alt=""
        width={600}
        height={600}
        sizes="144px"
        className="h-auto w-full drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
      />
    ),
  },
  {
    key: "tomato",
    className: "right-[8%] bottom-[24%] w-16 xl:right-[12%] xl:w-20",
    rotate: 14,
    delay: 1,
    floatDistance: 8,
    floatDuration: 5.5,
    from: { x: 90, y: 50, rotate: 40, scale: 0.6 },
    content: (
      <div className="drop-shadow-[0_18px_24px_rgba(0,0,0,0.5)]">
        <TomatoSlice />
      </div>
    ),
  },
  {
    key: "cheese",
    className: "top-[52%] left-[13%] w-10 xl:left-[16%] xl:w-12",
    rotate: -12,
    delay: 1.15,
    floatDistance: 7,
    floatDuration: 6.5,
    from: { x: -80, y: -30, rotate: 34, scale: 0.5 },
    content: (
      <div className="drop-shadow-[0_14px_18px_rgba(0,0,0,0.5)]">
        <CheeseCube />
      </div>
    ),
  },
];

/**
 * Ingredients that drift in from the edges once the copy settles, then keep
 * bobbing above the pizza. Decorative and desktop-only so mobile stays legible.
 */
export function HeroFloaters() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-15 hidden lg:block"
    >
      {floaters.map((floater) => (
        <motion.div
          key={floater.key}
          className={cn("absolute", floater.className)}
          initial={reduceMotion ? false : { opacity: 0, ...floater.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: floater.rotate, scale: 1 }}
          transition={{
            duration: 1.1,
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
            {floater.content}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
