import type { MenuCategory, Pizza, PizzaCategoryId } from "@/types/menu";

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
    name: "Specialty / Gourmet",
    emoji: "⭐",
    blurb: "Chef-inspired pies with a gourmet twist.",
    href: "/menu#specialty",
  },
  {
    id: "sides",
    name: "Sides & Appetizers",
    emoji: "🍟",
    blurb: "Perfect little extras for the table.",
    href: "/menu",
  },
  {
    id: "beverages",
    name: "Beverages & Desserts",
    emoji: "🥤",
    blurb: "Cold drinks and sweet finishes.",
    href: "/menu",
  },
];

export const pizzas: Pizza[] = [
  {
    slug: "classic-pepperoni",
    name: "Classic Pepperoni",
    categoryId: "classic",
    price: 450,
    art: "pepperoni",
    description:
      "Pepperoni, stretchy mozzarella and our signature tomato sauce on a hand-tossed crust.",
  },
  {
    slug: "garden-fresh",
    name: "Garden Fresh",
    categoryId: "vegetarian",
    price: 390,
    art: "garden",
    description:
      "Bell peppers, olives, cherry tomatoes and basil over a generous layer of mozzarella.",
  },
  {
    slug: "cheese-burst",
    name: "Cheese Burst",
    categoryId: "specialty",
    price: 520,
    art: "cheese",
    description:
      "A triple-cheese blend with a molten mozzarella-stuffed crust for the ultimate cheese pull.",
  },
  {
    slug: "bbq-chicken",
    name: "BBQ Chicken",
    categoryId: "meat-lovers",
    price: 490,
    art: "bbq",
    description:
      "Smoky BBQ sauce, grilled chicken, red onion and a bubbling mozzarella finish.",
  },
  {
    slug: "loaded-supreme",
    name: "Loaded Supreme",
    categoryId: "specialty",
    price: 560,
    art: "meat",
    description:
      "Pepperoni, sausage, smoky bacon, olives and peppers — everything but the kitchen sink.",
  },
  {
    slug: "margherita",
    name: "Margherita",
    categoryId: "vegetarian",
    price: 420,
    art: "margherita",
    description:
      "Classic tomato sauce, fresh mozzarella and aromatic basil on a blistered crust.",
  },
];

export const pizzaCategoryOrder: PizzaCategoryId[] = [
  "classic",
  "vegetarian",
  "meat-lovers",
  "specialty",
];

export function getCategoryName(id: PizzaCategoryId) {
  return menuCategories.find((category) => category.id === id)?.name ?? id;
}

export function getPizzaBySlug(slug: string) {
  return pizzas.find((pizza) => pizza.slug === slug);
}

export function getPizzasByCategory(id: PizzaCategoryId) {
  return pizzas.filter((pizza) => pizza.categoryId === id);
}
