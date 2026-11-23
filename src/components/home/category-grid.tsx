import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Classic Pizzas",
    category: "Classic Pizzas",
    subtitle: "Timeless favorites",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
    emoji: "🍕",
  },
  {
    name: "Vegetarian Pizzas",
    category: "Vegetarian Pizzas",
    subtitle: "Fresh & wholesome",
    image:
      "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=85",
    emoji: "🥬",
  },
  {
    name: "Meat Lovers",
    category: "Meat Lovers",
    subtitle: "For true meat fans",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=85",
    emoji: "🥩",
  },
  {
    name: "Specialty / Gourmet Pizzas",
    category: "Specialty / Gourmet Pizzas",
    subtitle: "Smoky & bold",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=85",
    emoji: "🔥",
  },
  {
    name: "Sides & Appetizers",
    category: "Sides & Appetizers",
    subtitle: "Perfect little extras",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=85",
    emoji: "🌶️",
  },
  {
    name: "Beverages & Desserts",
    category: "Beverages & Desserts",
    subtitle: "Sweet finishes & sips",
    image:
      "https://img-cdn.publive.online/fit-in/1200x675/filters:format(webp)/sanjeev-kapoor/media/post_banners/dd1fda8c2a3f9dc1e4b3dc2cb420485923a6a49fd8160ed926dfb667276de8c4.jpg",
    emoji: "🧀",
  },
];

export function CategoryGrid() {
  return (
    <section className="relative py-24 px-6 bg-background">
      {/* CATEGORY SECTION */}
      <div className="max-w-7xl mx-auto">
        {/* HEADING */}
        <div className="text-center mb-14">
          <span
            className="text-[#FF404C] dark:text-[#FFB340] text-sm font-bold
              uppercase tracking-[0.25em]"
          >
            Our Categories
          </span>

          <h2 className="text-4xl md:text-5xl font-black mt-4">
            Explore{" "}
            <span className="text-[#FF404C] dark:text-[#FFB340]">
              6 Delicious Categories
            </span>
          </h2>

          <p className="text-muted-foreground mt-4 text-lg">
            Find your favorite pizza style and enjoy every bite.
          </p>
        </div>

        {/* CATEGORY CARDS */}
        <div
          className="grid grid-cols-2 md:grid-cols-3
            lg:grid-cols-6 gap-5"
        >
          {categories.map((category) => (
            <Link
              href={`/menu/menu-catagory?category=${encodeURIComponent(category.category)}`}
              key={category.name}
              className="group relative rounded-2xl overflow-hidden
                  border border-border hover:border-ember
                  transition duration-300 hover:-translate-y-2
                  bg-card text-card-foreground"
            >
              {/* IMAGE */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
                  unoptimized
                  className="object-cover
                      group-hover:scale-110 transition
                      duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 text-center">
                <div className="text-2xl mb-2">{category.emoji}</div>

                <h3
                  className="font-bold text-card-foreground
                    group-hover:text-ember
                    transition"
                >
                  {category.name}
                </h3>

                <p className="text-muted-foreground text-sm mt-2">
                  {category.subtitle}
                </p>

                <div
                  className="mt-4 text-[#FF404C] dark:text-[#FFB340]
                    text-sm font-bold"
                >
                  Explore →
                </div>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 pointer-events-none
                  opacity-0 group-hover:opacity-100
                  transition duration-300
                  shadow-[inset_0_0_30px_rgba(255,179,64,0.15)]"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
