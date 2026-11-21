import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import { VendorOrderActions } from "@/components/orders/vendor-order-actions";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { serverApi } from "@/services/server";
import type { Order, OrderStatus } from "@/types/order";

export const metadata: Metadata = {
  title: "Shop orders",
};

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export default async function VendorOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { shop } = await requireVendorWorkspace();
  const params = await searchParams;
  const rawStatus = typeof params.status === "string" ? params.status : "all";
  const status = FILTERS.some((filter) => filter.value === rawStatus)
    ? (rawStatus as OrderStatus | "all")
    : "all";

  let orders: Order[] = [];
  let loadError: string | null = null;

  try {
    orders = await serverApi.orders.vendorOrders(
      status === "all" ? undefined : status,
    );
  } catch (error) {
    loadError = errorMessage(error);
  }

  return (
    <DashboardPage
      title="Orders"
      description={`Incoming and completed orders for ${shop.name}.`}
    >
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value === "all"
                ? "/dashboard/vendor/orders"
                : `/dashboard/vendor/orders?status=${filter.value}`
            }
            className={cn(
              buttonVariants({
                variant: status === filter.value ? "default" : "outline",
                size: "sm",
              }),
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      {loadError ? (
        <EmptyState
          icon={<ClipboardList aria-hidden />}
          title="We could not load your orders"
          description={loadError}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList aria-hidden />}
          title={status === "all" ? "No orders yet" : `No ${status} orders`}
          description="When customers order from your shop, the queue will appear here with accept and status controls."
          action={
            <Link
              href="/dashboard/vendor/menu-items"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Review your menu
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              viewer="vendor"
              actions={
                <VendorOrderActions orderId={order.id} status={order.status} />
              }
            />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
