import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ClipboardList,
  Receipt,
  ShieldCheck,
  Store,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
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
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { AdminDashboardStats, PlatformUser } from "@/types/admin";
import type { VendorApplication } from "@/types/vendor";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await requireRole(["admin"], "/dashboard/admin");

  let stats: AdminDashboardStats | null = null;
  let pending: VendorApplication[] = [];
  let users: PlatformUser[] = [];
  let loadError: string | null = null;

  try {
    [stats, pending, users] = await Promise.all([
      serverApi.admin.dashboard(),
      serverApi.admin.vendorApplications("PENDING"),
      serverApi.admin.users(),
    ]);
  } catch (error) {
    loadError = errorMessage(error);
  }

  const usersById = new Map(users.map((user) => [user.id, user]));

  return (
    <DashboardPage
      title="Platform overview"
      description={`Signed in as ${admin.name}. Review shops, vendors and platform access.`}
      actions={
        <Link href="/dashboard/admin/vendors" className={buttonVariants()}>
          <ClipboardList className="size-4" aria-hidden />
          Manage vendors
        </Link>
      }
    >
      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="Platform data is unavailable"
          description={loadError}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total users"
              value={stats?.users.total ?? 0}
              hint="Registered accounts"
              icon={<Users aria-hidden />}
            />
            <StatCard
              label="Customers"
              value={stats?.users.customers ?? 0}
              hint={`${stats?.users.admins ?? 0} admins`}
              icon={<ShieldCheck aria-hidden />}
              accent="neutral"
            />
            <StatCard
              label="Vendors"
              value={stats?.users.vendors ?? 0}
              hint="Shop owners"
              icon={<Store aria-hidden />}
              accent="emerald"
            />
            <StatCard
              label="Pending menu items"
              value={stats?.menuItems.pending ?? 0}
              hint={`${stats?.menuItems.total ?? 0} items total`}
              icon={<UtensilsCrossed aria-hidden />}
              accent="amber"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <PerformanceChart
              title="Platform activity"
              description="Orders across the last seven days"
              data={stats?.weeklyOrders ?? []}
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
                    const applicant = usersById.get(application.userId);
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

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Menu moderation</CardTitle>
                <CardDescription>
                  Items split by their current approval status.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
                <Summary label="Approved" value={stats?.menuItems.approved ?? 0} />
                <Summary label="Pending" value={stats?.menuItems.pending ?? 0} />
                <Summary label="Rejected" value={stats?.menuItems.rejected ?? 0} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>
                  Read-only subscription revenue recorded by Stripe.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                <Summary
                  label="Completed payments"
                  value={stats?.transactions.completed ?? 0}
                />
                <Summary
                  label="Revenue (USD)"
                  value={`$${(stats?.transactions.revenue ?? 0).toFixed(2)}`}
                />
              </CardContent>
            </Card>
          </div>

          <QuickActions
            actions={[
              {
                href: "/dashboard/admin/vendors",
                title: "Vendors",
                description: "Review shops, suspend or reactivate access.",
                icon: <Store aria-hidden />,
              },
              {
                href: "/dashboard/admin/users",
                title: "Manage users",
                description: "Search accounts, block or restore access.",
                icon: <Users aria-hidden />,
              },
              {
                href: "/dashboard/admin/menu-items",
                title: "Menu library",
                description: "Approve, reject or remove menu items.",
                icon: <UtensilsCrossed aria-hidden />,
              },
              {
                href: "/dashboard/admin/transactions",
                title: "Transactions",
                description: "Inspect recorded subscription payments.",
                icon: <Receipt aria-hidden />,
              },
            ]}
          />
        </>
      )}
    </DashboardPage>
  );
}

function Summary({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-heading text-xl font-semibold">{value}</p>
    </div>
  );
}
