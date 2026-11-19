import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CircleDollarSign,
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
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/authorization";
import { formatPrice } from "@/lib/format";
import {
  getShopForOwner,
  getVendorApplicationForUser,
} from "@/lib/vendor-applications";

export const metadata: Metadata = {
  title: "Vendor dashboard",
};

export default async function VendorDashboardPage() {
  const user = await requireRole(["vendor"], "/dashboard/vendor");
  const [application, shop] = await Promise.all([
    getVendorApplicationForUser(user.id),
    getShopForOwner(user.id),
  ]);

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
        description="Your shop tools unlock once your application is approved and active."
      >
        <EmptyState
          icon={suspended ? <ShieldAlert aria-hidden /> : <Store aria-hidden />}
          title={
            suspended ? "Vendor access suspended" : "Vendor access is not active"
          }
          description={
            suspended
              ? "Your shop is temporarily suspended, so menu, order and profile tools are locked. Contact the SliceStack team if you believe this is a mistake."
              : "Your vendor application is under review. We will notify you when a decision is made."
          }
          action={
            <Link
              href="/dashboard/customer"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Back to customer dashboard
            </Link>
          }
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
          label="Today's orders"
          value={0}
          hint="New orders will appear here"
          icon={<ClipboardList aria-hidden />}
        />
        <StatCard
          label="Menu items"
          value={0}
          hint="Create your first pizza"
          icon={<UtensilsCrossed aria-hidden />}
          accent="amber"
        />
        <StatCard
          label="Revenue"
          value={formatPrice(0)}
          hint="Completed orders"
          icon={<CircleDollarSign aria-hidden />}
          accent="emerald"
        />
        <StatCard
          label="Shop status"
          value="Active"
          hint="Visible to customers"
          icon={<BadgeCheck aria-hidden />}
          accent="sky"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PerformanceChart
          title="Shop performance"
          description="Orders across the last seven days"
        />
        <div className="flex flex-col gap-6">
          <ShopSummaryCard shop={shop} />
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
