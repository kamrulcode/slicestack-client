import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { buttonVariants } from "@/components/ui/button";
import {
  getPizzasByCategory,
  menuCategories,
  pizzaCategoryOrder,
} from "@/data/menu";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Explore classic, vegetarian, meat lovers and specialty pizzas from SliceStack.",
};

export default function MenuPage() {
  const groups = pizzaCategoryOrder.flatMap((id) => {
    const category = menuCategories.find((item) => item.id === id);
    const items = getPizzasByCategory(id);

    return category && items.length > 0 ? [{ category, items }] : [];
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase sm:text-[13px]">
          Browse menu
        </p>
        <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Find your next favorite slice
        </h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          Hand-tossed dough, fresh toppings and a stone-baked finish. Pick a
          category or scroll the whole menu.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {groups.map(({ category }) => (
          <Link
            key={category.id}
            href={`#${category.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5",
            )}
          >
            <span aria-hidden>{category.emoji}</span>
            {category.name}
          </Link>
        ))}
      </div>

      <div className="mt-14 space-y-16">
        {groups.map(({ category }) => (
          <section key={category.id} id={category.id} className="scroll-mt-24">
            <SectionHeading
              title={category.name}
              description={category.blurb}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
