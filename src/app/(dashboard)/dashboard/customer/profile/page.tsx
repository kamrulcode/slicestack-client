import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AccountProfileCard } from "@/components/dashboard/account-profile-card";
import { VendorApplicationStatusCard } from "@/components/vendor/vendor-application-status";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { getVendorApplicationForUser } from "@/lib/vendor-applications";

export const metadata: Metadata = {
  title: "My profile",
};

export default async function CustomerProfilePage() {
  const user = await requireRole(["customer"], "/dashboard/customer/profile");
  const application = await getVendorApplicationForUser(user.id);

  return (
    <DashboardPage
      title="My profile"
      description="Your SliceStack account details."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountProfileCard user={user} />

        <div className="flex flex-col gap-6">
          <VendorApplicationStatusCard application={application} />
          <EmptyState
            icon={<MapPin aria-hidden />}
            title="Delivery addresses"
            description="Saved addresses will live here. For now, add an address during checkout."
            action={
              <Link
                href="/menu"
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                Browse menu
              </Link>
            }
          />
        </div>
      </div>
    </DashboardPage>
  );
}
