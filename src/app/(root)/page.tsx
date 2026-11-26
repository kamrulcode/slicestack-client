import { CategoryGrid } from "@/components/home/category-grid";
import ComboOffer from "@/components/home/combo-offer";
import { FeaturedPizzas } from "@/components/home/featured-pizzas";
import { Hero } from "@/components/home/hero";
import FeaturesSection from "@/components/home/hero-features";
import CustomerReviews from "@/components/layout/customerReview";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <FeaturedPizzas />
      <CategoryGrid />
      <ComboOffer />
      <Suspense>
        <CustomerReviews />
      </Suspense>
    </>
  );
}
