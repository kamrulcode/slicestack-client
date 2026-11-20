import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { PizzaArt } from "@/components/brand/pizza-art";
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
import type { Pizza } from "@/types/menu";

export function PizzaCard({
  pizza,
  className,
}: {
  pizza: Pizza;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group h-full gap-0 overflow-hidden [--card-spacing:0px] transition duration-300 ease-out hover:ring-primary/25 hover:shadow-xl hover:shadow-foreground/5 motion-safe:hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative aspect-[5/4] overflow-hidden bg-secondary/60">
        <PizzaArt
          variant={pizza.art}
          className="transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.04]"
        />
      </div>

      <CardHeader className="gap-1.5 px-4 pt-4">
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase sm:text-[13px]">
          {getCategoryName(pizza.categoryId)}
        </p>
        <CardTitle className="font-sans text-xl font-bold tracking-tight sm:text-[22px]">
          {pizza.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 px-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 font-heading text-[0.7rem] font-bold text-primary">
            S
          </span>
          <span className="text-xs font-medium text-muted-foreground sm:text-[13px]">
            SliceStack partner
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground sm:text-[13px]">
          <MapPin className="size-3.5" aria-hidden />
          Location not listed
        </p>
      </CardContent>

      <CardFooter className="mt-4 justify-between border-t bg-muted/30 px-4 py-3">
        <p className="font-heading text-xl font-semibold tracking-tight">
          {formatPrice(pizza.price)}
        </p>
        <Link
          href={`/menu/${pizza.slug}`}
          aria-label={`View details for ${pizza.name}`}
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
