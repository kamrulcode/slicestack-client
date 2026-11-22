import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-9 w-full flex-1 rounded-md" />
        <Skeleton className="h-9 w-full rounded-md sm:w-24" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-full max-w-md" />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[44rem]">
            <div className="grid grid-cols-6 gap-4 border-b border-border pb-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16 max-w-full" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-6 items-center gap-4 border-b border-border/60 py-3 last:border-0"
              >
                <Skeleton className="h-4 w-24 max-w-full" />
                <Skeleton className="h-4 w-36 max-w-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-24 max-w-full" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Skeleton className="h-3 w-full max-w-lg" />
    </div>
  );
}