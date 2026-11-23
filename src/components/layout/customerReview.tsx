"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { menuService } from "@/services/menu.service";
import type { MenuItemReview } from "@/types/menu";

type Review = {
  id: string;
  rating: number;
  text: string;
  name: string;
  initials: string;
  meta: string;
  customerImage: string | null;
};

export default function CustomerReviews() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReviews() {
      try {
        const items = await menuService.list();
        const itemNames = new Map(
          items.map((item) => [item._id, item.itemName]),
        );
        const results = await Promise.all(
          items.map(async (item) => {
            try {
              return await menuService.reviews(item._id);
            } catch {
              return [] as MenuItemReview[];
            }
          }),
        );
        const merged = results
          .flat()
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .map((review) => {
            const name = review.customerName?.trim() || "Verified guest";
            const initials = name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");

            return {
              id: review._id,
              rating: review.rating,
              text: review.comment?.trim() || "A great SliceStack experience.",
              name,
              customerImage: review.customerImage || null,
              initials: initials || "G",
              meta: itemNames.get(review.menuItemId) || "Verified order",
            };
          });

        if (!cancelled) setReviews(merged);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadReviews();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!api) return;

    const sync = () => setCurrent(api.selectedScrollSnap());
    const frame = window.requestAnimationFrame(sync);

    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      window.cancelAnimationFrame(frame);
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-t border-border/60 bg-secondary/30"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            title="What our guests are saying"
            description="Real notes from real pizza nights — no paid reviews, just regulars."
            align="center"
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl" delay={0.1}>
          {isLoading ? (
            <div className="rounded-3xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-xs sm:px-12">
              Loading guest reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-3xl border bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-xs sm:px-12">
              No guest reviews yet.
            </div>
          ) : (
            <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {reviews.map((review) => (
                  <CarouselItem key={review.id}>
                    <figure className="flex h-full flex-col items-center rounded-3xl border bg-card px-6 py-8 text-center shadow-xs sm:px-12 sm:py-10">
                      <Quote
                        className="size-7 text-primary/30"
                        aria-hidden
                        strokeWidth={1.5}
                      />

                      <div
                        className="mt-4 flex items-center justify-center gap-0.5"
                        role="img"
                        aria-label={`Rated ${review.rating} out of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            aria-hidden
                            className={cn(
                              "size-4",
                              index < review.rating
                                ? "fill-primary text-primary"
                                : "fill-transparent text-foreground/20",
                            )}
                          />
                        ))}
                      </div>

                      <blockquote className="mt-5 text-[15px] leading-relaxed text-pretty text-foreground/90 sm:text-lg sm:leading-8">
                        &ldquo;{review.text}&rdquo;
                      </blockquote>

                      <figcaption className="mt-auto flex items-center gap-3 pt-8">
                        <Avatar className="size-11">
                          {review.customerImage ? (
                            <AvatarImage
                              src={review.customerImage}
                              alt={review.name}
                            />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 font-heading text-sm font-semibold text-primary">
                            {review.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="font-heading text-[17px] font-semibold">
                            {review.name}
                          </p>
                          <p className="text-xs text-muted-foreground sm:text-[13px]">
                            {review.meta}
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="mt-8 flex items-center justify-center gap-4">
                <CarouselPrevious
                  size="icon"
                  className="static size-9 border-border bg-background text-foreground shadow-xs hover:bg-muted"
                />

                <div className="flex items-center gap-1">
                  {reviews.map((review, index) => (
                    <button
                      key={review.id}
                      type="button"
                      onClick={() => api?.scrollTo(index)}
                      aria-label={`Show review ${index + 1} of ${reviews.length}`}
                      aria-current={current === index ? "true" : undefined}
                      className="group grid size-6 place-items-center"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          current === index
                            ? "w-6 bg-primary"
                            : "w-2 bg-foreground/20 group-hover:bg-foreground/40",
                        )}
                      />
                    </button>
                  ))}
                </div>

                <CarouselNext
                  size="icon"
                  className="static size-9 border-border bg-background text-foreground shadow-xs hover:bg-muted"
                />
              </div>
            </Carousel>
          )}
        </Reveal>
      </div>
    </section>
  );
}
