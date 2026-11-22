import { apiFetch } from "@/lib/api/client";
import { toQuery } from "@/lib/api/query";
import type { ApiFetcher } from "@/types/api";
import type { AuthMe } from "@/types/vendor";
import type { Role } from "@/types/auth";

export function createProfileService(request: ApiFetcher) {
  return {
    me() {
      return request<AuthMe>("/api/auth/me");
    },

    updateProfile(input: { name?: string; image?: string | null }) {
      return request<{ ok: boolean; message: string }>("/api/users/me", {
        method: "PATCH",
        body: input,
      });
    },

    vendorMe() {
      return request<AuthMe>("/api/vendors/me");
    },

    updateVendorProfile(input: {
      shopName?: string;
      ownerName?: string;
      phone?: string;
      address?: string;
      description?: string;
      logoUrl?: string | null;
    }) {
      return request<{ ok: boolean; message: string }>("/api/vendors/me", {
        method: "PATCH",
        body: input,
      });
    },

    applyVendor(input: {
      shopName: string;
      ownerName?: string;
      phone: string;
      address: string;
      description: string;
      logoUrl?: string | null;
    }) {
      return request<{ ok: boolean; message: string }>("/api/vendors/apply", {
        method: "POST",
        body: input,
      });
    },
  };
}

export const profileService = createProfileService(apiFetch);

export function roleQuery(role: Role | "all") {
  return toQuery({ role });
}
