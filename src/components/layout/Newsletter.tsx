"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errorMessage } from "@/lib/api/client";
import { newsletterService } from "@/services/newsletter.service";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const value = email.trim();
    if (!value) return;

    setIsSubmitting(true);
    try {
      const result = await newsletterService.subscribe(value);
      toast.success(result.message);
      setEmail("");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="text-xs font-bold tracking-[0.16em] uppercase sm:text-[13px] text-primary">
        Newsletter
      </h3>

      <p className="mt-1 text-xs text-muted-foreground sm:text-base">
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
          onChange={(event) => setEmail(event.target.value)}
          required
          disabled={isSubmitting}
          className="h-10 bg-background text-[15px] sm:text-base"
        />

        <Button
          type="submit"
          className="h-10 shrink-0 gap-1.5"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Joining...
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </Button>
      </form>

      <p
        aria-live="polite"
        className=" min-h-5 text-[13px] leading-5 text-muted-foreground"
      />
    </div>
  );
}
