"use client";

import { motion, useReducedMotion } from "motion/react";

const EMBERS = Array.from({ length: 20 }, (_, index) => ({
  left: `${(index * 47 + 9) % 100}%`,
  top: `${52 + ((index * 31) % 44)}%`,
  size: index % 4 === 0 ? 4 : index % 2 === 0 ? 3 : 2,
  duration: 6 + (index % 5),
  delay: (index % 8) * 0.65,
  drift: index % 2 === 0 ? 26 : -20,
}));

const ARC_PATHS = [
  "M-40 610 C 210 500 360 660 620 585",
  "M900 585 C 1140 500 1280 660 1500 540",
];

const STEAM_PATHS = [
  "M36 260 C 8 205 64 160 40 112 C 20 70 62 38 52 8",
  "M96 260 C 68 205 124 160 100 112 C 80 70 122 38 112 8",
  "M156 260 C 128 205 184 160 160 112 C 140 70 182 38 172 8",
];

/**
 * Painted night backdrop: warm oven glow, embers, steam, and the orange
 * swooshes that frame the pizza. Purely decorative.
 */
export function HeroAtmosphere() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_50%_12%,rgba(255,64,76,0.1),transparent_70%)] dark:bg-[radial-gradient(ellipse_65%_45%_at_50%_12%,rgba(255,64,76,0.18),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_48%_at_50%_82%,rgba(255,122,26,0.18),transparent_72%)] dark:bg-[radial-gradient(ellipse_55%_48%_at_50%_82%,rgba(255,122,26,0.32),transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,248,237,0.25),transparent_28%,transparent_62%,rgba(255,248,237,0.82))] dark:bg-[linear-gradient(to_bottom,rgba(7,8,10,0.35),transparent_28%,transparent_62%,rgba(7,8,10,0.9))]" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(124,45,18,0.12)_1px,transparent_1px)] bg-[size:26px_26px] opacity-25 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] dark:bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)]" />

      <svg
        className="absolute inset-x-0 bottom-0 h-[68%] w-full"
        viewBox="0 0 1440 700"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hero-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff8a00" stopOpacity="0" />
            <stop offset="45%" stopColor="#ffb340" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ARC_PATHS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            stroke="url(#hero-arc)"
            strokeWidth={index === 0 ? 5 : 3}
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: index === 0 ? 0.75 : 0.5 }}
            transition={{
              duration: 2.2,
              delay: 0.4 + index * 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              filter: "drop-shadow(0 0 14px rgba(255,138,0,0.55))",
            }}
          />
        ))}
      </svg>

      <div className="absolute top-[32%] left-[28%] hidden h-80 w-44 opacity-70 blur-[1px] sm:block sm:right-[20%] lg:right-[22%]">
        <svg viewBox="0 0 200 280" className="h-full w-full" fill="none">
          {STEAM_PATHS.map((path, index) => (
            <motion.path
              key={path}
              d={path}
              stroke="white"
              strokeWidth={index === 0 ? 11 : 7}
              strokeLinecap="round"
              style={{ filter: "blur(7px)" }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.16 }
                  : { opacity: [0, 0.22, 0], y: [14, -16, 14] }
              }
              transition={{
                duration: 6 + index,
                delay: index * 1.4,
                repeat: reduceMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      {EMBERS.map((ember, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[#ff9a1f]"
          style={{
            left: ember.left,
            top: ember.top,
            width: ember.size,
            height: ember.size,
            boxShadow: "0 0 10px rgba(255,154,31,0.9)",
          }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={
            reduceMotion
              ? { opacity: 0.5 }
              : {
                  y: [0, -92],
                  x: [0, ember.drift],
                  opacity: [0, 0.9, 0],
                  scale: [0.6, 1, 0.35],
                }
          }
          transition={{
            duration: ember.duration,
            delay: ember.delay,
            repeat: reduceMotion ? 0 : Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
