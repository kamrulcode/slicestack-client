"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { toast } from "sonner";
import { VendorDetailsFields } from "@/components/vendor/vendor-details-fields";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { profileService } from "@/services/profile.service";
import {
  readVendorDetails,
  validateVendorDetails,
  type VendorDetailsValues,
  type VendorFieldErrors,
} from "@/lib/vendor-validation";

/**
 * Upgrades an existing customer account to a vendor account. The Express API
 * owns validation, the role change and the shop records.
 */
export function VendorOnboardingForm({
  defaults,
}: {
  defaults?: Partial<VendorDetailsValues>;
}) {
  const [errors, setErrors] = useState<VendorFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const isBusy = isSubmitting || isUploadingLogo;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const values = readVendorDetails(new FormData(event.currentTarget));
    const nextErrors = validateVendorDetails(values);

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (isUploadingLogo) {
      toast.info("Please wait for the shop logo to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await profileService.applyVendor({
        shopName: values.shopName,
        phone: values.phone,
        address: values.address,
        description: values.description,
        logoUrl: values.logoUrl || null,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      // The Express API has just raised this account to `vendor`. Re-read the
      // session with the cookie cache disabled so the `session_data` cookie
      // stops reporting the old `customer` role, then use a full document
      // navigation so the dashboard renders from the database record rather
      // than a cached RSC payload.
      try {
        await authClient.getSession({ query: { disableCookieCache: true } });
      } catch {
        // The server still reads the role from the database on navigation.
      }
      window.location.replace("/dashboard/vendor");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Store className="size-4" aria-hidden />
        Vendor setup
      </div>
      <h2 className="mt-3 font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
        Open your pizza shop
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Add your shop details and start selling right away. There is no approval
        queue — your vendor workspace unlocks as soon as you save.
      </p>

      <form className="mt-7" onSubmit={handleSubmit} noValidate>
        <VendorDetailsFields
          errors={errors}
          disabled={isSubmitting}
          idPrefix="vendor-onboarding"
          defaults={defaults}
          onUploadingChange={setIsUploadingLogo}
        />

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full rounded-lg text-base shadow-sm shadow-primary/20"
          disabled={isBusy}
        >
          {isSubmitting
            ? "Activating your shop..."
            : isUploadingLogo
              ? "Uploading logo..."
              : "Activate my shop"}
          <ArrowRight className="size-4" aria-hidden />
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Just here to order?{" "}
          <Link
            href="/dashboard/customer"
            className="font-semibold text-primary hover:underline"
          >
            Go to your dashboard
          </Link>
        </p>
      </form>
    </div>
  );
}
