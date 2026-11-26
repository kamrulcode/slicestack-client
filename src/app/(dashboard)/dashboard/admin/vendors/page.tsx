import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { VendorApplicationsList } from "@/components/admin/vendor-applications-list";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";

import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";

import type { PlatformUser } from "@/types/admin";
import {
  VENDOR_APPLICATION_STATUSES,
  type VendorApplication,
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
  await requireRole(["admin"]);

  const params = await searchParams;

  const initialStatus = VENDOR_APPLICATION_STATUSES.find(
    (value) => value.toLowerCase() === params.status?.toLowerCase(),
  );

  let allApplications: VendorApplication[] = [];
  let users: PlatformUser[] = [];
  let loadError: string | null = null;

  // Fetch both APIs independently.
  const [applicationsResult, usersResult] = await Promise.allSettled([
    serverApi.admin.vendorApplications(),
    serverApi.admin.users(),
  ]);

  // Vendor applications are the primary data.
  if (applicationsResult.status === "fulfilled") {
    allApplications = applicationsResult.value;
  } else {
    loadError = errorMessage(applicationsResult.reason);
  }

  // Users are supplementary applicant information.
  // Their failure should not prevent applications from rendering.
  if (usersResult.status === "fulfilled") {
    users = usersResult.value;
  }

  return (
    <DashboardPage
      title="Vendors"
      description="New vendor accounts activate instantly at signup. Use this page to review shop details and suspend or reactivate access."
      animateChildren={false}
      actions={
        <Link
          href="/dashboard/admin/users"
          className={buttonVariants({ variant: "outline" })}
        >
          View users
        </Link>
      }
    >
      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load vendor applications"
          description={loadError}
        />
      ) : (
        <VendorApplicationsList
          applications={allApplications}
          users={users}
          initialStatus={initialStatus ?? null}
        />
      )}
    </DashboardPage>
  );
}
