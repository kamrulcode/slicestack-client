import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";
import Newsletter from "./Newsletter";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo size="lg" />
            <p className="mt-4 text-[15px] text-muted-foreground sm:text-base">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-[0.16em] uppercase sm:text-[13px]">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-[15px] sm:text-base">
              {siteConfig.company.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Newsletter />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-[13px]">
          <p>© {new Date().getFullYear()} SliceStack. All rights reserved.</p>
          <p>Freshly made · Delivered with love</p>
        </div>
      </div>
    </footer>
  );
}
