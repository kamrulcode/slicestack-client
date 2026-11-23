import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Back Navigation */}
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 animate-pulse rounded-full" />
        <Skeleton className="h-4 w-24 animate-pulse" />
      </div>

      {/* Main Product Section */}
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Image */}
          <Skeleton className="aspect-[4/3] w-full animate-pulse rounded-3xl" />

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-square w-full animate-pulse rounded-xl"
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="flex flex-col">
          {/* Category */}
          <Skeleton className="h-3 w-28 animate-pulse" />

          {/* Product Title */}
          <Skeleton className="mt-4 h-10 w-4/5 animate-pulse rounded-lg sm:h-12" />

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="size-4 animate-pulse rounded-sm"
                />
              ))}
            </div>
            <Skeleton className="h-4 w-24 animate-pulse" />
          </div>

          {/* Description */}
          <div className="mt-5 space-y-2">
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />
          </div>

          {/* Shop and Location */}
          <div className="mt-6 flex items-center gap-2">
            <Skeleton className="size-4 animate-pulse rounded-full" />
            <Skeleton className="h-4 w-48 animate-pulse" />
          </div>

          <Separator className="my-6" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <Skeleton className="h-10 w-36 animate-pulse rounded-lg" />
            <Skeleton className="h-4 w-20 animate-pulse" />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 w-full animate-pulse rounded-full sm:flex-1" />
            <Skeleton className="h-12 w-full animate-pulse rounded-full sm:flex-1" />
          </div>

          {/* Additional Information */}
          <div className="mt-7 space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-5 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-64 animate-pulse" />
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="size-5 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-60 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
        {/* Shop and Order Section */}
        <div className="flex flex-col gap-6">
          {/* Shop Information Card */}
          <Card className="gap-0 overflow-hidden">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5 animate-pulse rounded-md" />
                <Skeleton className="h-5 w-40 animate-pulse" />
              </div>
              <Skeleton className="h-4 w-56 animate-pulse" />
            </CardHeader>

            <CardContent className="flex items-center gap-3">
              <Skeleton className="size-12 shrink-0 animate-pulse rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36 animate-pulse" />
                <Skeleton className="h-3 w-44 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Order Form Skeleton */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-36 animate-pulse" />
              <Skeleton className="h-4 w-52 animate-pulse" />
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Delivery Date */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 animate-pulse" />
                <Skeleton className="h-11 w-full animate-pulse rounded-lg" />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 animate-pulse" />
                <Skeleton className="h-11 w-full animate-pulse rounded-lg" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 animate-pulse" />
                <Skeleton className="h-24 w-full animate-pulse rounded-lg" />
              </div>

              {/* Submit Button */}
              <Skeleton className="h-12 w-full animate-pulse rounded-full" />
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="h-fit">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-6 w-24 animate-pulse" />
              <Skeleton className="h-7 w-24 animate-pulse rounded-full" />
            </div>

            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />
          </CardHeader>

          <CardContent className="flex flex-col gap-5">
            {/* Review Items */}
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="space-y-3 border-b border-border/60 pb-5 last:border-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <Skeleton className="h-4 w-32 animate-pulse" />
                  <Skeleton className="h-3 w-20 animate-pulse" />
                </div>

                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Skeleton
                      key={star}
                      className="size-3.5 animate-pulse rounded-sm"
                    />
                  ))}
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-full animate-pulse" />
                  <Skeleton className="h-3.5 w-4/5 animate-pulse" />
                </div>
              </div>
            ))}

            {/* Review Form */}
            <div className="space-y-4 rounded-xl border border-border/60 p-4">
              <Skeleton className="h-5 w-32 animate-pulse" />

              <Skeleton className="h-4 w-24 animate-pulse" />

              <Skeleton className="h-24 w-full animate-pulse rounded-lg" />

              <Skeleton className="h-10 w-full animate-pulse rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
