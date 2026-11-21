import type { MenuCategory, MenuItem } from "@/types/menu";

export const menuCategories: MenuCategory[] = [
  {
    id: "classic",
    name: "Classic Pizzas",
    emoji: "🍕",
    blurb: "The tried-and-true favorites, done right.",
    href: "/menu#classic",
  },
  {
    id: "vegetarian",
    name: "Vegetarian Pizzas",
    emoji: "🥦",
    blurb: "Garden-fresh toppings on a crispy crust.",
    href: "/menu#vegetarian",
  },
  {
    id: "meat-lovers",
    name: "Meat Lovers",
    emoji: "🍖",
    blurb: "Loaded with protein for serious appetites.",
    href: "/menu#meat-lovers",
  },
  {
    id: "specialty",
    name: "Specialty / Gourmet Pizzas",
    emoji: "⭐",
    blurb: "Chef-inspired pies with a gourmet twist.",
    href: "/menu#specialty",
  },
  {
    id: "sides",
    name: "Sides & Appetizers",
    emoji: "🍟",
    blurb: "Perfect little extras for the table.",
    href: "/menu#sides",
  },
  {
    id: "beverages",
    name: "Beverages & Desserts",
    emoji: "🥤",
    blurb: "Cold drinks and sweet finishes.",
    href: "/menu#beverages",
  },
];

export function getCategoryName(category: string) {
  return (
    menuCategories.find((menuCategory) => menuCategory.name === category)
      ?.name ?? category
  );
}

export function getMenuItemsByCategory(items: MenuItem[], category: string) {
  return items.filter((item) => item.category === category);
}
