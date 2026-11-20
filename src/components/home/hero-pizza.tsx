"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/**
 * The hero pizza. It eases in from below, drifts gently while idle, and moves
 * on a shallow scroll parallax so the composition feels layered.
 */
export function HeroPizza() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const parallax = useTransform(scrollYProgress, [0, 1], [46, -54]);
  const y = useSpring(parallax, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });

  return (
    <div
      ref={ref}
      className="relative z-10 mx-auto -mt-2 w-[145vw] max-w-none sm:mt-0 sm:w-[118vw] lg:mt-3 lg:w-[min(820px,86vw)] xl:mt-4 xl:w-[min(900px,86vw)]"
    >
      <motion.div style={reduceMotion ? undefined : { y }}>
        <motion.div
          initial={
            reduceMotion
              ? false
              : { opacity: 0, y: 80, scale: 0.9, rotate: -1.5 }
          }
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          transition={{
            duration: 1.3,
            delay: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute inset-x-[16%] bottom-[10%] h-[30%] rounded-[50%] bg-[#ff7a1a]/25 blur-[80px]"
          />
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/hero-image.png"
              alt="A whole SliceStack pizza with a cheese-pull slice being lifted"
              width={1534}
              height={1025}
              priority
              sizes="(min-width: 1280px) 1080px, 150vw"
              className="h-auto w-full drop-shadow-[0_45px_70px_rgba(0,0,0,0.6)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
