import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { Order } from "@/types/order";

export const metadata: Metadata = {
  title: "My orders",
};

export default async function CustomerOrdersPage() {
  await requireRole(["customer"], "/dashboard/customer/orders");

  let orders: Order[] = [];
  let loadError: string | null = null;

  try {
    orders = await serverApi.orders.customerOrders();
  } catch (error) {
    loadError = errorMessage(error);
  }

  return (
    <DashboardPage
      title="My orders"
      description="Track active deliveries and revisit past orders."
    >
      {loadError ? (
        <EmptyState
          icon={<ShoppingBag aria-hidden />}
          title="We could not load your orders"
          description={loadError}
        />
      ) : orders.length === 0 ? (
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
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderSummaryCard
              key={order.id}
              order={order}
              viewer="customer"
              actions={
                order.status === "pending" ? (
                  <CancelOrderButton orderId={order.id} />
                ) : null
              }
            />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
