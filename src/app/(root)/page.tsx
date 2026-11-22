import { CategoryGrid } from "@/components/home/category-grid";
import { FeaturedPizzas } from "@/components/home/featured-pizzas";
import { Hero } from "@/components/home/hero";
import FeaturesSection from "@/components/home/hero-features";
import PizzaSections from "@/components/home/how-it-works";
import CustomerReviews from "@/components/layout/customerReview";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <FeaturedPizzas />
      <CategoryGrid />
      <PizzaSections />
      <CustomerReviews />
    </>
  );
}
