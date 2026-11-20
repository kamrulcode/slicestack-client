"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Store } from "lucide-react";
import { activateVendorAccountAction } from "@/app/(auth)/sign-up/actions";
import { VendorDetailsFields } from "@/components/vendor/vendor-details-fields";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  readVendorDetails,
  validateVendorDetails,
  type VendorDetailsValues,
  type VendorFieldErrors,
} from "@/lib/vendor-validation";

/**
 * Instantly upgrades an existing customer account to a vendor account. No
 * admin review is involved; the server action owns the role change.
 */
export function VendorOnboardingForm({
  defaults,
}: {
  defaults?: Partial<VendorDetailsValues>;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<VendorFieldErrors>({});
  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const isBusy = isSubmitting || isUploadingLogo;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isBusy) return;

    const values = readVendorDetails(new FormData(event.currentTarget));
    const nextErrors = validateVendorDetails(values);

    setErrors(nextErrors);
    setMessage(undefined);

    if (Object.keys(nextErrors).length > 0) return;

    if (isUploadingLogo) {
      setMessage("Please wait for the shop logo to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await activateVendorAccountAction({
        shopName: values.shopName,
        phone: values.phone,
        address: values.address,
        description: values.description,
        logoUrl: values.logoUrl || null,
      });

      if (!result.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.message);
        return;
      }

      router.replace("/dashboard/vendor");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not activate your shop. Please try again.",
      );
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

        {message && (
          <p
            role="alert"
            className={cn("mt-3 text-sm", "text-destructive")}
          >
            {message}
          </p>
        )}

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
