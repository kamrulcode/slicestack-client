import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAuth } from "@/lib/authorization";

/**
 * Dashboard chrome. This is the single authentication gate for every
 * `/dashboard/**` route: signed-out and blocked visitors are sent to `/sign-in`
 * here. Pages only call requireRole()/requireVendorWorkspace() to check that the
 * signed-in account owns the requested workspace.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAuth("/dashboard");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
