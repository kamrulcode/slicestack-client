import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  UserRound,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderTimeline } from "@/components/orders/order-timeline";
import { VendorOrderActions } from "@/components/orders/vendor-order-actions";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireVendorWorkspace } from "@/lib/authorization";
import { ApiError } from "@/types/api";
import { formatDateTime, formatDeliveryDate } from "@/lib/order-format";
import { formatPrice } from "@/lib/format";
import { serverApi } from "@/services/server";
import type { Order } from "@/types/order";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function VendorOrderDetailPage({
  params,
}: {
  params: Promise<{ orderID: string }>;
}) {
  await requireVendorWorkspace();
  const { orderID } = await params;

  let order: Order;

  try {
    order = await serverApi.orders.vendorOrder(orderID);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <DashboardPage
      title={`Order #${order.id.slice(-6)}`}
      description={`Requested ${formatDateTime(order.createdAt)}`}
      actions={
        <Link
          href="/dashboard/vendor/orders"
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
                {formatPrice(order.price)} · Delivery{" "}
                {formatDeliveryDate(order.deliveryDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Detail
                icon={<MapPin aria-hidden />}
                label="Delivery address"
                value={order.deliveryAddress}
                className="sm:col-span-2"
              />
              <Detail
                icon={<MessageSquare aria-hidden />}
                label="Customer message"
                value={order.message || "No special instructions"}
                className="sm:col-span-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
              <CardDescription>Who placed this order.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <Detail
                icon={<UserRound aria-hidden />}
                label="Name"
                value={order.customerName}
              />
              <Detail
                icon={<Mail aria-hidden />}
                label="Email"
                value={order.customerEmail}
              />
              <Detail
                icon={<Phone aria-hidden />}
                label="Order id"
                value={order.id}
                className="sm:col-span-2"
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status timeline</CardTitle>
              <CardDescription>Updates on this order.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTimeline history={order.statusHistory} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process this order</CardTitle>
              <CardDescription>
                {order.status === "pending"
                  ? "Accept or reject the order. This can only be done once."
                  : "This order has already been processed."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VendorOrderActions orderId={order.id} status={order.status} />
            </CardContent>
          </Card>
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
