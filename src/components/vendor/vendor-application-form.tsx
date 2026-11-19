"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ImagePlus, Loader2, ShieldCheck } from "lucide-react";
import { submitVendorApplicationAction } from "@/app/(auth)/register-as-a-vendor/actions";
import { AuthField } from "@/components/auth/auth-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/config/imgbb";
import {
  EMPTY_VENDOR_FORM_STATE,
  VENDOR_LIMITS,
} from "@/lib/vendor-validation";
import { cn } from "@/lib/utils";
import type { VendorApplication } from "@/types/vendor";

const MAX_LOGO_BYTES = 5 * 1024 * 1024;

export function VendorApplicationForm({
  defaultOwnerName,
  application,
}: {
  defaultOwnerName: string;
  application?: VendorApplication | null;
}) {
  const [state, formAction, isPending] = useActionState(
    submitVendorApplicationAction,
    EMPTY_VENDOR_FORM_STATE,
  );
  const [logoUrl, setLogoUrl] = useState(application?.logoUrl ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const isBusy = isPending || isUploading;
  const submitted = state.values;

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    setUploadError(undefined);

    if (!file) {
      setLogoUrl("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setUploadError("The logo must be 5MB or smaller.");
      event.currentTarget.value = "";
      return;
    }

    setIsUploading(true);
    try {
      setLogoUrl(await uploadImage(file));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Logo upload failed.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  if (state.ok) {
    return (
      <div>
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CheckCircle2 className="size-6" aria-hidden />
        </div>
        <h2 className="mt-5 font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground">
          Application received
        </h2>
        <p className="mt-3 text-base text-muted-foreground">{state.message}</p>
        <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
          Your account stays a customer account until an admin reviews and
          approves your shop. You can follow the status from your dashboard.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/dashboard/customer" className={buttonVariants()}>
            Go to my dashboard
          </Link>
          <Link
            href="/menu"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <ShieldCheck className="size-4" aria-hidden />
        Vendor application
      </div>
      <h2 className="mt-3 font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Open your pizza shop
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Tell us about your shop. An admin reviews every application; you will
        keep your customer account until it is approved.
      </p>

      {application?.status === "REJECTED" && (
        <div className="mt-5 rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="font-semibold">Resubmitting a rejected application</p>
          {application.rejectionReason ? (
            <p className="mt-1">
              Previous review note: {application.rejectionReason}
            </p>
          ) : null}
          <p className="mt-1">
            Update the details below, then submit again for review.
          </p>
        </div>
      )}

      <form
        key={submitted ? JSON.stringify(submitted) : "initial"}
        className="mt-7"
        action={formAction}
        noValidate
      >
        <input type="hidden" name="logoUrl" value={logoUrl} />

        <div className="flex flex-col gap-4">
          <div>
            <AuthField
              id="vendor-shop-name"
              name="shopName"
              label="Shop name"
              placeholder="e.g. SliceStack Kitchen"
              defaultValue={submitted?.shopName ?? application?.shopName ?? ""}
              required
              minLength={VENDOR_LIMITS.shopName.min}
              maxLength={VENDOR_LIMITS.shopName.max}
              aria-invalid={Boolean(state.errors.shopName)}
            />
            <FieldError message={state.errors.shopName} />
          </div>

          <div>
            <AuthField
              id="vendor-owner-name"
              name="ownerName"
              label="Owner name"
              autoComplete="name"
              defaultValue={
                submitted?.ownerName ??
                application?.ownerName ??
                defaultOwnerName
              }
              required
              minLength={VENDOR_LIMITS.ownerName.min}
              maxLength={VENDOR_LIMITS.ownerName.max}
              aria-invalid={Boolean(state.errors.ownerName)}
            />
            <FieldError message={state.errors.ownerName} />
          </div>

          <div>
            <AuthField
              id="vendor-phone"
              name="phone"
              label="Contact phone number"
              type="tel"
              autoComplete="tel"
              placeholder="e.g. +880 1700 000000"
              defaultValue={submitted?.phone ?? application?.phone ?? ""}
              required
              minLength={VENDOR_LIMITS.phone.min}
              maxLength={VENDOR_LIMITS.phone.max}
              aria-invalid={Boolean(state.errors.phone)}
            />
            <FieldError message={state.errors.phone} />
          </div>

          <div>
            <Label
              htmlFor="vendor-address"
              className="text-[15px] leading-none font-semibold text-foreground"
            >
              Shop address
            </Label>
            <Textarea
              id="vendor-address"
              name="address"
              rows={3}
              placeholder="Street, area, city"
              defaultValue={submitted?.address ?? application?.address ?? ""}
              required
              minLength={VENDOR_LIMITS.address.min}
              maxLength={VENDOR_LIMITS.address.max}
              aria-invalid={Boolean(state.errors.address)}
              className="mt-2.5 min-h-20 bg-card"
            />
            <FieldError message={state.errors.address} />
          </div>

          <div>
            <Label
              htmlFor="vendor-description"
              className="text-[15px] leading-none font-semibold text-foreground"
            >
              Shop description
            </Label>
            <Textarea
              id="vendor-description"
              name="description"
              rows={4}
              placeholder="What makes your pizza shop special?"
              defaultValue={
                submitted?.description ?? application?.description ?? ""
              }
              required
              minLength={VENDOR_LIMITS.description.min}
              maxLength={VENDOR_LIMITS.description.max}
              aria-invalid={Boolean(state.errors.description)}
              className="mt-2.5 min-h-28 bg-card"
            />
            <FieldError message={state.errors.description} />
          </div>

          <div>
            <AuthField
              id="vendor-logo"
              name="logo"
              type="file"
              accept="image/*"
              label="Shop logo or image (optional)"
              className="w-33"
              onChange={handleLogoChange}
              aria-invalid={Boolean(state.errors.logoUrl)}
            />
            <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  Uploading logo...
                </>
              ) : logoUrl ? (
                <>
                  <ImagePlus className="size-3.5" aria-hidden />
                  Logo uploaded and ready to submit.
                </>
              ) : (
                <>
                  <ImagePlus className="size-3.5" aria-hidden />
                  PNG or JPG, up to 5MB.
                </>
              )}
            </div>
            <FieldError message={uploadError ?? state.errors.logoUrl} />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
          disabled={isBusy}
        >
          {isPending
            ? "Submitting application..."
            : isUploading
              ? "Uploading logo..."
              : "Submit application"}
        </Button>

        {state.message && !state.ok && (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {state.message}
          </p>
        )}

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already approved?{" "}
          <Link
            href="/dashboard"
            className="font-semibold text-primary hover:underline"
          >
            Go to your dashboard
          </Link>
        </p>
      </form>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className={cn("mt-2 text-sm text-destructive")}>{message}</p>
  );
}
