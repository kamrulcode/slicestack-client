import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";
import type { SubscriptionState } from "@/types/order";

export function createSubscriptionService(request: ApiFetcher) {
  return {
    get() {
      return request<SubscriptionState>(`/api/vendor/subscription`);
    },

    checkout() {
      return request<{ ok: boolean; url: string }>(
        "/api/vendor/subscription/checkout",
        { method: "POST" },
      );
    },

    verify(sessionId: string) {
      return request<{
        ok: boolean;
        paymentStatus: string;
        sessionStatus: string;
        plan: string;
        transaction: import("@/types/order").TransactionRecord | null;
      }>("/api/vendor/subscription/verify", {
        method: "POST",
        body: { session_id: sessionId },
      });
    },
  };
}

export const subscriptionService = createSubscriptionService(apiFetch);
