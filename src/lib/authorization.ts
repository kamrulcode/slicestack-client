import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getShopForOwner, getVendorApplicationForUser } from "@/lib/vendor-applications";
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
};

/**
 * Read the Better Auth session on the server. The role is always read from
 * the database-backed user record, never from a cookie or client payload.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const user = session.user as typeof session.user & { role?: unknown };

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: normalizeRole(user.role),
  };
}

export async function requireAuth(nextPath?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
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

/**
 * Guard vendor-only features: the user needs the vendor role, an approved
 * application and an active shop. Suspended or stale vendor accounts are sent
 * back to the vendor overview, which explains the restriction.
 */
export async function requireVendorWorkspace() {
  const user = await requireRole(["vendor"]);

  const [application, shop] = await Promise.all([
    getVendorApplicationForUser(user.id),
    getShopForOwner(user.id),
  ]);

  if (application?.status !== "APPROVED" || shop?.status !== "active") {
    redirect("/dashboard/vendor");
  }

  return { user, application, shop };
}
