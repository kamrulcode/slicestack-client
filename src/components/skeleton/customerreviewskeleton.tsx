import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ReviewCarouselSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {[1, 2, 3].map((item) => (
            <CarouselItem key={item}>
              <figure className="flex h-full min-h-[360px] flex-col items-center rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-xs sm:px-12 sm:py-10">
                {/* Quote icon */}
                <Skeleton className="size-7 rounded-md" />

                {/* Rating stars */}
                <div className="mt-5 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="size-4 rounded-sm" />
                  ))}
                </div>

                {/* Review text */}
                <div className="mt-7 flex w-full flex-col items-center gap-3">
                  <Skeleton className="h-4 w-[95%] max-w-lg" />
                  <Skeleton className="h-4 w-[88%] max-w-md" />
                  <Skeleton className="h-4 w-[92%] max-w-lg" />
                  <Skeleton className="h-4 w-[60%] max-w-sm" />
                </div>

                {/* Customer information */}
                <figcaption className="mt-auto flex items-center gap-3 pt-10">
                  <Skeleton className="size-11 shrink-0 rounded-full" />

                  <div className="flex flex-col items-start gap-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="flex size-9 items-center justify-center rounded-full border border-border">
            <ChevronLeft className="size-4 text-muted-foreground/30" />
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-2 w-6 rounded-full" />
            <Skeleton className="size-2 rounded-full" />
            <Skeleton className="size-2 rounded-full" />
          </div>

          <div className="flex size-9 items-center justify-center rounded-full border border-border">
            <ChevronRight className="size-4 text-muted-foreground/30" />
          </div>
        </div>
      </Carousel>
    </div>
  );
}
