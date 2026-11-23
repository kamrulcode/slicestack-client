"use client";

import Link from "next/link";
import { LogIn, LogOut, Menu as MenuIcon, User } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { authClient } from "@/lib/auth-client";
import { cn } from "cn";
import { toast } from "sonner";
import { errorMessage } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "../ui/avatar";
import { dashboardPathForRole, normalizeRole } from "@/types/auth";

const navItemClassName =
  "rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground";

export function MobileNav() {
  const { data } = authClient.useSession();
  const user = data?.user;
  const role = normalizeRole(user?.role);
  const router = useRouter();
  const initials =
    user?.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("You have been signed out.");
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

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
          <SheetTitle className="font-heading text-lg">
            Browse SliceStack
          </SheetTitle>
          <SheetDescription>Fresh slices, delivered hot.</SheetDescription>
        </SheetHeader>
        {user ? (
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg ">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}

              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              <AvatarBadge className="bg-green-600 dark:bg-green-800 " />
            </Avatar>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        ) : null}

        <nav className="flex flex-col px-2" aria-label="Mobile">
          {siteConfig.nav.map((item) => (
            <SheetClose
              key={item.href}
              nativeButton={false}
              render={
                <Link href={item.href} className={navItemClassName} />
              }
            >
              {item.label}
            </SheetClose>
          ))}
          {user ? (
            <>
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href={dashboardPathForRole(role)}
                    className={navItemClassName}
                  />
                }
              >
                Dashboard
              </SheetClose>
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href={`/dashboard/${role}/profile`}
                    className={navItemClassName}
                  />
                }
              >
                Settings
              </SheetClose>
            </>
          ) : null}
        </nav>

        <Separator />

        {user ? (
          <div className="mt-auto flex flex-col gap-2 p-4">
            <button
              onClick={handleSignOut}
              className={cn(
                buttonVariants({ size: "sm" }),
                " rounded-full px-4 py-4 shadow-sm shadow-primary/25 inline-flex ",
              )}
            >
              <LogOut />
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-auto flex flex-col gap-2 p-4">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                " rounded-full px-4 py-4 shadow-sm shadow-primary/25   inline-flex",
              )}
            >
              Sign In
              <LogIn />
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "sm" }),
                " rounded-full px-4 py-4 shadow-sm shadow-primary/25 inline-flex ",
              )}
            >
              <User />
              Sign Up
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
