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
 * `disableCookieCache` is required: without it Better Auth answers from the
 * `session_data` cookie, which snapshots the user (including `role`) for up to
 * 7 days. Vendor sign-up raises the role from `customer` to `vendor` through
 * the Express API right after the session is created, so a cached snapshot
 * would keep sending the new vendor to the customer dashboard until they
 * signed out and back in.
 *
 * Wrapped in React `cache` so the layout, header and page share a single
 * session lookup per request.
 *
 * Errors are deliberately not swallowed: a failed lookup is an infrastructure
 * problem, not a signed-out visitor. Turning it into `null` used to bounce
 * signed-in admins (and everyone else) to `/sign-in` whenever the session read
 * hiccuped. Letting it throw shows the dashboard error boundary, which offers
 * a retry and keeps the session intact.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const session = await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  });
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
 * Role check for dashboard pages. The dashboard layout is the single place
 * that sends signed-out visitors to `/sign-in`, so this only compares the
 * role and forwards a mismatch to the dashboard that belongs to the account.
 * This keeps role permissions intact without a second sign-in redirect.
 */
export async function requireRole(
  allowedRoles: readonly Role[],
): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user || user.blocked) redirect("/dashboard");
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
