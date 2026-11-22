import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-4 sm:p-5">
        {/* Order Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 shrink-0 rounded-xl" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        {/* Order Details */}
        <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-3">
          <Skeleton className="size-16 shrink-0 rounded-lg" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-36 max-w-full" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>

          <Skeleton className="h-5 w-16 shrink-0" />
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24 max-w-full" />
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
}
