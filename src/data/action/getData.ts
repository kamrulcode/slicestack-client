import { BASE_URL } from "@/config/baseURL";
import type { MenuItem, VendorMenuItemRecord } from "@/types/menu";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isMenuItem(value: unknown): value is MenuItem {
  if (!isRecord(value)) return false;

  return (
    typeof value._id === "string" &&
    typeof value.itemName === "string" &&
    typeof value.category === "string" &&
    typeof value.description === "string" &&
    typeof value.price === "number" &&
    Number.isFinite(value.price) &&
    Array.isArray(value.images) &&
    value.images.length > 0 &&
    value.images.every((image) => typeof image === "string") &&
    (value.location === undefined || typeof value.location === "string") &&
    (value.status === undefined || typeof value.status === "string") &&
    (value.isAvailable === undefined ||
      typeof value.isAvailable === "boolean") &&
    (value.logoUrl === undefined ||
      typeof value.logoUrl === "string" ||
      value.logoUrl === null) &&
    (value.shopName === undefined || typeof value.shopName === "string")
  );
}

function isVendorMenuItem(value: unknown): value is VendorMenuItemRecord {
  return isMenuItem(value) && "ownerId" in value && typeof value.ownerId === "string";
}

export const getPublicMenuItems = async (): Promise<MenuItem[]> => {
  const response = await fetch(`${BASE_URL}/api/menu-items`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load menu items (${response.status}).`);
  }

  const menus: unknown = await response.json();

  if (!Array.isArray(menus) || !menus.every(isMenuItem)) {
    throw new Error("Invalid menu item data.");
  }

  return menus;
};

// Vendor dashboard: Only vendor's own menu items
export const getMenuData = async (
  ownerId: string,
): Promise<VendorMenuItemRecord[]> => {
  if (!ownerId) {
    throw new Error("An owner ID is required.");
  }

  const response = await fetch(
    `${BASE_URL}/api/menu-items/vendor/${encodeURIComponent(ownerId)}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Unable to load menu items (${response.status}).`);
  }

  const menus: unknown = await response.json();

  if (!Array.isArray(menus) || !menus.every(isVendorMenuItem)) {
    throw new Error("Invalid menu item data.");
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
