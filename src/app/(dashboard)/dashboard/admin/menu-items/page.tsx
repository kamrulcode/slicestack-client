import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { AdminMenuItemsList } from "@/components/admin/admin-menu-items-list";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { MenuItemStatus, VendorMenuItemRecord } from "@/types/menu";

export const metadata: Metadata = {
  title: "Menu Items",
};

export const dynamic = "force-dynamic";

function isStatus(value: string | undefined): value is MenuItemStatus {
  return value === "approved" || value === "pending" || value === "rejected";
}

export default async function AdminMenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  await requireRole(["admin"]);

  const params = await searchParams;
  const selectedStatus = isStatus(params.status) ? params.status : "all";
  const search = typeof params.search === "string" ? params.search.trim() : "";

  let allItems: VendorMenuItemRecord[] = [];
  let loadError: string | null = null;

  try {
    allItems = await serverApi.admin.menuItems();
  } catch (error) {
    loadError = errorMessage(error);
  }

  return (
    <DashboardPage
      title="Menu Items"
      description="Review and manage menu items submitted by vendors."
      animateChildren={false}
      actions={
        <Link href="/menu" className={buttonVariants({ variant: "outline" })}>
          View public menu
        </Link>
      }
    >
      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load menu items"
          description={loadError}
        />
      ) : (
        <AdminMenuItemsList
          items={allItems}
          initialStatus={selectedStatus}
          initialSearch={search}
        />
      )}
    </DashboardPage>
  );
}
