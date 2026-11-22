import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SliceStack collects, uses and protects your information.",
};

const SECTIONS = [
  {
    heading: "What we collect",
    body: "Your name, email address and profile image when you register, plus the delivery details you add when you place an order. Vendors additionally provide shop name, contact number, address and description.",
  },
  {
    heading: "How we use it",
    body: "To run your account, show shops the orders they must prepare, deliver food to the right address, and send you order updates by email. We use aggregated order data to show vendors their dashboard statistics.",
  },
  {
    heading: "Payments",
    body: "Card payments are handled by Stripe. SliceStack stores the transaction status of a vendor subscription — never your card number, expiry date or security code.",
  },
  {
    heading: "Image uploads",
    body: "Menu and profile images are uploaded to an image hosting provider so they can be served to visitors. Only the image URL is stored with your record.",
  },
  {
    heading: "Who can see it",
    body: "Shops see your name, delivery address, delivery date and order message for orders you place with them. Our team can review account details when handling support requests or abuse reports. We do not sell your data.",
  },
  {
    heading: "Your choices",
    body: "You can update your name and profile image from your dashboard at any time. Contact the SliceStack team if you want your account and its associated records deleted.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Privacy Policy
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Last updated {new Date().getFullYear()} · What SliceStack stores about
        you and why.
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
