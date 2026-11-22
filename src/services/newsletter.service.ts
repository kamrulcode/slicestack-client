import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";

export function createNewsletterService(request: ApiFetcher) {
  return {
    subscribe(email: string) {
      return request<{ ok: boolean; message: string }>("/api/newsletter", {
        method: "POST",
        body: { email },
        auth: false,
      });
    },
  };
}

export const newsletterService = createNewsletterService(apiFetch);
