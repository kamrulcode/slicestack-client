import { Skeleton } from "@/components/ui/skeleton";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <DashboardPage
      title="Order details"
      description="Loading your order information..."
      actions={
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-28 animate-pulse rounded-md" />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Order Information Card */}
          <Card>
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Skeleton className="h-6 w-40 animate-pulse" />
                <Skeleton className="h-6 w-24 animate-pulse rounded-full" />
              </div>

              <Skeleton className="h-4 w-48 animate-pulse" />
            </CardHeader>

            <CardContent className="grid gap-6 text-sm sm:grid-cols-2">
              {/* Vendor */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 animate-pulse" />
                <Skeleton className="h-5 w-32 animate-pulse" />
              </div>

              {/* Delivery Date */}
              <div className="space-y-2">
                <Skeleton className="h-3 w-24 animate-pulse" />
                <Skeleton className="h-5 w-36 animate-pulse" />
              </div>

              {/* Delivery Address */}
              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-3 w-28 animate-pulse" />
                <Skeleton className="h-5 w-full max-w-sm animate-pulse" />
              </div>

              {/* Message */}
              <div className="space-y-2 sm:col-span-2">
                <Skeleton className="h-3 w-24 animate-pulse" />
                <Skeleton className="h-5 w-full animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Menu Item Link */}
          <Skeleton className="h-9 w-40 animate-pulse rounded-md" />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Status Timeline */}
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-36 animate-pulse" />
              <Skeleton className="h-4 w-48 animate-pulse" />
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Timeline Indicator */}
                    <div className="flex flex-col items-center">
                      <Skeleton className="size-8 shrink-0 animate-pulse rounded-full" />

                      {index !== 3 && (
                        <Skeleton className="mt-2 h-10 w-0.5 animate-pulse" />
                      )}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 space-y-2 pt-1">
                      <Skeleton className="h-4 w-28 animate-pulse" />
                      <Skeleton className="h-3 w-36 animate-pulse" />
                      <Skeleton className="h-3 w-full max-w-48 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cancel Order Card */}
          <Card>
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-44 animate-pulse" />
              <Skeleton className="h-4 w-full animate-pulse" />
              <Skeleton className="h-4 w-3/4 animate-pulse" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-10 w-full animate-pulse rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPage>
  );
}
