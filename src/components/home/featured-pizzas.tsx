import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/common/reveal";
import { MenuItemCard } from "@/components/menu/pizza-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serverApi } from "@/services/server";
import type { MenuItem } from "@/types/menu";

export async function FeaturedPizzas() {
  let menuItems: MenuItem[] = [];

  try {
    const all = await serverApi.menu.list();
    menuItems = all.slice(0, 6);
  } catch {
    menuItems = [];
  }

  if (menuItems.length === 0) return null;

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
          {menuItems.map((menuItem) => (
            <RevealItem
              key={menuItem._id}
              className="h-full w-85/100 xs:w-full"
            >
              <MenuItemCard menuItem={menuItem} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
