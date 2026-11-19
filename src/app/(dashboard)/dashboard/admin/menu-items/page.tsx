import type { Metadata } from "next";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Platform menu items",
};

export default async function AdminMenuItemsPage() {
  await requireRole(["admin"], "/dashboard/admin/menu-items");

  return (
    <DashboardPage
      title="Menu items"
      description="A platform-wide view of every vendor's menu."
    >
      <EmptyState
        icon={<UtensilsCrossed aria-hidden />}
        title="Menu moderation is on the way"
        description="Vendor menus will be searchable and moderatable from here once the menu module is connected."
        action={
          <Link
            href="/dashboard/admin"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to overview
          </Link>
        }
      />
    </DashboardPage>
  );
}
