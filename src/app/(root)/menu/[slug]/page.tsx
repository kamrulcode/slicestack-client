import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Sparkles } from "lucide-react";
import Image from "next/image";
import { Reveal } from "@/components/common/reveal";
import { AddToOrderButton } from "@/components/menu/add-to-order-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCategoryName } from "@/data/menu";
import { getPublicMenuItems } from "@/data/action/getData";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/menu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const menuItems = await getPublicMenuItems();
  const menuItem = menuItems.find((item) => item._id === slug);

  if (!menuItem) {
    return { title: "Menu item not found" };
  }

  return {
    title: menuItem.itemName,
    description: menuItem.description,
  };
}

export default async function MenuItemPage({
  params,
}: PageProps<"/menu/[slug]">) {
  const { slug } = await params;
  const menuItems = await getPublicMenuItems();
  const menuItem = menuItems.find((item) => item._id === slug);

  if (!menuItem) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to menu
      </Link>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        <Reveal y={20}>
          <div className="relative overflow-hidden rounded-3xl border bg-secondary/40 shadow-sm">
            <div className="relative aspect-[5/4]">
              <Image
                src={menuItem.images[0]}
                alt={menuItem.itemName}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                unoptimized
                className="object-cover"
              />
            </div>
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 shadow-sm backdrop-blur"
            >
              {getCategoryName(menuItem.category)}
            </Badge>
          </div>
        </Reveal>

        <Reveal className="flex flex-col" delay={0.1}>
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase sm:text-[13px]">
            {getCategoryName(menuItem.category)}
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {menuItem.itemName}
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {menuItem.description}
          </p>

          <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-[13px]">
            <MapPin className="size-4" aria-hidden />
            {menuItem.shopName ?? "SliceStack partner"} ·{" "}
            {menuItem.location ?? "Location not listed"}
          </p>

          <Separator className="my-6" />

          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-semibold tracking-tight">
              {formatPrice(menuItem.price)}
            </span>
            <span className="text-sm text-muted-foreground">per item</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <AddToOrderButton price={menuItem.price} />
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
              Freshly made to order · 30–40 min delivery
            </p>
            <p className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Made with fresh, locally sourced ingredients
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
