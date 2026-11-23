import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { MenuFilters } from "@/components/menu/menu-filters";
import { MenuItemCard } from "@/components/menu/pizza-card";
import { buttonVariants } from "@/components/ui/button";
import { menuCategories } from "@/data/menu";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { MenuItem } from "@/types/menu";

export const metadata: Metadata = {
  title: "Browse Menu",
  description:
    "Explore classic, vegetarian, meat lovers and specialty pizzas from SliceStack.",
};

export const dynamic = "force-dynamic";

function readParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function MenuPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const search = readParam(params.search)?.trim();
  const category = readParam(params.category);
  const location = readParam(params.location)?.trim();
  const hasFilters = Boolean(search || category || location);

  let menuItems: MenuItem[] = [];
  let loadError: string | null = null;

  try {
    menuItems = await serverApi.menu.list({ search, category, location });
  } catch (error) {
    loadError = errorMessage(error);
  }

  const groups = menuCategories
    .map((menuCategory) => ({
      category: menuCategory,
      items: menuItems.filter((item) => item.category === menuCategory.name),
    }))
    .filter(({ items }) => items.length > 0);
  const categoryAnchorByItemId = groups.reduce(
    (anchors, { category, items }) => {
      const firstItem = items[0];
      if (firstItem) anchors.set(firstItem._id, category.id);
      return anchors;
    },
    new Map<string, string>(),
  );

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
          Search, filter by category or location, and order from local shops.
        </p>
      </Reveal>

      <div className="mt-8">
        <MenuFilters
          key={`${search ?? ""}|${category ?? ""}|${location ?? ""}`}
        />
      </div>

      {loadError ? (
        <div className="mt-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertTriangle
            className="mx-auto size-8 text-destructive"
            aria-hidden
          />
          <h2 className="mt-3 font-heading text-xl font-semibold">
            We could not load the menu
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
          <Link
            href="/menu"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-4",
            })}
          >
            Try again
          </Link>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed px-6 py-14 text-center">
          <p className="font-heading text-xl font-semibold">
            {hasFilters ? "No dishes match those filters" : "No menu items yet"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasFilters
              ? "Try another category, location or search term."
              : "Approved dishes from our vendors will appear here as soon as they are published."}
          </p>
          {hasFilters ? (
            <Link
              href="/menu"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "mt-4",
              })}
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {groups.map(({ category: itemCategory }) => (
              <div
                key={itemCategory.id}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <span aria-hidden>{itemCategory.emoji}</span>
                {itemCategory.name}
              </div>
            ))}
          </div>

          <Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <div
                  key={item._id}
                  id={categoryAnchorByItemId.get(item._id)}
                  className="h-full scroll-mt-24"
                >
                  <MenuItemCard menuItem={item} />
                </div>
              ))}
            </div>
          </Reveal>
        </>
      )}
    </div>
  );
}
