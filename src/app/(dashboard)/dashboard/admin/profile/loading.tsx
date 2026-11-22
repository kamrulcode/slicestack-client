import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-full max-w-lg" />
      </div>

      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-56 max-w-full" />
            </div>
            <Skeleton className="h-8 w-20 shrink-0 rounded-md" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-40 max-w-full" />
              </div>
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-48 max-w-full" />
              </div>
            ))}
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <Skeleton className="mt-0.5 size-4 shrink-0 rounded" />
              <Skeleton className="h-4 w-full max-w-sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}