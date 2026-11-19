"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/config/imgbb";
import { authClient } from "@/lib/auth-client";

type SignUpErrors = {
  name?: string;
  email?: string;
  password?: string;
};

function validateName(value: string) {
  const name = value.trim();
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (name.length > 100) return "Name must be 100 characters or fewer.";
  return undefined;
}

function validateEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
    return "Enter a valid email address.";
  }
  return undefined;
}

function validatePassword(value: string) {
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 72) return "Password must be 72 characters or fewer.";
  if (!/[A-Z]/.test(value)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[0-9]/.test(value)) {
    return "Password must contain at least one number.";
  }
  return undefined;
}

export function SignUpForm() {
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setHasSubmitted(true);
    setErrors(nextErrors);
    setSubmissionError(undefined);

    if (Object.values(nextErrors).some(Boolean)) return;

    const imageFile = formData.get("image");

    setIsSubmitting(true);
    try {
      const imageUrl =
        imageFile instanceof File && imageFile.size > 0
          ? await uploadImage(imageFile)
          : undefined;

      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        ...(imageUrl ? { image: imageUrl } : {}),
        callbackURL: "/",
      });

      if (error) {
        setSubmissionError(error.message || "Unable to create your account.");
      }
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Create your account
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Join the SliceStack community.
      </p>

      <form className="mt-8" onSubmit={handleSignUp} noValidate>
        <div className="flex flex-col gap-3.5">
          <AuthField
            id="sign-up-name"
            name="name"
            label="Full name"
            autoComplete="name"
            placeholder="Enter full name"
            required
            minLength={2}
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "sign-up-name-error" : undefined}
            onChange={(event) => {
              if (hasSubmitted) {
                setErrors((current) => ({
                  ...current,
                  name: validateName(event.currentTarget.value),
                }));
              }
            }}
          />
          {errors.name && (
            <p
              id="sign-up-name-error"
              className="-mt-2 text-sm text-destructive"
            >
              {errors.name}
            </p>
          )}
          <AuthField
            id="sign-up-email"
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="Enter email address"
            required
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "sign-up-email-error" : undefined}
            onChange={(event) => {
              if (hasSubmitted) {
                setErrors((current) => ({
                  ...current,
                  email: validateEmail(event.currentTarget.value),
                }));
              }
            }}
          />
          {errors.email && (
            <p
              id="sign-up-email-error"
              className="-mt-2 text-sm text-destructive"
            >
              {errors.email}
            </p>
          )}
          <AuthField
            id="sign-up-password"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter password"
            required
            minLength={8}
            maxLength={72}
            validate={(value) => {
              if (value.length < 8) {
                return "Password must be at least 8 characters";
              }
              if (!/[A-Z]/.test(value)) {
                return "Password must contain at least one uppercase letter";
              }
              if (!/[0-9]/.test(value)) {
                return "Password must contain at least one number";
              }
              return null;
            }}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password
                ? "sign-up-password-error"
                : "sign-up-password-hint"
            }
            onChange={(event) => {
              if (hasSubmitted) {
                setErrors((current) => ({
                  ...current,
                  password: validatePassword(event.currentTarget.value),
                }));
              }
            }}
          />
          <p
            id="sign-up-password-hint"
            className="-mt-2 text-sm text-muted-foreground"
          >
            Use 8–72 characters.
          </p>
          {errors.password && (
            <p
              id="sign-up-password-error"
              className="-mt-2 text-sm text-destructive"
            >
              {errors.password}
            </p>
          )}
          <AuthField
            id="sign-up-image"
            name="image"
            type="file"
            accept="image/*"
            label="Profile image"
            className="w-25"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Continue with email"}
        </Button>
        {submissionError && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {submissionError}
          </p>
        )}

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
      <p className="mt-4 text-sm text-muted-foreground">
        Want to sell pizzas?{" "}
        <Link
          href="/register-as-a-vendor"
          className="font-semibold text-primary hover:underline"
        >
          Apply as a vendor
        </Link>
      </p>
    </div>
  );
}
