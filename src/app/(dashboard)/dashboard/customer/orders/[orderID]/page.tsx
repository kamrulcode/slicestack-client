import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderID: string }>;
}) {
  const user = await requireRole(["customer"], "/dashboard/customer/orders");
  const { orderID } = await params;

  return (
    <DashboardPage
      title={`Order ${orderID}`}
      description={`Order details for ${user.name}.`}
    >
      <EmptyState
        icon={<PackageSearch aria-hidden />}
        title="Order details are not available yet"
        description="Ordering and tracking will be connected to this page once the orders feature ships."
        action={
          <Link
            href="/dashboard/customer/orders"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to orders
          </Link>
        }
      />
    </DashboardPage>
  );
}
