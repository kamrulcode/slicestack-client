"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) return;

    setSubscribed(true);
    setEmail("");
  };

  return (
    <div>
      <h3 className="text-xs font-bold tracking-[0.16em] uppercase sm:text-[13px]">
        Newsletter
      </h3>

      <p className="mt-4 text-[15px] text-muted-foreground sm:text-base">
        Weekly slices, new drops and the odd voucher. No spam, ever.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubscribed(false);
          }}
          required
          className="h-10 bg-background text-[15px] sm:text-base"
        />

        <Button type="submit" className="h-10 shrink-0 gap-1.5">
          Subscribe
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </form>

      <p
        aria-live="polite"
        className="mt-3 min-h-5 text-[13px] leading-5 text-muted-foreground"
      >
        {subscribed ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-primary">
            <Check className="size-3.5" aria-hidden />
            You&apos;re on the list — watch your inbox.
          </span>
        ) : null}
      </p>
    </div>
  );
}
