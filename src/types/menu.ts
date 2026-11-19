export type PizzaCategoryId =
  | "classic"
  | "vegetarian"
  | "meat-lovers"
  | "specialty";

export type MenuCategoryId = PizzaCategoryId | "sides" | "beverages";

export type PizzaArtVariant =
  | "pepperoni"
  | "garden"
  | "cheese"
  | "meat"
  | "bbq"
  | "margherita";

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  emoji: string;
  blurb: string;
  href: string;
}

export interface Pizza {
  slug: string;
  name: string;
  categoryId: PizzaCategoryId;
  price: number;
  art: PizzaArtVariant;
  description: string;
}
