"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Flame, Gift, Tag, Zap } from "lucide-react";
import { motion } from "motion/react";

const offers = [
  {
    id: 1,
    title: "Pizza Party Combo",
    description:
      "Two delicious pizzas, crispy fries and two refreshing drinks.",
    discount: "30% OFF",
    price: 899,
    oldPrice: 1299,
    image:
      "https://img.magnific.com/free-psd/food-menu-delicious-pizza-social-media-banner-instagram-post-template_120329-6308.jpg?semt=ais_hybrid&w=740&q=80",
    tag: "BEST SELLER",
    color: "from-[#FF404C]/20 to-[#FFB340]/10",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Free",
    description:
      "Order your favorite pizza and get another one absolutely free.",
    discount: "BOGO",
    price: 599,
    oldPrice: 1198,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0tBj87jbilKwlZYCdn8gJk8Kh1DGZ5jHXLMf96SF8bA&s",
    tag: "POPULAR",
    color: "from-[#FFB340]/20 to-[#FF404C]/10",
  },
  {
    id: 3,
    title: "Family Feast",
    description:
      "A perfect family meal with pizza, sides and refreshing drinks.",
    discount: "25% OFF",
    price: 1499,
    oldPrice: 1999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv0DVThR02viDEPK6KW7eEv6aKBeRQtG4RB3fLIvxuww&s",
    tag: "FAMILY DEAL",
    color: "from-[#FF404C]/15 to-[#FFB340]/10",
  },
  {
    id: 4,
    title: "Midnight Cravings",
    description:
      "Enjoy your favorite cheesy pizza at a special late-night price.",
    discount: "20% OFF",
    price: 479,
    oldPrice: 599,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSoVw4J2wcugk1JPtcJy57ZjvwVbX9Ydmcy77jkoNPpgAvyzDmwJwOTns&s",
    tag: "LIMITED TIME",
    color: "from-[#FFB340]/15 to-[#FF404C]/10",
  },
];

const featuredOffer = {
  title: "The Ultimate Combo",
  subtitle: "MORE PIZZA. MORE SIDES. MORE HAPPINESS.",
  description:
    "Your ultimate pizza night starts here. Enjoy a delicious large pizza, crispy golden fries and two refreshing drinks — all in one irresistible combo.",
  price: 799,
  oldPrice: 1099,
  discount: "SAVE 27%",
};

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Page Heading */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-24 md:px-8 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFB340]/20 bg-[#FFB340]/10 px-4 py-2 text-xs font-semibold tracking-wider text-[#FFB340]">
            <Tag size={14} />
            SPECIAL DEALS
          </span>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Delicious Deals,
            <span className="text-[#FFB340]"> Better Prices.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
            Great food tastes even better with great deals. Explore our
            exclusive offers and enjoy more for less.
          </p>
        </motion.div>
      </section>

      {/* Featured Offer */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative isolate overflow-hidden rounded-[28px] border border-border bg-card"
        >
          <div className="absolute -right-20 -top-20 -z-10 h-80 w-80 rounded-full bg-[#FF404C]/15 blur-[100px]" />
          <div className="absolute -bottom-32 left-1/4 -z-10 h-80 w-80 rounded-full bg-[#FFB340]/10 blur-[100px]" />

          <div className="grid items-center md:grid-cols-2">
            {/* Offer Content */}
            <div className="relative z-10 px-7 py-10 sm:px-12 md:py-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#FF404C] px-4 py-2 text-xs font-bold tracking-wider text-white">
                <Flame size={15} />
                FEATURED OFFER
              </span>

              <p className="mt-7 text-sm font-bold tracking-[0.2em] text-[#FFB340]">
                {featuredOffer.subtitle}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                {featuredOffer.title}
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
                {featuredOffer.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <span className="rounded-lg bg-[#FFB340]/15 px-3 py-2 text-sm font-bold text-[#FFB340]">
                  {featuredOffer.discount}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black">
                    ৳{featuredOffer.price}
                  </span>
                  <span className="text-base text-muted-foreground line-through">
                    ৳{featuredOffer.oldPrice}
                  </span>
                </div>
              </div>

              <Link
                href="/menu"
                className="mt-8 inline-flex items-center gap-3 rounded-xl bg-[#FF404C] px-7 py-4 text-sm font-bold text-white transition-all hover:bg-[#e92f3b] hover:shadow-[0_8px_30px_rgba(255,64,76,0.2)]"
              >
                Grab This Deal
                <ArrowRight size={18} />
              </Link>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock size={14} />
                Limited time offer. While available.
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative flex min-h-[300px] items-center justify-center p-6 md:min-h-[480px] md:p-10">
              <div className="absolute right-8 top-8 z-20 flex h-20 w-20 rotate-12 flex-col items-center justify-center rounded-full bg-[#FFB340] text-center text-[#21150F] shadow-xl sm:h-24 sm:w-24">
                <span className="text-xl font-black">27%</span>
                <span className="text-[10px] font-bold">OFF</span>
              </div>

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative aspect-square w-full max-w-[430px]"
              >
                <Image
                  src="/images/combo-pizza.png"
                  alt="SliceStack ultimate pizza combo offer"
                  fill
                  priority
                  sizes="(max-width: 768px) 90vw, 430px"
                  className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Small Offers */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#FFB340]">
              MORE TO EXPLORE
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              More Deals, More Cravings.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Find your next favorite deal at an unbeatable price.
            </p>
          </div>

          <Link
            href="/menu"
            className="hidden items-center gap-2 text-sm font-semibold text-[#FFB340] transition hover:text-[#FF404C] sm:flex"
          >
            Explore Menu <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-[#FFB340]/30"
            >
              {/* Image */}
              <div
                className={`relative aspect-[5/4] overflow-hidden bg-gradient-to-br ${offer.color}`}
              >
                <span className="absolute left-4 top-4 z-10 rounded-md bg-[#FF404C] px-3 py-1.5 text-[10px] font-bold tracking-wider text-white">
                  {offer.tag}
                </span>

                <div className="absolute right-4 top-4 z-10 rounded-md bg-[#FFB340] px-3 py-1.5 text-xs font-black text-[#21150F]">
                  {offer.discount}
                </div>

                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
                  className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="p-5">
                <h3 className="text-lg font-bold transition-colors group-hover:text-[#FFB340]">
                  {offer.title}
                </h3>

                <p className="mt-2 min-h-[48px] text-xs leading-6 text-muted-foreground">
                  {offer.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
                  <div>
                    <span className="text-xl font-black">৳{offer.price}</span>
                    <span className="ml-2 text-xs text-muted-foreground line-through">
                      ৳{offer.oldPrice}
                    </span>
                  </div>

                  <Link
                    href="/menu"
                    aria-label={`Order ${offer.title}`}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF404C] text-white transition hover:bg-[#FFB340] hover:text-[#21150F]"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#FFB340]/30 bg-[#FFB340]/10 px-7 py-10 text-center sm:flex-row sm:text-left md:px-12">
          <div>
            <div className="flex items-center justify-center gap-2 text-[#FFB340] sm:justify-start">
              <Gift size={20} />
              <span className="text-xs font-bold tracking-widest">
                HUNGRY FOR MORE?
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Your next favorite pizza awaits.
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Explore our complete menu and discover something delicious.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#FF404C] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#e92f3b]"
          >
            Explore Menu
            <Zap size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
