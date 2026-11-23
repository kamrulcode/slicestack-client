import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Exclusive SliceStack deals, combo offers and limited-time pizza savings.",
};

export default function OffersLayout({ children }: { children: ReactNode }) {
  return children;
}
