import type { Metadata } from "next";
import Link from "next/link";
import { Plus, UtensilsCrossed } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";
import { VendorMenuItems } from "@/components/vendor/vendor-menu-items";
import { getMenuData } from "@/data/action/getData";

export const metadata: Metadata = {
  title: "Menu items",
};

export default async function VendorMenuItemsPage() {
  const { shop, user } = await requireVendorWorkspace();
  const menusItems = await getMenuData(user.id);

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
      {menusItems.length > 0 ? (
        <VendorMenuItems menusItems={menusItems} ownerId={user.id} />
      ) : (
        <EmptyState
          icon={<UtensilsCrossed aria-hidden />}
          title="Your menu is empty"
          description="Your shop has no menu items yet. Add your first item to start building your menu."
          action={
            <Link
              href="/dashboard/vendor/menu-items/add"
              className={buttonVariants({ size: "sm" })}
            >
              Add your first item
            </Link>
          }
        />
      )}
    </DashboardPage>
  );
}
