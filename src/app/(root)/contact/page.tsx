import type { Metadata } from "next";
import { ContentPage } from "@/components/common/content-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the SliceStack team.",
};

const SECTIONS = [
  {
    heading: "Customer support",
    body: "Email support@slicestack.app with your account email and the order reference if your question is about an order. We usually reply within one business day.",
  },
  {
    heading: "Vendor support",
    body: "Vendors can reach us at vendors@slicestack.app for help with applications, menu reviews, subscriptions or shop settings.",
  },
  {
    heading: "Report a problem",
    body: "If you spot a problem with a shop, a menu item or a review, send the details to support@slicestack.app and our team will look into it.",
  },
];

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact us"
      intro="Questions, feedback or something we should fix? We are listening."
      sections={SECTIONS}
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">
            Prefer email?
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach the team at support@slicestack.app.
          </p>
        </div>
        <a
          href="mailto:support@slicestack.app"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Email support
        </a>
      </div>
    </ContentPage>
  );
}
