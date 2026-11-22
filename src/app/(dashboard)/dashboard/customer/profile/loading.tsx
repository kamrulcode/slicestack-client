import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40 animate-pulse rounded-md" />
        <Skeleton className="h-4 w-64 animate-pulse rounded-md" />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Account Profile Card */}
        <div className="space-y-6 rounded-xl border bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 shrink-0 animate-pulse rounded-full" />

            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-36 animate-pulse" />
              <Skeleton className="h-4 w-48 animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20 animate-pulse" />
                <Skeleton className="h-10 w-full animate-pulse rounded-md" />
              </div>
            ))}
          </div>

          <Skeleton className="h-10 w-full animate-pulse rounded-md" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Vendor Application Status */}
          <div className="space-y-4 rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40 animate-pulse" />
              <Skeleton className="h-6 w-20 animate-pulse rounded-full" />
            </div>

            <Skeleton className="h-4 w-full animate-pulse" />
            <Skeleton className="h-4 w-3/4 animate-pulse" />

            <Skeleton className="h-10 w-32 animate-pulse rounded-md" />
          </div>

          {/* Delivery Addresses */}
          <div className="flex flex-col items-center space-y-4 rounded-xl border bg-card p-8 text-center">
            <Skeleton className="size-12 animate-pulse rounded-full" />

            <Skeleton className="h-5 w-40 animate-pulse" />
            <Skeleton className="h-4 w-64 max-w-full animate-pulse" />

            <Skeleton className="h-9 w-32 animate-pulse rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
