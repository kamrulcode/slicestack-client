import { CategoryGrid } from "@/components/home/category-grid";
import CustomerReviews from "@/components/home/CustomerReview";
import { FeaturedPizzas } from "@/components/home/featured-pizzas";
import { Hero } from "@/components/home/hero";
import FeaturesSection from "@/components/home/hero-features";
import { HowItWorks } from "@/components/home/how-it-works";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <FeaturedPizzas />
      <CategoryGrid />
      <HowItWorks />
      <CustomerReviews />
    </>
  );
}
