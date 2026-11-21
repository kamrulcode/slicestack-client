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
        "group h-full gap-0 overflow-hidden [--card-spacing:0px] transition duration-300 ease-out hover:ring-primary/25 hover:shadow-xl hover:shadow-foreground/5 motion-safe:hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-5/4 overflow-hidden bg-secondary/60">
        {image ? (
          <Image
            src={image}
            alt={menuItem.itemName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <CardHeader className="gap-1.5 px-4 pt-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase sm:text-[13px]">
          {getCategoryName(menuItem.category)}
        </p>
        <CardTitle className="font-sans text-xl font-bold tracking-tight sm:text-[22px]">
          {menuItem.itemName}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 pt-2">
        <div className="flex items-center gap-2">
          {menuItem.logoUrl ? (
            <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-secondary">
              <Image
                src={menuItem.logoUrl}
                alt=""
                fill
                sizes="24px"
                unoptimized
                className="object-cover"
              />
            </span>
          ) : (
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-[0.7rem] font-bold text-primary">
              <Store className="size-3" aria-hidden />
            </span>
          )}
          <span className="truncate text-xs font-medium text-muted-foreground sm:text-[13px]">
            {menuItem.shopName || "SliceStack partner"}
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground sm:text-[13px]">
          <MapPin className="size-3.5" aria-hidden />
          {menuItem.location || "Location not listed"}
        </p>
      </CardContent>

      <CardFooter className="mt-4 justify-between border-t bg-muted/30 px-4 py-3">
        <p className="font-heading text-xl font-semibold tracking-tight">
          {formatPrice(menuItem.price)}
        </p>
        <Link
          href={`/menu/${menuItem._id}`}
          aria-label={`View details for ${menuItem.itemName}`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1.5",
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
