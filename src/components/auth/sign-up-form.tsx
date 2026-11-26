"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeClosed, Store, UserRound } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { GoogleButton } from "@/components/auth/google-button";
import { VendorDetailsFields } from "@/components/vendor/vendor-details-fields";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { profileService } from "@/services/profile.service";
import { uploadService } from "@/services/uploads.service";
import { toast } from "sonner";
import {
  readVendorDetails,
  validateVendorDetails,
  type VendorFieldErrors,
} from "@/lib/vendor-validation";

export type SignUpMode = "customer" | "vendor";

type SignUpErrors = {
  name?: string;
  email?: string;
  password?: string[];
};

const MODES = [
  {
    value: "customer",
    label: "Customer",
    hint: "Order pizza",
    icon: UserRound,
  },
  {
    value: "vendor",
    label: "Vendor",
    hint: "Sell your pizza",
    icon: Store,
  },
] as const;

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
  const errors: string[] = [];
  if (value.length < 6) errors.push("Password must be at least 6 characters.");
  if (!/[A-Z]/.test(value)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!/[a-z]/.test(value)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  return errors;
}

async function saveProfileImage(file: File) {
  const image = await uploadService.image(file);
  await profileService.updateProfile({ image });
}

/**
 * Re-read the session before navigating away from sign-up.
 *
 * `disableCookieCache` is the important part: Better Auth caches the user
 * record (including `role`) in the `session_data` cookie for 7 days. Vendor
 * sign-up upgrades the account to `vendor` through the Express API after the
 * session was created, so the cached snapshot still says `customer`. Reading
 * the session with the cache disabled returns the database record and rewrites
 * the cookie cache with the new role, so the dashboard (and every client
 * `useSession()` consumer) sees the vendor immediately.
 *
 * If the session cookie did not stick at all (for example a stale cookie jar
 * that still holds a `session_data` cookie without its `session_token`), fall
 * back to a normal sign-in with the credentials the user just chose so they
 * still land in their dashboard instead of being bounced back to the form.
 */
async function ensureSession(email: string, password: string) {
  try {
    const { data } = await authClient.getSession({
      query: { disableCookieCache: true },
    });
    if (data?.user) return;

    await authClient.signIn.email({ email, password });
  } catch {
    // The sign-in page is still available if this recovery attempt fails.
  }
}

