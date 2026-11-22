export const siteConfig = {
  name: "SliceStack",
  tagline: "Fresh slices. Fast delivery. Good times.",
  description:
    "Discover amazing pizzas from restaurants around you. Pick your favorite, place an order, and enjoy every bite.",
  nav: [
    { label: "Home", href: "/" },
    { label: "Browse Menu", href: "/menu" },
    { label: "How it works", href: "/#how-it-works" },
  ],
  company: [
    { label: "Home", href: "/" },
    { label: "Upcomming Offers", href: "/offers" },
    { label: "Location", href: "/location" },
    { label: "About Us", href: "/about" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
