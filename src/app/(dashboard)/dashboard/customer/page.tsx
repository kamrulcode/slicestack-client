import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  MapPin,
  ShoppingBag,
  Store,
  UserRound,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { VendorApplicationStatusCard } from "@/components/vendor/vendor-application-status";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { getVendorApplicationForUser } from "@/lib/vendor-applications";
import { VENDOR_STATUS_LABEL } from "@/types/vendor";

export const metadata: Metadata = {
  title: "Customer dashboard",
};

export default async function CustomerDashboardPage() {
  const user = await requireRole(["customer"], "/dashboard/customer");
  const application = await getVendorApplicationForUser(user.id);

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
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={0}
          hint="Your order history will appear here"
          icon={<ShoppingBag aria-hidden />}
        />
        <StatCard
          label="Active orders"
          value={0}
          hint="Nothing on the way right now"
          icon={<ClipboardList aria-hidden />}
          accent="amber"
        />
        <StatCard
          label="Saved addresses"
          value={0}
          hint="Add delivery addresses soon"
          icon={<MapPin aria-hidden />}
          accent="neutral"
        />
        <StatCard
          label="Vendor account"
          value={
            application ? VENDOR_STATUS_LABEL[application.status] : "Not active"
          }
          hint={application ? application.shopName : "Open your own shop"}
          icon={<Store aria-hidden />}
          accent={application?.status === "APPROVED" ? "emerald" : "primary"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PerformanceChart
          title="Your order activity"
          description="Orders and favourites across the last seven days"
        />
        <VendorApplicationStatusCard application={application} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <EmptyState
          icon={<Wallet aria-hidden />}
          title="No orders yet"
          description="Your first order is one slice away. Browse the menu and we will keep every order in this dashboard."
          action={
            <Link href="/menu" className={buttonVariants({ size: "sm" })}>
              Browse the menu
            </Link>
          }
        />
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
              href: "/dashboard/customer/profile",
              title: "Profile",
              description: "Review your account details.",
              icon: <UserRound aria-hidden />,
            },
            {
              href: "/register-as-a-vendor",
              title: application ? "Vendor status" : "Open a shop",
              description: application
                ? "Review your vendor account status."
                : "Activate your vendor account instantly.",
              icon: <Store aria-hidden />,
            },
          ]}
        />
      </div>
    </DashboardPage>
  );
}
