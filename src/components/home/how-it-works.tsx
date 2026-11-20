import { Flame, Pizza, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";

const steps: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Pizza,
    title: "Pick your slice",
    description:
      "Browse the menu and choose from classic, veggie and specialty pies.",
  },
  {
    icon: Flame,
    title: "We fire it up",
    description:
      "Hand-tossed dough, fresh toppings and a stone-baked finish, every time.",
  },
  {
    icon: Truck,
    title: "Delivered hot",
    description:
      "Straight from the oven to your door in about 30 minutes, still steaming.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            title="From our oven to your door"
            description="Three simple steps between you and your next favorite slice."
            align="center"
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <RevealItem key={step.title} className="h-full">
                <div className="relative h-full rounded-2xl border bg-card p-6 shadow-xs transition duration-300 hover:border-primary/25 hover:shadow-md motion-safe:hover:-translate-y-1">
                  <span
                    className="absolute top-4 right-5 font-heading text-4xl font-semibold text-primary/15"
                    aria-hidden
                  >
                    0{index + 1}
                  </span>
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-sans text-[1.375rem] font-bold sm:text-[1.625rem]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {step.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
