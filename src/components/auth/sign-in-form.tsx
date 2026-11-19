"use client";

import Link from "next/link";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";

export function SignInForm() {
  return (
    <div>
      <h2 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Welcome back
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Sign in to continue your delicious journey.
      </p>

      <form
        className="mt-9"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex flex-col gap-4">
          <AuthField
            id="sign-in-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
          />
          <AuthField
            id="sign-in-password"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
          />
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
        <Link href="/sign-up" className="hover:underline">
          New to SliceStack? Create an account
        </Link>
      </p>
    </div>
  );
}
