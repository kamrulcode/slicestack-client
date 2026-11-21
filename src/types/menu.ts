export type MenuCategoryId =
  | "classic"
  | "vegetarian"
  | "meat-lovers"
  | "specialty"
  | "sides"
  | "beverages";

export type PizzaArtVariant =
  | "pepperoni"
  | "garden"
  | "cheese"
  | "meat"
  | "bbq"
  | "margherita";

export type MenuItemStatus = "pending" | "approved" | "rejected";

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  emoji: string;
  blurb: string;
  href: string;
}

export interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  location?: string;
  status?: MenuItemStatus;
  isAvailable?: boolean;
  logoUrl?: string | null;
  shopName?: string;
}

export interface VendorMenuItemRecord extends MenuItem {
  ownerId: string;
}

export interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  location?: string;
  status?: MenuItemStatus;
  isAvailable?: boolean;
  logoUrl?: string | null;
  shopName?: string;
}

export interface VendorMenuItemRecord extends MenuItem {
  ownerId: string;
}
