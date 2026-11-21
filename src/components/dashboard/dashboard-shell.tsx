"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Receipt,
  ShoppingBag,
  Store,
  UserRound,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/lib/authorization";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV_BY_ROLE: Record<SessionUser["role"], NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
    { label: "My orders", href: "/dashboard/customer/orders", icon: ShoppingBag },
    { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  vendor: [
    { label: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard, exact: true },
    { label: "Menu items", href: "/dashboard/vendor/menu-items", icon: UtensilsCrossed },
    { label: "Orders", href: "/dashboard/vendor/orders", icon: ClipboardList },
    { label: "Profile", href: "/dashboard/vendor/profile", icon: Store },
    { label: "Subscription", href: "/dashboard/vendor/subscription", icon: Receipt },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "Profile", href: "/dashboard/admin/profile", icon: UserRound },
    { label: "Vendor applications", href: "/dashboard/admin/vendors", icon: Store },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Menu items", href: "/dashboard/admin/menu-items", icon: UtensilsCrossed },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: Receipt },
  ],
};

const ROLE_LABEL: Record<SessionUser["role"], string> = {
  customer: "Customer workspace",
  vendor: "Vendor workspace",
  admin: "Admin workspace",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function DashboardShell({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const nav = NAV_BY_ROLE[user.role];

  const activeItem =
    nav.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href),
    ) ?? nav[0];

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-ink px-4 py-6 text-white">
      <div className="px-2">
        <Logo size="sm" className="text-white" />
        <p className="mt-3 text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
          {ROLE_LABEL[user.role]}
        </p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Dashboard">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive(item)
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4.5 shrink-0" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-white/10 pt-4">
        <Link
          href="/menu"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ShoppingBag className="size-4.5" aria-hidden />
          View storefront
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-60"
        >
          <LogOut className="size-4.5" aria-hidden />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        {sidebar}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/70 bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open dashboard navigation"
                  />
                }
              >
                <MenuIcon className="size-5" aria-hidden />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
                <SheetHeader className="sr-only">
                  <SheetTitle>Dashboard navigation</SheetTitle>
                </SheetHeader>
                {sidebar}
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-base font-semibold text-foreground">
                {activeItem.label}
              </p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                SliceStack {user.role} dashboard
              </p>
            </div>

            <Badge variant="outline" className="hidden capitalize sm:inline-flex">
              {user.role}
            </Badge>
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                <AvatarFallback>{initials(user.name) || "SS"}</AvatarFallback>
              </Avatar>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
