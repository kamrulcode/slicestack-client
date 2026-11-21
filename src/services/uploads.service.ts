import { apiFetch } from "@/lib/api/client";
import type { ApiFetcher } from "@/types/api";

/** Upload through the Express API so the ImgBB key stays on the server. */
export function createUploadService(request: ApiFetcher) {
  return {
    async image(file: File) {
      const body = new FormData();
      body.append("image", file);
      const result = await request<{ ok: boolean; url: string }>(
        "/api/uploads/image",
        { method: "POST", body },
      );
      return result.url;
    },

    async images(files: File[]) {
      const body = new FormData();
      for (const file of files) body.append("images", file);
      const result = await request<{ ok: boolean; urls: string[] }>(
        "/api/uploads/images",
        { method: "POST", body },
      );
      return result.urls;
    },
  };
}

export const uploadService = createUploadService(apiFetch);
