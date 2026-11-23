import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterVendorLoading() {
  return (
    <div className="grid min-h-dvh w-full grid-cols-1 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
      <aside className="hidden flex-col bg-brand-ink px-12 py-12 lg:flex xl:px-18 xl:py-14">
        <Skeleton className="h-10 w-36 bg-white/10" />

        <div className="mt-20 max-w-125 xl:mt-36">
          <Skeleton className="h-12 w-72 max-w-full bg-white/10" />
          <Skeleton className="mt-3 h-12 w-56 max-w-full bg-white/10" />
          <Skeleton className="mt-6 h-5 w-80 max-w-full bg-white/10" />
          <Skeleton className="mt-10 aspect-3/2 w-full rounded-lg bg-white/10 xl:mt-12" />
          <Skeleton className="mt-10 h-4 w-64 max-w-full bg-white/10" />
        </div>
      </aside>

      <main className="flex justify-center bg-auth-canvas px-5 py-12 sm:px-8 lg:px-16 lg:pt-28 lg:pb-20 xl:px-24">
        <div className="w-full max-w-142.5">
          <Skeleton className="mb-10 h-8 w-28 lg:hidden" />
          <Skeleton className="h-11 w-72 max-w-full sm:h-13" />
          <Skeleton className="mt-3 h-5 w-full max-w-md" />

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="sm:col-span-1">
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <Skeleton className="mb-2 h-4 w-28" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
            <div className="sm:col-span-2">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>

          <Skeleton className="mt-6 h-12 w-full rounded-lg" />
          <Skeleton className="mt-6 h-4 w-64 max-w-full" />
        </div>
      </main>
    </div>
  );
}
