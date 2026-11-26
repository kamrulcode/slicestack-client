import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/authorization";
import { dashboardPathForRole } from "@/types/auth";

export default async function DashboardOrdersPage() {
  const user = await requireAuth("/dashboard/orders");

  if (user.role === "customer") {
    redirect("/dashboard/customer/orders");
  }

  if (user.role === "vendor") {
    redirect("/dashboard/vendor/orders");
  }

  redirect(dashboardPathForRole(user.role));
}
