import type { Metadata } from "next";
import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why SliceStack exists and how our partner kitchens work.",
};

const SECTIONS = [
  {
    heading: "Our story",
    body: "SliceStack started with a simple idea: great pizza should be easy to find, easy to order and delivered while it is still hot. We bring local kitchens and hungry neighbours together in one storefront.",
  },
  {
    heading: "How it works",
    body: "Browse the menu, pick a pizza from a partner kitchen near you, and place your order. The shop accepts it, prepares it fresh and delivers it to the address you provide. You can follow every order from your dashboard.",
  },
  {
    heading: "Our partner kitchens",
    body: "Every vendor on SliceStack is reviewed before their shop goes live. Menu items are checked by our team, and vendors keep their prices, availability and contact details up to date.",
  },
  {
    heading: "What we care about",
    body: "Fresh ingredients, honest menus and reliable delivery. If something goes wrong with an order, our support team is here to help make it right.",
  },
];

export default function AboutPage() {
  return (
    <ContentPage
      title="About SliceStack"
      intro="Fresh slices. Fast delivery. Good times — and the people who make it happen."
      sections={SECTIONS}
    />
  );
}
