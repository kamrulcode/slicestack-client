import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/common/content-page";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Location",
  description: "Where SliceStack delivers and how to find partner kitchens.",
};

const SECTIONS = [
  {
    heading: "Where we deliver",
    body: "SliceStack is a marketplace for local kitchens, so delivery areas are set by each partner shop. Open the menu and check the shop details on any item to see where it delivers.",
  },
  {
    heading: "Finding a kitchen near you",
    body: "Every menu item lists the partner shop and its location. Filter the menu by category, then open an item to see the shop name and area before you order.",
  },
  {
    heading: "Running a kitchen?",
    body: "If you run a pizza shop and would like to sell on SliceStack, create an account and register as a vendor. Our team reviews every application before the shop goes live.",
  },
];

export default function LocationPage() {
  return (
    <ContentPage
      title="Location & delivery"
      intro="SliceStack works with local kitchens. Here is how to find one that delivers to you."
      sections={SECTIONS}
    >
      <Link href="/menu" className={buttonVariants({ className: "rounded-full" })}>
        Browse the menu
      </Link>
    </ContentPage>
  );
}
