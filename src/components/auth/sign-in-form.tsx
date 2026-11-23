"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { errorMessage } from "@/lib/api/client";
import { toast } from "sonner";
import { Eye, EyeClosed } from "lucide-react";

export function SignInForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        toast.error(signInError.message || "Unable to sign in.");
        return;
      }

      toast.success("Welcome back!");
      // The dashboard dispatcher reads the role from the database on the
      // server and redirects to the right workspace.
      router.replace(nextPath || "/dashboard");
      router.refresh();
    } catch (signInError) {
      toast.error(errorMessage(signInError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Welcome back
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Sign in to continue your delicious journey.
      </p>

      <form className="mt-9" onSubmit={handleSignIn} noValidate>
        <div className="flex flex-col gap-4">
          <AuthField
            id="sign-in-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
            required
          />
          <AuthField
            id="sign-in-password"
            name="password"
            label="Password"
            type={isVisible ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter password"
            required
            endAdornment={
              <Button
                type="button"
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="sign-in-password"
                size="icon"
                variant="ghost"
                className="size-9 sm:size-10"
                onClick={() => setIsVisible((visible) => !visible)}
              >
                {isVisible ? (
                  <EyeClosed className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </Button>
            }
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Continue with email"}
        </Button>

        <div className="mt-3">
          <GoogleButton />
        </div>
      </form>

      <p className="mt-8 text-[13px] leading-6 text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="font-semibold text-foreground/80 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
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
