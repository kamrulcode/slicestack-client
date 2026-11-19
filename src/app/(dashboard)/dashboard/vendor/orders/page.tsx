import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Shop orders",
};

export default async function VendorOrdersPage() {
  const { shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Orders"
      description={`Incoming and completed orders for ${shop.name}.`}
    >
      <EmptyState
        icon={<ClipboardList aria-hidden />}
        title="No orders yet"
        description="When customers order from your shop, the queue will appear here with accept and status controls."
        action={
          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Build your menu
          </Link>
        }
      />
    </DashboardPage>
  );
}
