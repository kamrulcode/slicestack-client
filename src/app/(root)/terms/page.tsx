import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use SliceStack.",
};

const SECTIONS = [
  {
    heading: "Using SliceStack",
    body: "You need an account to order food or to sell on SliceStack. Keep your password private and tell us straight away if you think someone else has accessed your account. Accounts that are blocked by our team cannot place orders or manage a shop.",
  },
  {
    heading: "Orders and delivery",
    body: "An order becomes binding once the shop accepts it. Delivery dates, addresses and special instructions are shared with the shop so it can prepare and deliver your food. Shops may reject an order, for example when the item is unavailable or the address is outside their delivery area.",
  },
  {
    heading: "Payments",
    body: "Vendor subscriptions are processed by Stripe. SliceStack never sees or stores your full card details. A premium plan only activates after Stripe confirms the payment, and a failed or cancelled payment never changes your plan.",
  },
  {
    heading: "Vendor responsibilities",
    body: "Vendors must keep menu items, prices, availability and contact details accurate, and must only list food they are allowed to sell. Menu items require approval before they appear on the public menu, and items can be taken down again if they break these terms.",
  },
  {
    heading: "Reviews",
    body: "Reviews must describe a real order. We remove reviews that are abusive, promotional or unrelated to the food, and shops cannot post reviews of their own items.",
  },
  {
    heading: "Changes to these terms",
    body: "We may update these terms as SliceStack grows. Continuing to use the site after an update means you accept the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Terms of Service
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Last updated {new Date().getFullYear()} · These terms cover your use of
        the SliceStack storefront, ordering flow and vendor dashboard.
      </p>

      <div className="mt-9 flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
              {section.heading}
            </h2>
            <p className="mt-2.5 text-[15px] leading-7 text-muted-foreground sm:text-base">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
