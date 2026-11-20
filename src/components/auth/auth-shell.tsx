import type { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "@/components/brand/logo";
import { Reveal } from "@/components/common/reveal";

type AuthShellProps = {
  image: {
    src: string;
    alt: string;
  };
  children: ReactNode;
};

/**
 * Split auth layout: a fixed brand panel on the left and the form on a warm
 * canvas to the right. The brand panel is desktop-only; small screens get the
 * compact logo above the form.
 */
export function AuthShell({ image, children }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
      <aside className="hidden flex-col bg-brand-ink px-12 py-12 text-white lg:flex xl:px-18 xl:py-14">
        <Logo size="md" />

        <Reveal className="mt-20 max-w-125 xl:mt-36" y={16}>
          <h1 className="font-heading text-[2.75rem] leading-[1.15] font-bold tracking-tight xl:text-5xl">
            Good food.
            <br />
            <span className="text-auth-accent">Great mood.</span>
          </h1>

          <p className="mt-5 text-base leading-relaxed text-white/65 xl:mt-6">
            A better pizza moment is just a few clicks away.
          </p>

          <div className="relative mt-10 aspect-3/2 overflow-hidden rounded-lg bg-white/5 xl:mt-12">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1024px) 500px, 100vw"
              className="object-cover"
            />
          </div>

          <p className="mt-10 text-sm font-semibold text-white/90">
            Freshly made. Thoughtfully delivered.
          </p>
        </Reveal>
      </aside>

      <main className="flex justify-center bg-auth-canvas px-5 py-12 sm:px-8 lg:px-16 lg:pt-28 lg:pb-20 xl:px-24">
        <Reveal className="w-full max-w-142.5" delay={0.06} y={20}>
          <Logo size="sm" className="mb-10 text-foreground lg:hidden" />
          {children}
        </Reveal>
      </main>
    </div>
  );
}
