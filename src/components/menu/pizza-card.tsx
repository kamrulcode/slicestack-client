"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Heart, Loader2, MapPin, Store } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Card } from "@/components/ui/card";
import { getCategoryName } from "@/data/menu";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types/menu";
import { buttonVariants } from "../ui/button";
import { favoriteService } from "@/services/favorites.service";
import { errorMessage } from "@/lib/api/client";

export function MenuItemCard({
  menuItem,
  className,
}: {
  menuItem: MenuItem;
  className?: string;
}) {
  // Better Auth session
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoritePending, setIsFavoritePending] = useState(false);

  const image = menuItem.images?.[0];
  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role;
  const isCustomer = Boolean(user && userRole === "customer");

  useEffect(() => {
    if (!isCustomer) {
      return;
    }

    let cancelled = false;
    favoriteService
      .ids()
      .then((favoriteIds) => {
        if (!cancelled) {
          setIsFavorite(favoriteIds.includes(menuItem._id));
        }
      })
      .catch(() => {
        if (!cancelled) setIsFavorite(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isCustomer, menuItem._id]);

  async function toggleFavorite() {
    if (isFavoritePending) return;

    setIsFavoritePending(true);
    try {
      if (isFavorite) {
        await favoriteService.remove(menuItem._id);
        setIsFavorite(false);
        toast.success("Removed from favorites.");
      } else {
        await favoriteService.add(menuItem._id);
        setIsFavorite(true);
        toast.success("Saved to favorites.");
      }
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsFavoritePending(false);
    }
  }

  // Actual shop owner name should come from the menu item data.
  const ownerName = menuItem.shopName || "SliceStack Partner";

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-0 overflow-hidden",
        "rounded-[24px] border border-border/70 bg-card p-0",
        "shadow-sm transition-all duration-500 ease-out",
        "hover:-translate-y-2 hover:border-primary/40",
        "hover:shadow-xl hover:shadow-primary/10",
        className,
      )}
    >
      {/* Pizza Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={menuItem.itemName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-linear-to-br from-muted via-secondary to-primary/10">
            <Store className="size-16 text-muted-foreground/40" />
          </div>
        )}

        {/* Image Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10" />

        {/* Category */}
        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white shadow-lg backdrop-blur-md">
            {getCategoryName(menuItem.category)}
          </span>
        </div>

        {/* Favorite Button */}
        {isCustomer ? (
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
            disabled={isFavoritePending}
            className={cn(
              "absolute right-4 top-4 grid size-10 place-items-center",
              "rounded-full border border-white/30 bg-black/35",
              "text-white backdrop-blur-md transition-all duration-300",
              "hover:scale-110 hover:bg-white hover:text-rose-500",
              "active:scale-90",
              isFavorite && "bg-white text-rose-500",
            )}
          >
            {isFavoritePending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "size-5 transition-all duration-300",
                  isFavorite && "scale-110 fill-current",
                )}
              />
            )}
          </button>
        ) : null}

        {/* Image Bottom Accent */}
        <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Pizza Name + Price */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 line-clamp-2 text-lg font-extrabold leading-snug tracking-tight text-card-foreground transition-colors group-hover:text-primary sm:text-xl">
            {menuItem.itemName}
          </h3>

          <div className="shrink-0 rounded-xl bg-primary/10 px-4 py-1 text-right">
            <p className="whitespace-nowrap text-lg font-extrabold tracking-tight text-primary">
              {formatPrice(menuItem.price)}
            </p>
          </div>
        </div>

        {/* Shop Owner */}
        <div className="mt-4 flex items-center gap-2.5">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground">
            <Store className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Shop owner
            </p>
            <p className="truncate text-sm font-semibold text-card-foreground">
              {ownerName}
            </p>
          </div>

          {user && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
              {isPending ? "Loading..." : "Welcome"}
            </span>
          )}
        </div>

        {/* Location */}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2.5">
          <MapPin className="size-4 shrink-0 text-primary" />

          <span className="truncate text-xs font-medium text-muted-foreground">
            {menuItem.location || "Location not listed"}
          </span>
        </div>

        {/* Flexible Space */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-5 border-t border-border/70 pt-4">
          <Link
            href={`/menu/${menuItem._id}`}
            aria-label={`View details for ${menuItem.itemName}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "group/btn relative flex h-12 w-full items-center justify-center gap-2  rounded-full",
            )}
          >
            <span>View Details</span>

            <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
