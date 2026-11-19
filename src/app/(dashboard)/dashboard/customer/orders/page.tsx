import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "My orders",
};

export default async function CustomerOrdersPage() {
  await requireRole(["customer"], "/dashboard/customer/orders");

  return (
    <DashboardPage
      title="My orders"
      description="Track active deliveries and revisit past orders."
    >
      <EmptyState
        icon={<ShoppingBag aria-hidden />}
        title="No orders yet"
        description="Once you place an order it will show up here with live status updates."
        action={
          <Link href="/menu" className={buttonVariants({ size: "sm" })}>
            Start an order
          </Link>
        }
      />
    </DashboardPage>
  );
}
