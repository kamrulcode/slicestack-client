import type { Metadata } from "next";
import { BadgeCheck, Receipt } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Subscription",
};

export default async function VendorSubscriptionPage() {
  await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Subscription"
      description="Your SliceStack vendor plan and billing."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Starter plan
              <BadgeCheck className="size-4 text-emerald-600" aria-hidden />
            </CardTitle>
            <CardDescription>
              Included with your approved vendor account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Manage your shop, menu and orders from your dashboard. Subscription
            billing will be connected in a later module.
          </CardContent>
        </Card>
        <EmptyState
          icon={<Receipt aria-hidden />}
          title="No invoices yet"
          description="Billing history will appear here when subscriptions launch."
        />
      </div>
    </DashboardPage>
  );
}