export function SignUpForm({
  defaultMode = "customer",
}: {
  defaultMode?: SignUpMode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<SignUpMode>(defaultMode);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [vendorErrors, setVendorErrors] = useState<VendorFieldErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [vendorLogoFile, setVendorLogoFile] = useState<File | null>(null);
  const [vendorLogoUrl, setVendorLogoUrl] = useState<string>();
  // A vendor account exists as soon as Better Auth creates it. If shop
  // activation fails (for example a network drop), we keep this flag so the
  // retry only re-runs the secure activation step.
  const [vendorAccountCreated, setVendorAccountCreated] = useState(false);

  const isVendor = mode === "vendor";
  const isBusy = isSubmitting || isUploadingLogo;

  function switchMode(next: SignUpMode) {
    if (next === mode || vendorAccountCreated) return;

    setMode(next);
    setErrors({});
    setVendorErrors({});
    setHasSubmitted(false);
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const passwordErrors = validatePassword(password);

    const nextErrors: SignUpErrors = vendorAccountCreated
      ? {}
      : {
          name: validateName(name),
          email: validateEmail(email),
          password: passwordErrors.length > 0 ? passwordErrors : undefined,
        };

    const vendorValues = readVendorDetails(formData);
    const nextVendorErrors: VendorFieldErrors = isVendor
      ? validateVendorDetails(vendorValues)
      : {};

    setHasSubmitted(true);
    setErrors(nextErrors);
    setVendorErrors(nextVendorErrors);

    if (
      Object.values(nextErrors).some(Boolean) ||
      Object.keys(nextVendorErrors).length > 0
    ) {
      return;
    }

    if (isVendor && isUploadingLogo) {
      toast.info("Please wait for the shop logo to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (!isVendor) {
        const imageFile = formData.get("image");
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/dashboard/customer",
        });

        if (error) {
          toast.error(error.message || "Unable to create your account.");
          return;
        }

        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            await saveProfileImage(imageFile);
          } catch (error) {
            toast.error(
              "Your account was created, but the profile image could not be uploaded. You can add it later from your account settings.",
              { description: errorMessage(error) },
            );
          }
        }

        await ensureSession(email, password);
        window.sessionStorage.setItem(
          "slicestack:signup-success",
          "Account created. Welcome to SliceStack!",
        );
        window.location.replace("/dashboard/customer");
        return;
      }

      if (!vendorAccountCreated) {
        const imageFile = formData.get("image");
        // Better Auth creates the account with its default `customer` role and
        // signs the browser in. The role is raised to `vendor` only after the
        // backend validates and stores the shop data.
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
          callbackURL: "/dashboard/vendor",
        });

        if (error) {
          toast.error(error.message || "Unable to create your account.");
          return;
        }

        setVendorAccountCreated(true);

        if (imageFile instanceof File && imageFile.size > 0) {
          try {
            await saveProfileImage(imageFile);
          } catch (error) {
            toast.error(
              "Your account was created, but the profile image could not be uploaded. You can add it later from your account settings.",
              { description: errorMessage(error) },
            );
          }
        }
      }

      let logoUrl = vendorLogoUrl ?? vendorValues.logoUrl;
      if (!logoUrl && vendorLogoFile) {
        try {
          logoUrl = await uploadService.image(vendorLogoFile);
          setVendorLogoUrl(logoUrl);
        } catch (error) {
          toast.error(
            "Your account was created, but the shop logo could not be uploaded. You can add it later from your vendor profile.",
            { description: errorMessage(error) },
          );
        }
      }

      const result = await profileService.applyVendor({
        shopName: vendorValues.shopName,
        phone: vendorValues.phone,
        address: vendorValues.address,
        description: vendorValues.description,
        logoUrl: logoUrl || null,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      await ensureSession(email, password);
      window.sessionStorage.setItem(
        "slicestack:signup-success",
        result.message,
      );
      window.location.replace("/dashboard/vendor");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div
        role="group"
        aria-label="Choose account type"
        className="grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-sm"
      >
        {MODES.map(({ value, label, hint, icon: Icon }) => {
          const active = mode === value;

          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              disabled={vendorAccountCreated}
              onClick={() => switchMode(value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2.5 transition-all duration-200 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer",
                active
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                vendorAccountCreated && "cursor-not-allowed opacity-60",
              )}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Icon className="size-4" aria-hidden />
                {label}
              </span>
              <span
                className={cn(
                  "text-[12px]",
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground/80",
                )}
              >
                {hint}
              </span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-6 font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        {isVendor ? "Open your pizza shop" : "Create your account"}
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        {isVendor
          ? "Set up your shop and start selling on SliceStack. No approval queue — your workspace unlocks instantly."
          : "Join the SliceStack community and get your next pizza sorted."}
      </p>

      <form className="mt-6" onSubmit={handleSignUp} noValidate>
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
            disabled={vendorAccountCreated}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "sign-up-name-error" : undefined}
            onChange={(event) => {
              if (hasSubmitted && !vendorAccountCreated) {
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
            disabled={vendorAccountCreated}
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "sign-up-email-error" : undefined}
            onChange={(event) => {
              if (hasSubmitted && !vendorAccountCreated) {
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
          <div className="flex gap-4">
            <AuthField
              id="sign-up-password"
              name="password"
              label="Password"
              type={isVisible ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Enter password"
              required
              minLength={6}
              disabled={vendorAccountCreated}
              aria-invalid={Boolean(errors.password?.length)}
              aria-describedby={
                errors.password?.length
                  ? "sign-up-password-error"
                  : "sign-up-password-hint"
              }
              endAdornment={
                <Button
                  type="button"
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="sign-up-password"
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
              onChange={(event) => {
                if (hasSubmitted && !vendorAccountCreated) {
                  const passwordErrors = validatePassword(
                    event.currentTarget.value,
                  );
                  setErrors((current) => ({
                    ...current,
                    password:
                      passwordErrors.length > 0 ? passwordErrors : undefined,
                  }));
                }
              }}
            />

            {errors.password && (
              <div
                id="sign-up-password-error"
                className="-mt-2 space-y-1 text-sm text-destructive"
              >
                {errors.password.map((error) => (
                  <p key={error}>{error}</p>
                ))}
              </div>
            )}

            <AuthField
              id="sign-up-image"
              name="image"
              type="file"
              accept="image/*"
              label="Profile image (optional)"
              disabled={vendorAccountCreated}
              className="w-25"
            />
          </div>

          <div
            className={cn(
              "mt-3 border-t border-border/70 pt-6",
              !isVendor && "hidden",
            )}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Store className="size-4" aria-hidden />
              Shop details
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              These details appear on your storefront. You can refine them
              later.
            </p>

            <div className="mt-4">
              <VendorDetailsFields
                errors={vendorErrors}
                disabled={!isVendor}
                idPrefix="sign-up-vendor"
                onUploadingChange={setIsUploadingLogo}
                deferLogoUpload
                onLogoFileChange={(file) => {
                  setVendorLogoFile(file);
                  setVendorLogoUrl(undefined);
                }}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
          disabled={isBusy}
        >
          {isSubmitting
            ? isVendor
              ? vendorAccountCreated
                ? "Activating your shop..."
                : "Creating your shop..."
              : "Creating account..."
            : isUploadingLogo
              ? "Uploading logo..."
              : isVendor
                ? vendorAccountCreated
                  ? "Retry shop setup"
                  : "Create vendor account"
                : "Create customer account"}
        </Button>

        {!isVendor && (
          <div className="mt-3">
            <GoogleButton />
          </div>
        )}
      </form>
      {vendorAccountCreated && (
        <div className="absolute top-0 z-999 mt-5 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="font-semibold">Your account was created</p>
          <p className="mt-1">
            We just need to finish your shop setup. Fix any highlighted fields
            and press &ldquo;Retry shop setup&rdquo;.
          </p>
        </div>
      )}

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
        <Link href="/sign-in" className="hover:underline">
          Already have an account? Sign in
        </Link>
      </p>
    </div>
  );
}
