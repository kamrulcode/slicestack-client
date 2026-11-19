import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ orderID: string }>;
}) {
  const { shop } = await requireVendorWorkspace();
  const { orderID } = await params;

  return (
    <DashboardPage
      title={`Order ${orderID}`}
      description={`Order details for ${shop.name}.`}
    >
      <EmptyState
        icon={<PackageSearch aria-hidden />}
        title="Order details are not available yet"
        description="This route is already protected for your shop. Order data will be connected with the orders module."
        action={
          <Link
            href="/dashboard/vendor/orders"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to orders
          </Link>
        }
      />
    </DashboardPage>
  );
}
