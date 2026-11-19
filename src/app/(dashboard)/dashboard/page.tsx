import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/authorization";
import { dashboardPathForRole } from "@/types/auth";

/**
 * Role-aware entry point after sign-in. Customers with a pending vendor
 * application stay on the customer dashboard.
 */
export default async function DashboardIndexPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=%2Fdashboard");

  redirect(dashboardPathForRole(user.role));
}
