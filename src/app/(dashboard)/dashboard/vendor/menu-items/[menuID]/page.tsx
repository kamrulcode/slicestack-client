import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Edit menu item",
};

export default async function VendorMenuItemPage({
  params,
}: {
  params: Promise<{ menuID: string }>;
}) {
  const { shop } = await requireVendorWorkspace();
  const { menuID } = await params;

  return (
    <DashboardPage
      title={`Menu item ${menuID}`}
      description={`Editing items for ${shop.name}.`}
    >
      <EmptyState
        icon={<PackageSearch aria-hidden />}
        title="Menu item editor coming soon"
        description="This page is guarded for your shop only. The editor arrives with the menu module."
        action={
          <Link
            href="/dashboard/vendor/menu-items"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to menu items
          </Link>
        }
      />
    </DashboardPage>
  );
}
