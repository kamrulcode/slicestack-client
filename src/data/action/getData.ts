import { BASE_URL } from "@/config/baseURL";
import type { VendorMenuItemRecord } from "@/types/menu";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isVendorMenuItem(value: unknown): value is VendorMenuItemRecord {
  if (!isRecord(value)) return false;

  return (
    typeof value._id === "string" &&
    typeof value.itemName === "string" &&
    typeof value.category === "string" &&
    typeof value.description === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    (value.location === undefined || typeof value.location === "string") &&
    (value.image === undefined ||
      typeof value.image === "string" ||
      value.image === null) &&
    (value.status === undefined || typeof value.status === "string") &&
    (value.isAvailable === undefined ||
      typeof value.isAvailable === "boolean") &&
    (value.logoUrl === undefined ||
      typeof value.logoUrl === "string" ||
      value.logoUrl === null) &&
    (value.shopName === undefined || typeof value.shopName === "string") &&
    typeof value.ownerId === "string"
  );
}

export const getMenuData = async (
  ownerId: string,
): Promise<VendorMenuItemRecord[]> => {
  if (!ownerId) {
    throw new Error("An owner ID is required to load menu items.");
  }

  const response = await fetch(
    `${BASE_URL}/api/menu-items?ownerId=${encodeURIComponent(ownerId)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load menu items (${response.status}).`);
  }

  const menus: unknown = await response.json();
  if (!Array.isArray(menus) || !menus.every(isVendorMenuItem)) {
    throw new Error("The menu service returned invalid menu item data.");
  }

  return menus;
};

export const getShopData = async () => {
  const res = await fetch(`${BASE_URL}/api/shops`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Unable to load shops (${res.status}).`);
  }
  const shop = await res.json();
  return shop;
};
