import type { Metadata } from "next";
import { AccountProfileCard } from "@/components/dashboard/account-profile-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import {
  ShopSummaryCard,
  VendorApplicationSummary,
} from "@/components/vendor/vendor-application-status";
import { ShopProfileCard } from "@/components/vendor/shop-profile-card";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Shop profile",
};

export default async function VendorProfilePage() {
  const { user, application, shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="My profile"
      description="Your SliceStack account and shop details."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountProfileCard
          key={`${user.id}-${user.name}-${user.email}-${user.image ?? ""}`}
          plan={shop.plan}
          user={user}
        />
        <ShopSummaryCard shop={shop} plan={shop.plan} />
        {application ? (
          <VendorApplicationSummary application={application} />
        ) : null}
      </div>
      <ShopProfileCard
        key={`${shop.id}-${shop.name}-${shop.updatedAt}`}
        shop={shop}
      />
    </DashboardPage>
  );
}
