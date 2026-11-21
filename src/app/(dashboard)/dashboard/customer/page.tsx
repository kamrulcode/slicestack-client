import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { VendorApplicationStatusCard } from "@/components/vendor/vendor-application-status";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAccountContext, requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { serverApi } from "@/services/server";
import { ORDER_STATUS_LABEL, type CustomerDashboardStats, type Order } from "@/types/order";
import { VENDOR_STATUS_LABEL } from "@/types/vendor";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default async function CustomerDashboardPage() {
  const user = await requireRole(["customer"], "/dashboard/customer");
  const me = await getAccountContext();
  const application = me?.application ?? null;

  let stats: CustomerDashboardStats | null = null;
  let orders: Order[] = [];
  let loadError: string | null = null;

  try {
    [stats, orders] = await Promise.all([
      serverApi.orders.customerDashboard(),
      serverApi.orders.customerOrders(),
    ]);
  } catch (error) {
    loadError = errorMessage(error);
  }

  const latestOrders = orders.slice(0, 3);

  return (
    <DashboardPage
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      description="Track your orders, manage your profile and open your own shop."
      actions={
        <Link href="/menu" className={buttonVariants()}>
          <UtensilsCrossed className="size-4" aria-hidden />
          Order pizza
        </Link>
      }
    >
      {loadError ? (
        <EmptyState
          icon={<ShoppingBag aria-hidden />}
          title="Your dashboard data is unavailable"
          description={loadError}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total orders"
              value={stats?.total ?? 0}
              hint="Every order you have placed"
              icon={<ShoppingBag aria-hidden />}
            />
            <StatCard
              label="Pending orders"
              value={stats?.pending ?? 0}
              hint="Waiting for the shop"
              icon={<ClipboardList aria-hidden />}
              accent="amber"
            />
            <StatCard
              label="Accepted orders"
              value={stats?.accepted ?? 0}
              hint="Confirmed by the shop"
              icon={<CheckCircle2 aria-hidden />}
              accent="emerald"
            />
            <StatCard
              label="Rejected orders"
              value={stats?.rejected ?? 0}
              hint={`${stats?.cancelled ?? 0} cancelled`}
              icon={<XCircle aria-hidden />}
              accent="neutral"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <PerformanceChart
              title="Your order activity"
              description="Orders across the last seven days"
              data={stats?.weekly ?? []}
            />
            <VendorApplicationStatusCard application={application} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {orders.length === 0 ? (
              <EmptyState
                icon={<ShoppingBag aria-hidden />}
                title="No orders yet"
                description="Your first order is one slice away. Browse the menu and we will keep every order in this dashboard."
                action={
                  <Link href="/menu" className={buttonVariants({ size: "sm" })}>
                    Browse the menu
                  </Link>
                }
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent orders</CardTitle>
                  <CardDescription>
                    Your latest orders and their current status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {latestOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {order.itemName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {order.shopName} · {formatPrice(order.price)}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                    </Link>
                  ))}
                  <Link
                    href="/dashboard/customer/orders"
                    className={buttonVariants({
                      variant: "outline",
                      size: "sm",
                      className: "mt-1 w-full",
                    })}
                  >
                    View all orders
                  </Link>
                </CardContent>
              </Card>
            )}

            <QuickActions
              actions={[
                {
                  href: "/menu",
                  title: "Browse menu",
                  description: "Explore pizzas from our shops.",
                  icon: <UtensilsCrossed aria-hidden />,
                },
                {
                  href: "/dashboard/customer/orders",
                  title: "My orders",
                  description: "See current and past orders.",
                  icon: <ShoppingBag aria-hidden />,
                },
                {
                  href: "/dashboard/customer/favorites",
                  title: "Favorites",
                  description: "Your saved dishes in one place.",
                  icon: <Store aria-hidden />,
                },
                {
                  href: "/register-as-a-vendor",
                  title: application ? "Vendor status" : "Open a shop",
                  description: application
                    ? VENDOR_STATUS_LABEL[application.status]
                    : "Activate your vendor account instantly.",
                  icon: <Store aria-hidden />,
                },
              ]}
            />
          </div>
        </>
      )}
    </DashboardPage>
  );
}
