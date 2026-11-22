import { DashboardPage } from "@/components/dashboard/dashboard-page";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FavoritesSkeleton } from "@/components/skeleton/customerFavourite";

export default function Loading() {
  return (
    <DashboardPage
      title="Favorites"
      description="Dishes you saved for later."
      actions={
        <Link href="/menu" className={buttonVariants({ size: "sm" })}>
          Browse menu
        </Link>
      }
    >
      <FavoritesSkeleton />
    </DashboardPage>
  );
}
