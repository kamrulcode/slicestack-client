"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MenuGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const total = images.length;
  const current = images[active] ?? images[0];

  function move(step: number) {
    if (total < 2) return;
    setActive((index) => (index + step + total) % total);
  }

  return (
    <div>
      <div className="relative aspect-5/4 overflow-hidden rounded-3xl border bg-secondary/40 shadow-sm">
        {current ? (
          <Image
            src={current}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            unoptimized
            className="object-cover"
            priority
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        {total > 1 ? (
          <>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Previous image"
              onClick={() => move(-1)}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full shadow-sm"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              aria-label="Next image"
              onClick={() => move(1)}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full shadow-sm"
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
            <span className="absolute right-3 bottom-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
              {active + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-secondary/40 transition",
                index === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-75 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="96px"
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
