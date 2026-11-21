import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Sparkles, Star, Store } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/common/reveal";
import { FavoriteButton } from "@/components/menu/favorite-button";
import { MenuGallery } from "@/components/menu/menu-gallery";
import { OrderForm } from "@/components/menu/order-form";
import { ReviewForm } from "@/components/menu/review-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCategoryName } from "@/data/menu";
import { getCurrentUser } from "@/lib/authorization";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { serverApi } from "@/services/server";
import type { MenuItemDetail, MenuItemReview } from "@/types/menu";

export const dynamic = "force-dynamic";

function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  if (!isObjectId(id)) return { title: "Menu item not found" };

  try {
    const detail = await serverApi.menu.detail(id);
    return { title: detail.item.itemName, description: detail.item.description };
  } catch {
    return { title: "Menu item not found" };
  }
}

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-4",
            star <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function MenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isObjectId(id)) notFound();

  let detail: MenuItemDetail;

  try {
    detail = await serverApi.menu.detail(id);
  } catch {
    notFound();
  }

  const [viewer, reviews] = await Promise.all([
    getCurrentUser(),
    serverApi.menu.reviews(id).catch((): MenuItemReview[] => []),
  ]);

  const isCustomer = viewer?.role === "customer" && !viewer.blocked;
  const favoriteIds = isCustomer ? await serverApi.favorites.ids().catch(() => []) : [];
  const isFavorite = favoriteIds.includes(id);

  const { item, shop, rating } = detail;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to menu
      </Link>

      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <Reveal y={20}>
          <MenuGallery images={item.images} alt={item.itemName} />
        </Reveal>

        <Reveal className="flex flex-col" delay={0.1}>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase sm:text-[13px]">
            {getCategoryName(item.category)}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {item.itemName}
          </h1>

          {rating.count > 0 ? (
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Stars value={rating.average} />
              {rating.average.toFixed(1)} · {rating.count} review
              {rating.count === 1 ? "" : "s"}
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No reviews yet</p>
          )}

          <p className="mt-4 leading-relaxed text-muted-foreground">
            {item.description}
          </p>

          <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-[13px]">
            <MapPin className="size-4" aria-hidden />
            {item.shopName || "SliceStack partner"} ·{" "}
            {item.location || "Location not listed"}
          </p>

          <Separator className="my-6" />

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-semibold tracking-tight">
              {formatPrice(item.price)}
            </span>
            <span className="text-sm text-muted-foreground">per item</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isCustomer ? (
              <FavoriteButton
                menuItemId={item._id}
                initialFavorite={isFavorite}
              />
            ) : null}
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 gap-2 px-5",
              )}
            >
              Keep browsing
            </Link>
          </div>

          <div className="mt-6 grid gap-2.5 text-sm text-muted-foreground sm:text-[15px]">
            <p className="flex items-center gap-2">
              <Clock className="size-4 text-primary" aria-hidden />
              Delivery date is chosen when you place the order
            </p>
            <p className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Made fresh by the shop for every order
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="size-4 text-primary" aria-hidden />
                {shop?.name || item.shopName || "Shop"}
              </CardTitle>
              <CardDescription>
                {shop?.address || item.location || "Address not listed"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-3 text-sm">
              {shop?.logoUrl || item.logoUrl ? (
                <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                  <Image
                    src={shop?.logoUrl || item.logoUrl || ""}
                    alt=""
                    fill
                    sizes="48px"
                    unoptimized
                    className="object-cover"
                  />
                </span>
              ) : (
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Store className="size-5" aria-hidden />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {shop?.name || item.shopName || "SliceStack partner"}
                </p>
                <p className="truncate text-muted-foreground">
                  {shop?.phone || "Contact details unavailable"}
                </p>
              </div>
            </CardContent>
          </Card>

          {viewer?.role === "customer" ? (
            <OrderForm
              menuItemId={item._id}
              price={item.price}
              shopName={item.shopName || shop?.name || ""}
            />
          ) : viewer ? (
            <Card>
              <CardHeader>
                <CardTitle>Ordering is for customers</CardTitle>
                <CardDescription>
                  {viewer.role === "admin"
                    ? "Admin accounts cannot place customer orders."
                    : "Vendor accounts cannot place customer orders."}
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign in to order</CardTitle>
                <CardDescription>
                  Create a free customer account to place this order and track
                  its status.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Link
                  href={`/sign-in?next=${encodeURIComponent(`/menu/${item._id}`)}`}
                  className={buttonVariants()}
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className={buttonVariants({ variant: "outline" })}
                >
                  Create account
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              Reviews
              {rating.count > 0 ? (
                <Badge variant="secondary">
                  {rating.average.toFixed(1)} / 5 · {rating.count}
                </Badge>
              ) : null}
            </CardTitle>
            <CardDescription>
              {isCustomer
                ? "You can review this item once the shop accepts an order for it."
                : "Real reviews from customers who ordered this item."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {reviews.length === 0 ? (
              <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No reviews yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <li
                    key={review._id}
                    className="border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{review.customerName}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatReviewDate(review.createdAt)}
                      </span>
                    </div>
                    <Stars value={review.rating} className="mt-1" />
                    {review.comment ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}

            {isCustomer ? <ReviewForm menuItemId={item._id} /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
