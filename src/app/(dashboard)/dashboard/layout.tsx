import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAuth } from "@/lib/authorization";

/**
 * Dashboard chrome + a baseline authentication check. Each page still calls
 * requireRole()/requireVendorWorkspace() for role and shop authorization.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAuth("/dashboard");

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
