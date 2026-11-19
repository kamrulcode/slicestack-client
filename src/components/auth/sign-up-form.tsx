"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const roles = [
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
] as const;

export function SignUpForm() {
  const [role, setRole] = useState<(typeof roles)[number]["value"]>("customer");

  return (
    <div>
      <h2 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Create your account
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Join the SliceStack community.
      </p>

      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex flex-col gap-3.5">
          <AuthField
            id="sign-up-name"
            name="name"
            label="Full name"
            autoComplete="name"
            placeholder="Enter full name"
          />
          <AuthField
            id="sign-up-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
          />
          <AuthField
            id="sign-up-password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
          />
          <AuthField
            id="sign-up-image"
            name="image"
            label="Profile image (optional)"
            placeholder="Enter profile image (optional)"
          />

          <div className="flex flex-col gap-2.5">
            <span className="text-[15px] leading-none font-semibold text-foreground">
              Account role
            </span>
            <ToggleGroup
              aria-label="Account role"
              value={[role]}
              onValueChange={(value) => {
                if (value[0]) setRole(value[0] as (typeof roles)[number]["value"]);
              }}
              className="gap-3"
            >
              {roles.map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  className="h-10 min-w-32 rounded-full border border-transparent bg-secondary/70 px-6 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary"
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <input type="hidden" name="role" value={role} />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
        >
          Continue with email
        </Button>

        <div className="mt-3">
          <GoogleButton />
        </div>
      </form>

      <p className="mt-8 text-[13px] leading-6 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="#"
          className="font-semibold text-foreground/80 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="font-semibold text-foreground/80 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-6 text-[15px] font-semibold text-primary">
        <Link href="/sign-in" className="hover:underline">
          Already have an account? Sign in
        </Link>
      </p>
    </div>
  );
}
