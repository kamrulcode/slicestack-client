import { apiFetch } from "@/lib/api/client";
import { toQuery } from "@/lib/api/query";
import type { ApiFetcher } from "@/types/api";
import type {
  MenuItem,
  MenuItemDetail,
  MenuItemReview,
  PublicMenuFilters,
  VendorMenuItemRecord,
} from "@/types/menu";

export type MenuItemInput = {
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
};

export type MenuItemUpdateInput = {
  itemName?: string;
  category?: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
};

export type MutationResult = { ok: boolean; message: string };

export function createMenuService(request: ApiFetcher) {
  return {
    list(filters: PublicMenuFilters = {}) {
      return request<MenuItem[]>(
        `/api/menu-items${toQuery({
          search: filters.search,
          category: filters.category,
          location: filters.location,
        })}`,
        { auth: false },
      );
    },

    detail(id: string) {
      return request<MenuItemDetail>(
        `/api/menu-items/${encodeURIComponent(id)}`,
        { auth: false },
      );
    },

    reviews(id: string) {
      return request<MenuItemReview[]>(
        `/api/menu-items/${encodeURIComponent(id)}/reviews`,
        { auth: false },
      );
    },

    vendorItems() {
      return request<VendorMenuItemRecord[]>("/api/vendor/menu-items");
    },

    create(input: MenuItemInput) {
      return request<MutationResult & { id: string }>("/api/menu-items", {
        method: "POST",
        body: input,
      });
    },

    update(id: string, input: MenuItemUpdateInput) {
      return request<MutationResult>(
        `/api/menu-items/${encodeURIComponent(id)}`,
        { method: "PUT", body: input },
      );
    },

    setAvailability(id: string, isAvailable: boolean) {
      return request<MutationResult>(
        `/api/menu-items/${encodeURIComponent(id)}/availability`,
        { method: "PATCH", body: { isAvailable } },
      );
    },

    remove(id: string) {
      return request<MutationResult>(
        `/api/menu-items/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
    },
  };
}

export const menuService = createMenuService(apiFetch);
