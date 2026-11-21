import { serverApiFetch } from "@/lib/api/server";
import { createAdminService } from "./admin.service";
import { createFavoriteService } from "./favorites.service";
import { createMenuService } from "./menu.service";
import { createOrderService } from "./orders.service";
import { createProfileService } from "./profile.service";
import { createReviewService } from "./reviews.service";
import { createSubscriptionService } from "./subscriptions.service";
import { createUploadService } from "./uploads.service";

/** Services bound to the server-side fetch helper (JWT from the session). */
export const serverApi = {
  menu: createMenuService(serverApiFetch),
  orders: createOrderService(serverApiFetch),
  favorites: createFavoriteService(serverApiFetch),
  reviews: createReviewService(serverApiFetch),
  profile: createProfileService(serverApiFetch),
  admin: createAdminService(serverApiFetch),
  subscriptions: createSubscriptionService(serverApiFetch),
  uploads: createUploadService(serverApiFetch),
};
