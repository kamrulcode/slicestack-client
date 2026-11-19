import type { Metadata } from "next";
import Link from "next/link";
import { Plus, UtensilsCrossed } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Menu items",
};

export default async function VendorMenuItemsPage() {
  const { shop } = await requireVendorWorkspace();

  return (
    <DashboardPage
      title="Menu items"
      description={`Pizzas, sides and drinks for ${shop.name}.`}
      actions={
        <Link
          href="/dashboard/vendor/menu-items/add"
          className={buttonVariants()}
        >
          <Plus className="size-4" aria-hidden />
          Add menu item
        </Link>
      }
    >
      <EmptyState
        icon={<UtensilsCrossed aria-hidden />}
        title="Your menu is empty"
        description="Menu management is the next module we will connect. Until then, this workspace is ready for your first pizza."
        action={
          <Link
            href="/dashboard/vendor/menu-items/add"
            className={buttonVariants({ size: "sm" })}
          >
            Add your first item
          </Link>
        }
      />
    </DashboardPage>
  );
}
