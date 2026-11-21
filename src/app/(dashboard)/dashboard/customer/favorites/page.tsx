import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MenuItemCard } from "@/components/menu/pizza-card";
import { RemoveFavoriteButton } from "@/components/menu/remove-favorite-button";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { FavoriteEntry } from "@/services/favorites.service";

export const metadata: Metadata = {
  title: "Favorites",
};

export default async function CustomerFavoritesPage() {
  await requireRole(["customer"], "/dashboard/customer/favorites");

  let favorites: FavoriteEntry[] = [];
  let loadError: string | null = null;

  try {
    favorites = await serverApi.favorites.list();
  } catch (error) {
    loadError = errorMessage(error);
  }

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
      {loadError ? (
        <EmptyState
          icon={<Heart aria-hidden />}
          title="We could not load your favorites"
          description={loadError}
        />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Heart aria-hidden />}
          title="No favorites yet"
          description="Tap Save on any dish to keep it here for later."
          action={
            <Link href="/menu" className={buttonVariants({ size: "sm" })}>
              Find something delicious
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="flex flex-col gap-2">
              <MenuItemCard menuItem={favorite.item} />
              <div className="flex justify-end">
                <RemoveFavoriteButton menuItemId={favorite.item._id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
