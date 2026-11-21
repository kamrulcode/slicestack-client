import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { VendorMenuItems } from "@/components/vendor/vendor-menu-items";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";
import { serverApi } from "@/services/server";

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

  const items = await serverApi.menu.vendorItems();
  const item = items.find((entry) => entry._id === menuID);

  if (!item) notFound();

  return (
    <DashboardPage
      title={item.itemName}
      description={`Editing items for ${shop.name}.`}
      actions={
        <Link
          href="/dashboard/vendor/menu-items"
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to menu items
        </Link>
      }
    >
      <VendorMenuItems menusItems={[item]} />
    </DashboardPage>
  );
}
