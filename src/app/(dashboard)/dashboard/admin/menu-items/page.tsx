import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Pizza } from "lucide-react";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MenuItemCard } from "@/components/admin/menu-item-card";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { getAdminMenuItems } from "@/lib/admin-menu-items";
import type { MenuItemStatus } from "@/types/menu";

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

export default async function AdminMenuItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireRole(["admin"], "/dashboard/admin/menu-items");

  const params = await searchParams;

  const selectedStatus =
    MENU_FILTERS.find((filter) => filter.value === params.status)?.value ??
    "all";
  const allItems = await getAdminMenuItems();
  const filteredItems =
    selectedStatus === "all"
      ? allItems
      : allItems.filter((item) => item.status === selectedStatus);

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
      <div className="flex flex-wrap gap-2">
        {MENU_FILTERS.map((filter) => {
          const count =
            filter.value === "all" ? allItems.length : countFor(filter.value);

          return (
            <Link
              key={filter.value}
              href={
                filter.value === "all"
                  ? "/dashboard/admin/menu-items"
                  : `/dashboard/admin/menu-items?status=${filter.value}`
              }
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

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={
            selectedStatus === "all" ? (
              <Pizza aria-hidden />
            ) : (
              <ClipboardList aria-hidden />
            )
          }
          title={
            selectedStatus === "all"
              ? "No menu items yet"
              : `No ${STATUS_LABEL[selectedStatus].toLowerCase()} menu items`
          }
          description="Menu items submitted by vendors will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </DashboardPage>
  );
}

// import type { Metadata } from "next";
// import Link from "next/link";
// import { UtensilsCrossed } from "lucide-react";
// import { DashboardPage } from "@/components/dashboard/dashboard-page";
// import { EmptyState } from "@/components/dashboard/empty-state";
// import { buttonVariants } from "@/components/ui/button";
// import { requireRole } from "@/lib/authorization";

// export const metadata: Metadata = {
//   title: "Platform menu items",
// };

// export default async function AdminMenuItemsPage() {
//   await requireRole(["admin"], "/dashboard/admin/menu-items");

//   return (
//     <DashboardPage
//       title="Menu items"
//       description="A platform-wide view of every vendor's menu."
//     >
//       <EmptyState
//         icon={<UtensilsCrossed aria-hidden />}
//         title="Menu moderation is on the way"
//         description="Vendor menus will be searchable and moderatable from here once the menu module is connected."
//         action={
//           <Link
//             href="/dashboard/admin"
//             className={buttonVariants({ size: "sm", variant: "outline" })}
//           >
//             Back to overview
//           </Link>
//         }
//       />
//     </DashboardPage>
//   );
// }
