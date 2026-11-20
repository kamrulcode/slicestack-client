"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

/** Shared easing so every reveal feels like part of the same system. */
const EASE = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, amount: 0.2 } as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before the animation starts, in seconds. */
  delay?: number;
  /** Distance (px) the element travels up from. */
  y?: number;
  duration?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
};

/**
 * Single-element entrance: fades in and slides up once, the first time it
 * enters the viewport. Only opacity and transform are animated, so nothing
 * shifts layout.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.7,
  amount = VIEWPORT.amount,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  /** Gap between each child's entrance, in seconds. */
  stagger?: number;
  delay?: number;
  amount?: number;
};

/**
 * Parent for staggered lists and grids. Pair with `RevealItem` children; the
 * parent only orchestrates timing, so give it the layout classes (`grid`,
 * `flex`, gaps) that the container needs.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  amount = 0.15,
}: RevealGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  duration?: number;
};

/** A staggered child of `RevealGroup`. */
export function RevealItem({
  children,
  className,
  y = 24,
  duration = 0.6,
}: RevealItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
