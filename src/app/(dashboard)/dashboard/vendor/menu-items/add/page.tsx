import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Add menu item",
};

export default async function VendorAddMenuItemPage() {
  const { shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Add menu item"
      description={`Create a new item for ${shop.name}.`}
    >
      <EmptyState
        icon={<ImagePlus aria-hidden />}
        title="Menu editor coming soon"
        description="The form for name, price, photo and availability will live here after the menu module is added."
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
