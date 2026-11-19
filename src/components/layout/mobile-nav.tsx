"use client";

import Link from "next/link";
import { Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open menu"
          />
        }
      >
        <MenuIcon />
      </SheetTrigger>

      <SheetContent side="right" className="w-[85vw] sm:max-w-sm">
        <SheetHeader className="px-4 pt-5 pb-2">
          <SheetTitle className="font-heading text-lg">Browse SliceStack</SheetTitle>
          <SheetDescription>Fresh slices, delivered hot.</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col px-2" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>

        <Separator />

        <div className="mt-auto flex flex-col gap-2 p-4">
          <Button variant="outline" size="lg">
            Sign In
          </Button>
          <Button size="lg">Sign Up</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
