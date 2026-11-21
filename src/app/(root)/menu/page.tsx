import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { buttonVariants } from "@/components/ui/button";
import { getMenuItemsByCategory, menuCategories } from "@/data/menu";
import { getPublicMenuItems } from "@/data/action/getData";
import { MenuItemCard } from "@/components/menu/pizza-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Explore classic, vegetarian, meat lovers and specialty pizzas from SliceStack.",
};

export default async function MenuPage() {
  const menuItems = await getPublicMenuItems();
  const groups = menuCategories
    .map((category) => ({
      category,
      items: getMenuItemsByCategory(menuItems, category.name),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <Reveal className="max-w-2xl">
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
      </Reveal>

      <Reveal className="mt-8 flex flex-wrap gap-2" delay={0.08}>
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
      </Reveal>

      <div className="mt-14 space-y-16">
        {groups.length === 0 && (
          <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
            No menu items are available right now. Please check back soon.
          </p>
        )}
        {groups.map(({ category, items }) => (
          <Reveal key={category.id}>
            <section id={category.id} className="scroll-mt-24">
              <SectionHeading
                title={category.name}
                description={category.blurb}
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuItemCard key={item._id} menuItem={item} />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
