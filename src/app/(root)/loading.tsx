import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-11 w-full max-w-xl sm:h-14" />
        <Skeleton className="h-5 w-full max-w-md" />
        <Skeleton className="mt-3 h-12 w-52 rounded-full" />
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border">
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
