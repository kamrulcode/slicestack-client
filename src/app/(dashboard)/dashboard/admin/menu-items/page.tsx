import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ClipboardList, Pizza, Search } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MenuItemCard } from "@/components/admin/menu-item-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { MenuItemStatus, VendorMenuItemRecord } from "@/types/menu";

export const metadata: Metadata = {
  title: "Menu Items",
};

export const dynamic = "force-dynamic";

const MENU_FILTERS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
] as const;

const STATUS_LABEL: Record<MenuItemStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

function isStatus(value: string | undefined): value is MenuItemStatus {
  return value === "approved" || value === "pending" || value === "rejected";
}

export default async function AdminMenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  await requireRole(["admin"], "/dashboard/admin/menu-items");

  const params = await searchParams;
  const selectedStatus = isStatus(params.status) ? params.status : "all";
  const search = typeof params.search === "string" ? params.search.trim() : "";

  let allItems: VendorMenuItemRecord[] = [];
  let items: VendorMenuItemRecord[] = [];
  let loadError: string | null = null;

  try {
    [allItems, items] = await Promise.all([
      serverApi.admin.menuItems(),
      serverApi.admin.menuItems({ status: selectedStatus, search }),
    ]);
  } catch (error) {
    loadError = errorMessage(error);
  }

  const countFor = (status: MenuItemStatus) =>
    allItems.filter((item) => item.status === status).length;

  return (
    <DashboardPage
      title="Menu Items"
      description="Review and manage menu items submitted by vendors."
      actions={
        <Link href="/menu" className={buttonVariants({ variant: "outline" })}>
          View public menu
        </Link>
      }
    >
      <form
        action="/dashboard/admin/menu-items"
        className="flex flex-col gap-2 sm:flex-row"
      >
        {selectedStatus !== "all" ? (
          <input type="hidden" name="status" value={selectedStatus} />
        ) : null}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by item, shop or category"
            className="pl-9"
            aria-label="Search menu items"
          />
        </div>
        <Button type="submit">Search</Button>
        {search ? (
          <Link
            href={
              selectedStatus === "all"
                ? "/dashboard/admin/menu-items"
                : `/dashboard/admin/menu-items?status=${selectedStatus}`
            }
            className={buttonVariants({ variant: "ghost" })}
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        {MENU_FILTERS.map((filter) => {
          const query = new URLSearchParams();
          if (filter.value !== "all") query.set("status", filter.value);
          if (search) query.set("search", search);
          const suffix = query.toString();
          const count =
            filter.value === "all" ? allItems.length : countFor(filter.value);

          return (
            <Link
              key={filter.value}
              href={`/dashboard/admin/menu-items${suffix ? `?${suffix}` : ""}`}
              className={buttonVariants({
                size: "sm",
                variant:
                  selectedStatus === filter.value ? "default" : "outline",
              })}
            >
              {filter.label} ({count})
            </Link>
          );
        })}
      </div>

      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load menu items"
          description={loadError}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={
            selectedStatus === "all" ? (
              <Pizza aria-hidden />
            ) : (
              <ClipboardList aria-hidden />
            )
          }
          title={
            search
              ? "No items match this search"
              : selectedStatus === "all"
                ? "No menu items yet"
                : `No ${STATUS_LABEL[selectedStatus].toLowerCase()} menu items`
          }
          description="Menu items submitted by vendors will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}
