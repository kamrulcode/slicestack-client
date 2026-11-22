"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VendorDetailsFields } from "@/components/vendor/vendor-details-fields";
import { errorMessage } from "@/lib/api/client";
import {
  readVendorDetails,
  validateVendorDetails,
  type VendorFieldErrors,
} from "@/lib/vendor-validation";
import { profileService } from "@/services/profile.service";
import type { Shop } from "@/types/vendor";

/**
 * Shop settings form. Saving goes to `PATCH /api/vendors/me`, which updates the
 * application, the shop and the denormalized menu fields in one place.
 */
export function ShopProfileCard({ shop }: { shop: Shop }) {
  const router = useRouter();
  const [errors, setErrors] = useState<VendorFieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const isBusy = isSubmitting || isUploadingLogo;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isBusy) return;

    const values = readVendorDetails(new FormData(event.currentTarget));
    const nextErrors = validateVendorDetails(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted shop fields.");
      return;
    }

    if (isUploadingLogo) {
      toast.info("Please wait for the shop logo to finish uploading.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await profileService.updateVendorProfile({
        shopName: values.shopName,
        phone: values.phone,
        address: values.address,
        description: values.description,
        logoUrl: values.logoUrl || null,
      });

      toast.success(result.message || "Shop profile updated.");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop settings</CardTitle>
        <CardDescription>
          These details appear on your storefront and on every menu item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate>
          <VendorDetailsFields
            errors={errors}
            disabled={isSubmitting}
            idPrefix="shop-settings"
            defaults={{
              shopName: shop.name,
              phone: shop.phone,
              address: shop.address,
              description: shop.description,
              logoUrl: shop.logoUrl ?? "",
            }}
            onUploadingChange={setIsUploadingLogo}
          />

          <Button
            type="submit"
            size="lg"
            className="mt-6 h-11 w-full rounded-lg shadow-sm shadow-primary/20"
            disabled={isBusy}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" aria-hidden />
                Saving shop details...
              </>
            ) : isUploadingLogo ? (
              "Uploading logo..."
            ) : (
              <>
                <Save className="size-4" aria-hidden />
                Save shop details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
