import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";
import type { MenuItemRating } from "@/types/menu";

export function createReviewService(request: ApiFetcher) {
  return {
    create(menuItemId: string, input: { rating: number; comment: string }) {
      return request<{ ok: boolean; message: string; rating: MenuItemRating }>(
        `/api/menu-items/${encodeURIComponent(menuItemId)}/reviews`,
        { method: "POST", body: input },
      );
    },

    remove(menuItemId: string) {
      return request<{ ok: boolean; message: string }>(
        `/api/menu-items/${encodeURIComponent(menuItemId)}/reviews/mine`,
        { method: "DELETE" },
      );
    },
  };
}

export const reviewService = createReviewService(apiFetch);
