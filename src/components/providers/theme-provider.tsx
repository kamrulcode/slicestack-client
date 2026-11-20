"use client";

import type { ComponentProps } from "react";
import { MotionConfig } from "motion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {/* Honour the OS "reduce motion" setting for every animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
