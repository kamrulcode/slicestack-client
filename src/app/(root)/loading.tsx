"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export default function Loading({ isLoading = true }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center
          bg-[#100b09]/70 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Logo Animation */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/logo.webp"
                alt="SliceStack"
                width={150}
                height={150}
                priority
                className="h-28 w-auto object-contain"
              />
            </motion.div>

            {/* Loading Bar */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-1 w-32 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full w-1/2 rounded-full bg-gradient-to-r from-[#FFB340] to-[#FF404C]"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              <p className="text-xs font-medium tracking-[0.25em] text-white/70">
                FRESHNESS IS LOADING...
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
