import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { serverApiFetch } from "@/lib/api/server";
import { createProfileService } from "@/services/profile.service";
import type { AuthMe } from "@/types/vendor";
import {
  dashboardPathForRole,
  normalizeRole,
  type Role,
} from "@/types/auth";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  blocked: boolean;
};

const profileApi = createProfileService(serverApiFetch);

/**
 * Read the Better Auth session on the server. The role is always read from
 * the database-backed user record, never from a cookie or client payload.
 *
 * Wrapped in React `cache` so the layout, header and page share a single
 * session lookup per request, and guarded so a transient database/session
 * failure degrades to "signed out" instead of throwing an error page.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    const user = session.user as typeof session.user & {
      role?: unknown;
      blocked?: unknown;
    };

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image ?? null,
      role: normalizeRole(user.role),
      blocked: user.blocked === true,
    };
  } catch {
    return null;
  }
});

export async function requireAuth(nextPath?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user || user.blocked) {
    const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/sign-in${query}`);
  }
  return user;
}

/**
 * Server-side authorization. Use this in pages and server actions; never rely
 * on middleware or hidden UI alone.
 */
export async function requireRole(
  allowedRoles: readonly Role[],
  nextPath?: string,
): Promise<SessionUser> {
  const user = await requireAuth(nextPath);

  if (!allowedRoles.includes(user.role)) {
    redirect(dashboardPathForRole(user.role));
  }

  return user;
}

/** Account, vendor application and shop, fetched from the Express API. */
export async function getAccountContext(): Promise<AuthMe | null> {
  try {
    return await profileApi.me();
  } catch {
    return null;
  }
}

/**
 * Guard vendor-only features: the user needs the vendor role, an approved
 * application and an active shop. Suspended or stale vendor accounts are sent
 * back to the vendor overview, which explains the restriction.
 */
export async function requireVendorWorkspace() {
  const user = await requireRole(["vendor"]);
  const me = await getAccountContext();

  if (
    !me?.application ||
    me.application.status !== "APPROVED" ||
    !me.shop ||
    me.shop.status !== "active"
  ) {
    redirect("/dashboard/vendor");
  }

  return { user, application: me.application, shop: me.shop };
}
