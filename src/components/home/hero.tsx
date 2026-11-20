import { HeroAtmosphere } from "@/components/home/hero-atmosphere";
import { HeroCopy } from "@/components/home/hero-copy";
import { HeroFloaters } from "@/components/home/hero-floaters";
import { HeroPizza } from "@/components/home/hero-pizza";

/**
 * Cinematic hero: a night-oven backdrop, centred copy, and the cheese-pull
 * pizza rising from the bottom of the frame.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff8ed] text-foreground dark:bg-[#07080a] dark:text-white">
      <HeroAtmosphere />
      <HeroFloaters />

      <div className="relative z-30 px-4 pt-10 sm:px-6 sm:pt-12 lg:pt-16">
        <HeroCopy />
      </div>

      <div className="relative z-10 -mt-70">
        <HeroPizza />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-linear-to-t from-[#fff8ed] via-[#fff8ed]/60 to-transparent dark:from-[#07080a] dark:via-[#07080a]/60"
      />
    </section>
  );
}
