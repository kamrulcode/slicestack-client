import type { Metadata } from "next";
import { ShopSummaryCard, VendorApplicationSummary } from "@/components/vendor/vendor-application-status";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Shop profile",
};

export default async function VendorProfilePage() {
  const { application, shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Shop profile"
      description="These are the details customers see on your storefront."
    >
      <div className="grid gap-6 lg:grid-cols-2">
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
