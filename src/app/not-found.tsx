"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Home, Pizza } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-5 py-16 text-center">
      {/* Background Decorations */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-[#ffb340]/10 blur-3xl"
      />

      <motion.div
        animate={shouldReduceMotion ? {} : { y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 bottom-20 size-72 rounded-full bg-[#ff404c]/10 blur-3xl"
      />

      {/* Animated 404 Illustration */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-center py-12"
      >
        {/* Background 404 */}
        <div className="relative flex items-center justify-center">
          <motion.h2
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="select-none text-[clamp(8rem,27vw,19rem)] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#ffb340] via-[#ff8a24] to-[#ff404c]"
          >
            404
          </motion.h2>

          {/* Animated Pizza Slice */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, -18, 0],
                    rotate: [-8, 8, -8],
                  }
            }
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ffb340]/30 bg-background/90 shadow-2xl shadow-[#ff404c]/20 backdrop-blur-md sm:size-40"
          >
            <Pizza
              strokeWidth={1.5}
              className="size-16 text-[#ff404c] drop-shadow-lg sm:size-24"
            />
          </motion.div>

          {/* Floating Pepperoni Decorations */}
          {[
            "left-[8%] top-[15%]",
            "right-[12%] top-[20%]",
            "left-[18%] bottom-[12%]",
            "right-[20%] bottom-[10%]",
          ].map((position, index) => (
            <motion.div
              key={index}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [0, -15, 0],
                      rotate: [0, 180, 360],
                    }
              }
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
              className={`absolute ${position} size-3 rounded-full border-2 border-[#ff404c]/70 bg-[#ff404c] shadow-md sm:size-5`}
            />
          ))}

          {/* Sparkles */}
          {[0, 1, 2].map((item) => (
            <motion.div
              key={item}
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [0.7, 1.3, 0.7],
                      opacity: [0.3, 1, 0.3],
                    }
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: item * 0.6,
              }}
              className={`absolute ${
                [
                  "left-[25%] top-[5%]",
                  "right-[25%] top-[8%]",
                  "right-[5%] bottom-[30%]",
                ][item]
              } size-3 rotate-45 bg-[#ffb340]`}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.15 },
          },
        }}
        className="-mt-2 relative z-10 max-w-xl"
      >
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold tracking-tight sm:text-5xl"
        >
          Page <span className="text-[#ff404c]">Not</span> Found!
        </motion.h1>

        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-4 text-sm leading-7 text-muted-foreground sm:text-lg"
        >
          Oops! Looks like this slice is missing. The page you are looking for
          doesn't exist or may have been moved.
        </motion.p>

        {/* Home Button */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: "lg" }),
              "group h-12 rounded-full border-0 bg-gradient-to-r from-[#ffb340] to-[#ff404c] px-8 text-white shadow-lg shadow-[#ff404c]/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#ff404c]/30",
            )}
          >
            <Home className="mr-2 size-4" />
            Go to Home
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-5"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-[#ff404c]"
          >
            <ArrowLeft className="size-4" />
            Explore our menu instead
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
