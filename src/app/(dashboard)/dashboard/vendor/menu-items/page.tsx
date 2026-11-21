import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Plus, UtensilsCrossed } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireVendorWorkspace } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import { VendorMenuItems } from "@/components/vendor/vendor-menu-items";
import type { VendorMenuItemRecord } from "@/types/menu";

export const metadata: Metadata = {
  title: "Menu items",
};

export default async function VendorMenuItemsPage() {
  const { shop } = await requireVendorWorkspace();

  let menusItems: VendorMenuItemRecord[] = [];
  let loadError: string | null = null;

  try {
    menusItems = await serverApi.menu.vendorItems();
  } catch (error) {
    loadError = errorMessage(error);
  }

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
      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load your menu"
          description={loadError}
        />
      ) : menusItems.length > 0 ? (
        <VendorMenuItems menusItems={menusItems} />
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
