"use client";

import { useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/common/section-heading";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  text: string;
  name: string;
  initials: string;
  meta: string;
};

const reviews: Review[] = [
  {
    id: "sarah-johnson",
    rating: 5,
    text: "The pepperoni cups crisp up at the edges and the crust still has that proper chew. It turned up hot, the box was intact, and it disappeared in about four minutes.",
    name: "Sarah Johnson",
    initials: "SJ",
    meta: "Pepperoni regular",
  },
  {
    id: "michael-smith",
    rating: 5,
    text: "Ordered the Garden Fresh for a family dinner and even the kids asked for seconds. Fresh basil, real mozzarella, and reordering took two taps on the app.",
    name: "Michael Smith",
    initials: "MS",
    meta: "Family orders, every Friday",
  },
  {
    id: "aisha-rahman",
    rating: 5,
    text: "The Cheese Burst is dangerously good — gooey centre, blistered crust, and the garlic dip is worth the extra. Delivery beat the estimate as well.",
    name: "Aisha Rahman",
    initials: "AR",
    meta: "Cheese Burst devotee",
  },
  {
    id: "daniel-okafor",
    rating: 4,
    text: "Picked one up on the way home and it was still steaming when I opened the box. My only regret is not ordering two — the truffle mushroom goes fast.",
    name: "Daniel Okafor",
    initials: "DO",
    meta: "Counter pickup",
  },
];

export default function CustomerReviews() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

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
        <SectionHeading
          title="What our guests are saying"
          description="Real notes from real pizza nights — no paid reviews, just regulars."
          align="center"
        />

        <div className="mx-auto mt-10 max-w-3xl">
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
        </div>
      </div>
    </section>
  );
}
