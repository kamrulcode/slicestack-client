import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDateTime, formatDeliveryDate } from "@/lib/order-format";
import { formatPrice } from "@/lib/format";
import type { Order } from "@/types/order";

export function OrderSummaryCard({
  order,
  viewer,
  actions,
}: {
  order: Order;
  viewer: "customer" | "vendor";
  actions?: ReactNode;
}) {
  const detailHref =
    viewer === "customer"
      ? `/dashboard/customer/orders/${order.id}`
      : `/dashboard/vendor/orders/${order.id}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-secondary/60 sm:w-32">
          {order.itemImage ? (
            <Image
              src={order.itemImage}
              alt={order.itemName}
              fill
              sizes="128px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={detailHref}
              className="font-heading text-lg font-semibold tracking-tight hover:text-primary"
            >
              {order.itemName}
            </Link>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <p className="flex items-center gap-1.5">
              <Store className="size-3.5" aria-hidden />
              {viewer === "customer"
                ? order.shopName || "SliceStack shop"
                : order.customerName}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {formatDeliveryDate(order.deliveryDate)}
            </p>
            <p>Requested {formatDateTime(order.createdAt)}</p>
            <p className="font-semibold text-foreground">
              {formatPrice(order.price)}
            </p>
          </div>
        </div>
      </CardContent>

      {actions ? (
        <CardFooter className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/30">
          {actions}
          <Link
            href={detailHref}
            className="text-sm font-semibold text-primary hover:underline"
          >
            View details
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}
