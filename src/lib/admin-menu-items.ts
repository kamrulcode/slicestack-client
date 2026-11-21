import { BASE_URL } from "@/config/baseURL";
import type { VendorMenuItemRecord, MenuItemStatus } from "@/types/menu";

export async function getAdminMenuItems(
  status?: MenuItemStatus,
): Promise<VendorMenuItemRecord[]> {
  const params = new URLSearchParams();

  if (status) {
    params.set("status", status);
  }

  const response = await fetch(
    `${BASE_URL}/api/admin/menu-items?${params.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error("Unable to load menu items.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Invalid menu item data.");
  }

  return data as VendorMenuItemRecord[];
}
