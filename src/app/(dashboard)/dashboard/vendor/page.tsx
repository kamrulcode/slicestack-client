import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardList,
  Plus,
  Receipt,
  ShieldAlert,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ShopSummaryCard,
  VendorApplicationSummary,
} from "@/components/vendor/vendor-application-status";
import { VendorStatusBadge } from "@/components/vendor/vendor-status-badge";
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
import { serverApi } from "@/services/server";

export const metadata: Metadata = {
  title: "Vendor dashboard",
};

export default async function VendorDashboardPage() {
  const user = await requireRole(["vendor"]);
  const me = await getAccountContext();

  if (!me) {
    return (
      <DashboardPage
        title="Vendor dashboard"
        description="Manage your shop, menu and incoming orders."
      >
        <EmptyState
          icon={<ShieldAlert aria-hidden />}
          title="We could not load your shop"
          description="The vendor service is unavailable right now. Refresh the page to try again."
        />
      </DashboardPage>
    );
  }

  const { application, shop } = me;

  if (
    !application ||
    application.status !== "APPROVED" ||
    !shop ||
    shop.status !== "active"
  ) {
    const suspended =
      application?.status === "SUSPENDED" || shop?.status === "suspended";

    return (
      <DashboardPage
        title="Vendor dashboard"
        description="Your shop tools unlock once your vendor profile and shop are active."
      >
        <EmptyState
          icon={suspended ? <ShieldAlert aria-hidden /> : <Store aria-hidden />}
          title={
            suspended ? "Vendor access suspended" : "Vendor access is not active"
          }
          description={
            suspended
              ? "Your shop is temporarily suspended, so menu, order and profile tools are locked. Contact the SliceStack team if you believe this is a mistake."
              : "Your vendor profile is not active yet. Finish your shop setup from the account you registered with, or contact support if you need help."
          }
          action={
            <Link
              href="/menu"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Browse the menu
            </Link>
          }
        />
      </DashboardPage>
    );
  }

  let stats;

  try {
    stats = await serverApi.orders.vendorDashboard();
  } catch (error) {
    return (
      <DashboardPage
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description={`Manage ${shop.name}, your menu and incoming orders.`}
      >
        <EmptyState
          icon={<ShieldAlert aria-hidden />}
          title="Dashboard data is unavailable"
          description={errorMessage(error)}
        />
      </DashboardPage>
    );
  }

  return (
    <DashboardPage
      title={`Welcome back, ${user.name.split(" ")[0]}`}
      description={`Manage ${shop.name}, your menu and incoming orders.`}
      actions={
        <>
          <VendorStatusBadge status={application.status} />
          <Badge variant={stats.plan === "premium" ? "default" : "outline"}>
            {stats.plan === "premium" ? "Premium plan" : "Free plan"}
          </Badge>
          <Link
            href="/dashboard/vendor/menu-items/add"
            className={buttonVariants()}
          >
            <Plus className="size-4" aria-hidden />
            Add menu item
          </Link>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Menu items"
          value={stats.totalItems}
          hint={`${stats.pendingItems} awaiting review`}
          icon={<UtensilsCrossed aria-hidden />}
        />
        <StatCard
          label="Active items"
          value={stats.activeItems}
          hint="Approved and available"
          icon={<BadgeCheck aria-hidden />}
          accent="emerald"
        />
        <StatCard
          label="Pending orders"
          value={stats.pendingOrders}
          hint="Waiting for your decision"
          icon={<ClipboardList aria-hidden />}
          accent="amber"
        />
        <StatCard
          label="Accepted orders"
          value={stats.acceptedOrders}
          hint={`${stats.rejectedOrders} rejected`}
          icon={<CheckCircle2 aria-hidden />}
          accent="neutral"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PerformanceChart
          title="Shop performance"
          description="Your orders across the last seven days"
          data={stats.weekly}
        />
        <div className="flex flex-col gap-6">
          <ShopSummaryCard shop={shop} plan={stats.plan} />
          <QuickActions
            actions={[
              {
                href: "/dashboard/vendor/menu-items/add",
                title: "Add menu item",
                description: "Create a new pizza or side.",
                icon: <Plus aria-hidden />,
              },
              {
                href: "/dashboard/vendor/orders",
                title: "Manage orders",
                description: "Accept and track incoming orders.",
                icon: <ClipboardList aria-hidden />,
              },
              {
                href: "/dashboard/vendor/profile",
                title: "Shop profile",
                description: "Review your public shop details.",
                icon: <Store aria-hidden />,
              },
              {
                href: "/dashboard/vendor/subscription",
                title: "Subscription",
                description: "See your current plan.",
                icon: <Receipt aria-hidden />,
              },
            ]}
          />
        </div>
      </div>

      <VendorApplicationSummary application={application} />

      <Card>
        <CardHeader>
          <CardTitle>Keep your shop fresh</CardTitle>
          <CardDescription>
            Shops with photos, descriptions and an up-to-date menu convert more
            customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link
            href="/menu"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View storefront
          </Link>
          <Link
            href="/dashboard/vendor/profile"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            Review shop details
          </Link>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
