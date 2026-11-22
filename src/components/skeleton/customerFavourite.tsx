import { Skeleton } from "@/components/ui/skeleton";

function FavoriteCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Menu Item Card */}
      <div className="overflow-hidden rounded-xl border bg-card">
        {/* Pizza Image */}
        <div className="relative">
          <Skeleton className="aspect-4/3  w-full rounded-none" />

          {/* Favorite / Category Badge */}
          <Skeleton className="absolute left-3 top-3 h-6 w-20 rounded-full" />
          <Skeleton className="absolute right-3 top-3 size-9 rounded-full" />
        </div>

        {/* Card Content */}
        <div className="space-y-4 p-4">
          {/* Title and Category */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-24" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-20" />
            </div>

            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      </div>

      {/* Remove Favorite Button */}
      <div className="flex justify-end">
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>
    </div>
  );
}

export function FavoritesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <FavoriteCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
