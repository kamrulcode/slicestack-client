import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions about ordering on SliceStack.",
};

const SECTIONS = [
  {
    heading: "Placing an order",
    body: "Sign in, browse the menu, open an item and choose Order now. Add your delivery date, address and any special instructions, then confirm. The partner shop will accept or decline the order.",
  },
  {
    heading: "Tracking an order",
    body: "Your customer dashboard lists every order with its current status. Open an order to see the shop, delivery details and the status timeline.",
  },
  {
    heading: "Changing or cancelling an order",
    body: "You can cancel an order from its detail page while it is still pending. Once a shop has accepted an order, contact the shop directly if something needs to change.",
  },
  {
    heading: "Payments and subscriptions",
    body: "Vendor subscription payments are handled securely by Stripe. SliceStack never stores your card number. A premium plan activates only after Stripe confirms the payment.",
  },
  {
    heading: "Still need help?",
    body: "Visit the contact page and send us a message. Include your account email and, if it relates to an order, the order reference so we can help faster.",
  },
];

export default function HelpPage() {
  return (
    <ContentPage
      title="Help Center"
      intro="Quick answers to the questions we hear most often."
      sections={SECTIONS}
    >
      <Link
        href="/contact"
        className="text-sm font-semibold text-primary hover:underline"
      >
        Contact the SliceStack team →
      </Link>
    </ContentPage>
  );
}
