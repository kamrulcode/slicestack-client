import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { PizzaCard } from "@/components/menu/pizza-card";
import { buttonVariants } from "@/components/ui/button";
import { pizzas } from "@/data/menu";
import { cn } from "@/lib/utils";

export function FeaturedPizzas() {
  return (
    <section id="menu" className="scroll-mt-24">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            title="Fan favorites, made fresh"
            description="A few delicious picks to get your next order started."
            action={
              <Link
                href="/menu"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "gap-1.5 text-primary hover:text-primary",
                )}
              >
                View all menu
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            }
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pizzas.map((pizza) => (
            <RevealItem key={pizza.slug} className="h-full">
              <PizzaCard pizza={pizza} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
