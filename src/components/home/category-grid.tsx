import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { menuCategories } from "@/data/menu";
import { cn } from "@/lib/utils";
import type { MenuCategoryId } from "@/types/menu";

const tint: Record<MenuCategoryId, string> = {
  classic:
    "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  vegetarian:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  "meat-lovers":
    "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  specialty:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  sides:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/15 dark:text-yellow-300",
  beverages: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
};

export function CategoryGrid() {
  return (
    <section
      id="categories"
      className="scroll-mt-24 border-y border-border/60 bg-secondary/30"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading
          title="Find your kind of slice"
          description="Explore the menu by the flavors you love."
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {menuCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-xs transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl text-xl",
                  tint[category.id],
                )}
                aria-hidden
              >
                {category.emoji}
              </span>
              <span className="flex-1 text-[15px] font-semibold sm:text-base">
                {category.name}
              </span>
              <ArrowRight
                className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
