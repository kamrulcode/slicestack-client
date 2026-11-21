import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardList, Store } from "lucide-react";
import { VendorApplicationCard } from "@/components/admin/vendor-application-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { PlatformUser } from "@/types/admin";
import {
  VENDOR_APPLICATION_STATUSES,
  VENDOR_STATUS_LABEL,
  type VendorApplication,
  type VendorApplicationStatus,
} from "@/types/vendor";

export const metadata: Metadata = {
  title: "Vendors",
};

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole(["admin"], "/dashboard/admin/vendors");

  const params = await searchParams;
  const status = VENDOR_APPLICATION_STATUSES.find(
    (value) => value === params.status,
  );

  let allApplications: VendorApplication[] = [];
  let applications: VendorApplication[] = [];
  let users: PlatformUser[] = [];
  let loadError: string | null = null;

  try {
    [allApplications, applications, users] = await Promise.all([
      serverApi.admin.vendorApplications(),
      serverApi.admin.vendorApplications(status ?? "all"),
      serverApi.admin.users(),
    ]);
  } catch (error) {
    loadError = errorMessage(error);
  }

  const applicants = new Map(users.map((user) => [user.id, user]));

  const countFor = (value: VendorApplicationStatus) =>
    allApplications.filter((application) => application.status === value)
      .length;

  return (
    <DashboardPage
      title="Vendors"
      description="New vendor accounts activate instantly at signup. Use this page to review shop details and suspend or reactivate access."
      actions={
        <Link
          href="/dashboard/admin/users"
          className={buttonVariants({ variant: "outline" })}
        >
          View users
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/admin/vendors"
          className={buttonVariants({
            size: "sm",
            variant: status ? "outline" : "default",
          })}
        >
          All ({allApplications.length})
        </Link>
        {VENDOR_APPLICATION_STATUSES.map((value) => (
          <Link
            key={value}
            href={`/dashboard/admin/vendors?status=${value}`}
            className={buttonVariants({
              size: "sm",
              variant: status === value ? "default" : "outline",
            })}
          >
            {VENDOR_STATUS_LABEL[value]} ({countFor(value)})
          </Link>
        ))}
      </div>

      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load vendor applications"
          description={loadError}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={status ? <ClipboardList aria-hidden /> : <Store aria-hidden />}
          title={
            status
              ? `No ${VENDOR_STATUS_LABEL[status].toLowerCase()} applications`
              : "No vendor applications yet"
          }
          description={
            status
              ? "Try another status filter to see more vendors."
              : "Vendors appear here as soon as they activate their shop at signup."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((application) => (
            <VendorApplicationCard
              key={application.userId}
              application={application}
              applicant={applicants.get(application.userId)}
            />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
