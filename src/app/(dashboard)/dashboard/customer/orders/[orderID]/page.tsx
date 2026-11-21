import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, MessageSquare, Store } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { CancelOrderButton } from "@/components/orders/cancel-order-button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/authorization";
import { ApiError } from "@/types/api";
import {
  formatDateTime,
  formatDeliveryDate,
} from "@/lib/order-format";
import { formatPrice } from "@/lib/format";
import { serverApi } from "@/services/server";
import type { Order } from "@/types/order";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function CustomerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderID: string }>;
}) {
  await requireRole(["customer"], "/dashboard/customer/orders");
  const { orderID } = await params;

  let order: Order;

  try {
    order = await serverApi.orders.customerOrder(orderID);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <DashboardPage
      title={`Order #${order.id.slice(-6)}`}
      description={`Placed ${formatDateTime(order.createdAt)}`}
      actions={
        <Link
          href="/dashboard/customer/orders"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to orders
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-2">
                {order.itemName}
                <OrderStatusBadge status={order.status} />
              </CardTitle>
              <CardDescription>
                {order.shopName || "SliceStack shop"} ·{" "}
                {formatPrice(order.price)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Detail
                icon={<Store aria-hidden />}
                label="Vendor"
                value={order.shopName || "SliceStack shop"}
              />
              <Detail
                icon={<MapPin aria-hidden />}
                label="Delivery date"
                value={formatDeliveryDate(order.deliveryDate)}
              />
              <Detail
                className="sm:col-span-2"
                icon={<MapPin aria-hidden />}
                label="Delivery address"
                value={order.deliveryAddress}
              />
              <Detail
                className="sm:col-span-2"
                icon={<MessageSquare aria-hidden />}
                label="Your message"
                value={order.message || "No special instructions"}
              />
            </CardContent>
          </Card>

          <Link
            href={`/menu/${order.menuItemId}`}
            className={buttonVariants({ variant: "outline", size: "sm", className: "w-fit" })}
          >
            View the menu item
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
              <CardDescription>Every update from the shop.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTimeline history={order.statusHistory} />
            </CardContent>
          </Card>

          {order.status === "pending" ? (
            <Card>
              <CardHeader>
                <CardTitle>Need to change plans?</CardTitle>
                <CardDescription>
                  Pending orders can be cancelled before the shop responds.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CancelOrderButton orderId={order.id} />
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" disabled className="w-full">
              This order can no longer be cancelled
            </Button>
          )}
        </div>
      </div>
    </DashboardPage>
  );
}

function Detail({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span className="[&_svg]:size-3.5">{icon}</span>
        {label}
      </p>
      <p className="mt-1 break-words">{value}</p>
    </div>
  );
}
