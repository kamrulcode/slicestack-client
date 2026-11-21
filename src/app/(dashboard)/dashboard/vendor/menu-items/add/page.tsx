import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";
import AddMenuItemForm from "@/components/vendor/vendor-add-menu";

export const metadata: Metadata = {
  title: "Add menu item",
};

export default async function VendorAddMenuItemPage() {
  const { shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Add menu item"
      description={`Create a new item for ${shop.name}.`}
      actions={
        <Link
          href="/dashboard/vendor/menu-items"
          className={buttonVariants({ size: "sm", variant: "outline" })}
        >
          <ArrowLeft />
          Back to menu items
        </Link>
      }
    >
      <AddMenuItemForm />
    </DashboardPage>
  );
}
