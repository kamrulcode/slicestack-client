import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-3xl">
            <div className="grid grid-cols-7 gap-4 border-b border-border pb-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={index} className="h-3 w-16 max-w-full" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-7 items-center gap-4 border-b border-border/60 py-3 last:border-0"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 max-w-full" />
                  <Skeleton className="h-3 w-32 max-w-full" />
                </div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-28 max-w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-28 max-w-full" />
                  <Skeleton className="h-3 w-24 max-w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32 max-w-full" />
                  <Skeleton className="h-3 w-28 max-w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}