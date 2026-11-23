"use client";

import Link from "next/link";
import { ArrowRight, ArrowUp, ArrowUpRight, Heart } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import Newsletter from "./Newsletter";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FiFacebook } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-10 size-80 rounded-full bg-[#ffb340]/5 blur-[100px]" />
        <div className="absolute -right-40 bottom-0 size-80 rounded-full bg-[#ff404c]/5 blur-[100px]" />
      </div>

      {/* Top Gradient Line */}
      <div className="absolute left-0 top-0 h-0.5 w-full bg-linear-to-r from-transparent via-[#ff404c] to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid gap-12 py-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.3fr] lg:gap-10 lg:py-12">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <Logo size="md" />

            {/* Brand Highlight */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#ffb340]/30 bg-[#ffb340]/10 px-3 py-2 text-xs font-medium text-foreground">
              <span className="size-2 animate-pulse rounded-full bg-[#ff404c]" />
              Freshly baked, always loved.
            </div>
            <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
              {/* {siteConfig.tagline} */}
              {siteConfig.description}
            </p>

            {/* Social Links / Icons */}
            <div className="mt-7 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[#ff404c]/50 hover:bg-[#ff404c] hover:text-white">
                <FiFacebook size={19} />
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[#ff404c]/50 hover:bg-[#ff404c] hover:text-white">
                <FaXTwitter size={17} />
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-[#ff404c]/50 hover:bg-[#ff404c] hover:text-white">
                <FaInstagram size={19} />
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="mt-4">
            <h3 className="text-sm font-bold tracking-wide text-foreground">
              Company
            </h3>

            <div className="mt-5 h-0.5 w-8 rounded-full bg-[#ff404c]" />

            <ul className="mt-6 space-y-4">
              {siteConfig.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[#ff404c]"
                  >
                    {item.label}
                    <ArrowUpRight className="size-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="mt-4">
            <h3 className="text-sm font-bold tracking-wide text-foreground">
              Support
            </h3>

            <div className="mt-5 h-0.5 w-8 rounded-full bg-[#ffb340]" />

            <ul className="mt-6 space-y-4">
              {siteConfig.support.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-[#ff404c]"
                  >
                    {item.label}
                    <ArrowUpRight className="size-3 -translate-y-0.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="rounded-2xl border border-border/70 bg-secondary/40 px-5 py-2 sm:p-6">
            <div className="mb-1">
              {/* <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#ff404c]">
                Stay in the loop
              </span> */}

              <h3 className=" text-xl font-bold tracking-tight">
                Get the latest <span className="text-[#ff404c]">slice!</span>
              </h3>

              {/* <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Subscribe for delicious updates, special offers, and exclusive
                deals.
              </p> */}
            </div>

            <Newsletter />

            <p className=" text-[11px] text-muted-foreground">
              No spam. Just fresh updates and delicious offers.
            </p>
          </div>
        </div>

        <Separator className="opacity-60" />

        {/* Bottom Footer */}

        <div className="grid grid-cols-1 items-center gap-4 border-t border-border/60 py-6 text-center sm:grid-cols-3 sm:text-left">
          {/* Copyright */}
          <p className="text-xs text-muted-foreground sm:text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">
              Slice<span className="text-[#ff404c]">Stack</span>
            </span>
            . All rights reserved.
          </p>

          {/* Made With Love */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
            Made with
            <Heart className="size-3.5 fill-[#ff404c] text-[#ff404c]" />
            by
            <span className="text-[#ff404c] transition-transform duration-300 hover:scale-110">
              KAMRUL
            </span>
          </div>

          {/* Scroll To Top */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="group inline-flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#ff404c] sm:justify-self-end sm:text-sm"
          >
            Back to top
            <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}
