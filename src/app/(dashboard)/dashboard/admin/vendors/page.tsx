import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Store } from "lucide-react";
import { VendorApplicationCard } from "@/components/admin/vendor-application-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { getUsersByIds } from "@/lib/users";
import { listVendorApplications } from "@/lib/vendor-applications";
import {
  VENDOR_APPLICATION_STATUSES,
  VENDOR_STATUS_LABEL,
  type VendorApplicationStatus,
} from "@/types/vendor";

export const metadata: Metadata = {
  title: "Vendor applications",
};

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

  const applications = await listVendorApplications();
  const filtered = status
    ? applications.filter((application) => application.status === status)
    : applications;
  const applicants = await getUsersByIds(
    filtered.map((application) => application.userId),
  );

  const countFor = (value: VendorApplicationStatus) =>
    applications.filter((application) => application.status === value).length;

  return (
    <DashboardPage
      title="Vendor applications"
      description="Review shop applications. Approving assigns the vendor role and activates the shop in one transaction."
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
          All ({applications.length})
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

      {filtered.length === 0 ? (
        <EmptyState
          icon={status ? <ClipboardList aria-hidden /> : <Store aria-hidden />}
          title={
            status
              ? `No ${VENDOR_STATUS_LABEL[status].toLowerCase()} applications`
              : "No vendor applications yet"
          }
          description={
            status
              ? "Try another status filter to see more applications."
              : "When customers apply to open a shop, their applications will appear here for review."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((application) => (
            <VendorApplicationCard
              key={application.id}
              application={application}
              applicant={applicants.get(application.userId)}
            />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}

export const dynamic = "force-dynamic";
