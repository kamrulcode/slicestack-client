import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";
import type { MenuItem } from "@/types/menu";

export type FavoriteEntry = {
  id: string;
  createdAt: string;
  item: MenuItem;
};

export function createFavoriteService(request: ApiFetcher) {
  return {
    list() {
      return request<FavoriteEntry[]>("/api/customer/favorites");
    },

    ids() {
      return request<string[]>("/api/customer/favorite-ids");
    },

    add(menuItemId: string) {
      return request<{ ok: boolean; message: string }>(
        `/api/favorites/${encodeURIComponent(menuItemId)}`,
        { method: "POST" },
      );
    },

    remove(menuItemId: string) {
      return request<{ ok: boolean; message: string }>(
        `/api/favorites/${encodeURIComponent(menuItemId)}`,
        { method: "DELETE" },
      );
    },
  };
}

export const favoriteService = createFavoriteService(apiFetch);
