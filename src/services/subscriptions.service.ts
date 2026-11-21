import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";
import type { SubscriptionState } from "@/types/order";

export function createSubscriptionService(request: ApiFetcher) {
  return {
    get() {
      return request<SubscriptionState>("/api/vendor/subscription");
    },

    checkout() {
      return request<{ ok: boolean; url: string }>(
        "/api/vendor/subscription/checkout",
        { method: "POST" },
      );
    },
  };
}

export const subscriptionService = createSubscriptionService(apiFetch);
