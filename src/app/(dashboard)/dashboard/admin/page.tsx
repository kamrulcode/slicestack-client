import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardList,
  Receipt,
  ShieldCheck,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCard } from "@/components/dashboard/stat-card";
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
import { getRoleCounts, getUsersByIds } from "@/lib/users";
import { listVendorApplications } from "@/lib/vendor-applications";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function AdminDashboardPage() {
  const admin = await requireRole(["admin"], "/dashboard/admin");

  const [counts, applications] = await Promise.all([
    getRoleCounts(),
    listVendorApplications(),
  ]);

  const pending = applications.filter(
    (application) => application.status === "PENDING",
  );
  const applicants = await getUsersByIds(pending.map((item) => item.userId));

  return (
    <DashboardPage
      title={`Platform overview`}
      description={`Signed in as ${admin.name}. Review shops, vendors and platform access.`}
      actions={
        <Link
          href="/dashboard/admin/vendors"
          className={buttonVariants()}
        >
          <ClipboardList className="size-4" aria-hidden />
          Review applications
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={counts.total}
          hint="Registered accounts"
          icon={<Users aria-hidden />}
        />
        <StatCard
          label="Customers"
          value={counts.customers}
          hint="Default platform role"
          icon={<ShieldCheck aria-hidden />}
          accent="sky"
        />
        <StatCard
          label="Vendors"
          value={counts.vendors}
          hint="Approved shop owners"
          icon={<Store aria-hidden />}
          accent="emerald"
        />
        <StatCard
          label="Pending reviews"
          value={pending.length}
          hint="Applications waiting for a decision"
          icon={<ClipboardList aria-hidden />}
          accent="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <PerformanceChart
          title="Platform activity"
          description="Orders across the last seven days"
        />

        <Card>
          <CardHeader>
            <CardTitle>Applications waiting</CardTitle>
            <CardDescription>
              The newest vendor applications that need a decision.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing waiting — the review queue is clear.
              </p>
            ) : (
              pending.slice(0, 4).map((application) => {
                const applicant = applicants.get(application.userId);
                return (
                  <Link
                    key={application.id}
                    href="/dashboard/admin/vendors?status=PENDING"
                    className="flex items-center justify-between gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-accent/60"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {application.shopName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {applicant?.email ?? application.ownerName}
                      </p>
                    </div>
                    <VendorStatusBadge status={application.status} />
                  </Link>
                );
              })
            )}
            <Link
              href="/dashboard/admin/vendors"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "mt-1 w-full",
              })}
            >
              Open review queue
            </Link>
          </CardContent>
        </Card>
      </div>

      <QuickActions
        actions={[
          {
            href: "/dashboard/admin/vendors",
            title: "Vendor applications",
            description: "Approve, reject or suspend shops.",
            icon: <Store aria-hidden />,
          },
          {
            href: "/dashboard/admin/users",
            title: "Manage users",
            description: "See every account and its role.",
            icon: <Users aria-hidden />,
          },
          {
            href: "/dashboard/admin/menu-items",
            title: "Menu library",
            description: "Review platform menu content.",
            icon: <UtensilsCrossed aria-hidden />,
          },
          {
            href: "/dashboard/admin/transactions",
            title: "Transactions",
            description: "Platform payments and payouts.",
            icon: <Receipt aria-hidden />,
          },
        ]}
      />
    </DashboardPage>
  );
}
