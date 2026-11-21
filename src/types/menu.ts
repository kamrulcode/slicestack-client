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
  rejectionReason?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItemRating {
  average: number;
  count: number;
}

export interface MenuItemShop {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  logoUrl: string | null;
  status: string;
}

export interface MenuItemDetail {
  item: MenuItem & { ownerId: string };
  shop: MenuItemShop | null;
  rating: MenuItemRating;
}

export interface MenuItemReview {
  _id: string;
  menuItemId: string;
  customerId: string;
  customerName: string;
  customerImage?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PublicMenuFilters {
  search?: string;
  category?: string;
  location?: string;
}
