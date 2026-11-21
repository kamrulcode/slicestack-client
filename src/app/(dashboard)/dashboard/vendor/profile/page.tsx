import type { Metadata } from "next";
import { AccountProfileCard } from "@/components/dashboard/account-profile-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import {
  ShopSummaryCard,
  VendorApplicationSummary,
} from "@/components/vendor/vendor-application-status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          user={user}
        />
        <ShopSummaryCard shop={shop} />
        {application ? <VendorApplicationSummary application={application} /> : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Editing shop details</CardTitle>
          <CardDescription>
            Profile editing will be added with the shop settings module.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          To change your shop name, address or contact number today, contact the
          SliceStack team. Only the shop owner can modify shop data.
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
