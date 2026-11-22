import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryName } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";

export function MenuItemCard({
  menuItem,
  className,
}: {
  menuItem: MenuItem;
  className?: string;
}) {
  const image = menuItem.images?.[0];

  return (
    <Card
      className={cn(
        "group h-full gap-0 overflow-hidden rounded-3xl border border-border/70 bg-card p-0 [--card-spacing:0px] ring-1 ring-foreground/5 transition duration-300 ease-out hover:border-primary/35 hover:shadow-xl hover:shadow-foreground/10 motion-safe:hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-secondary/60 ">
        {image ? (
          <Image
            src={image}
            alt={menuItem.itemName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform  duration-700 ease-out motion-safe:group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-secondary via-background to-accent/25">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="grid size-14 place-items-center rounded-2xl bg-card/80 text-primary shadow-sm">
                <Store className="size-6" aria-hidden />
              </span>
              <span className="text-xs font-medium">Fresh from the oven</span>
            </div>
          </div>
        )}
        {image ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80"
          />
        ) : null}
        <span className="absolute top-4 left-4 rounded-full border border-border/60 bg-card/90 px-3 py-1 text-[11px] font-bold tracking-wide text-card-foreground shadow-sm backdrop-blur-md">
          {getCategoryName(menuItem.category)}
        </span>
        <span className="absolute right-4 bottom-4 rounded-xl border border-white/40 bg-card/95 px-3 py-1.5 font-heading text-base font-bold text-card-foreground shadow-lg backdrop-blur-md">
          {formatPrice(menuItem.price)}
        </span>
      </div>

      <CardHeader className="gap-1 px-4 pt-4 sm:px-5 sm:pt-5">
        <CardTitle className="line-clamp-2 min-h-12 font-sans text-xl font-bold tracking-tight sm:text-[22px]">
          {menuItem.itemName}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 pt-3 sm:px-5">
        <div className="flex items-center gap-2">
          {menuItem.logoUrl ? (
            <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-secondary border border-foreground">
              <Image
                src={menuItem.logoUrl}
                alt=""
                fill
                sizes="28px"
                unoptimized
                className="object-cover "
              />
            </span>
          ) : (
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-[0.7rem] font-bold text-primary">
              <Store className="size-3" aria-hidden />
            </span>
          )}
          <div className="flex gap-2">
            <span className="truncate text-xs font-medium text-muted-foreground sm:text-base">
              {menuItem.shopName || "SliceStack partner"}
            </span>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-[13px]">
          <MapPin className="size-3.5 shrink-0 text-ember" aria-hidden />
          {menuItem.location || "Location not listed"}
        </p>
      </CardContent>

      <CardFooter className="mt-5 border-t border-border/70 bg-transparent p-4 sm:px-5">
        <Link
          href={`/menu/${menuItem._id}`}
          aria-label={`View details for ${menuItem.itemName}`}
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "group/cta h-13 gap-2.5 rounded-full bg-primary px-7 text-[15px] tracking-wide text-foreground transition-transform duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-9 sm:text-bas w-full",
          )}
        >
          View Details
          <ArrowRight
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </CardFooter>
    </Card>
  );
}
