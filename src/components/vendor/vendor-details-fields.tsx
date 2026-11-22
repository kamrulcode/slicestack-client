"use client";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { AuthField } from "@/components/auth/auth-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadService } from "@/services/uploads.service";
import {
  VENDOR_LIMITS,
  type VendorDetailsValues,
  type VendorFieldErrors,
} from "@/lib/vendor-validation";

const MAX_LOGO_BYTES = 5 * 1024 * 1024;

type VendorDetailsFieldsProps = {
  errors?: VendorFieldErrors;
  disabled?: boolean;
  idPrefix?: string;
  defaults?: Partial<VendorDetailsValues>;
  onUploadingChange?: (uploading: boolean) => void;
  deferLogoUpload?: boolean;
  onLogoFileChange?: (file: File | null) => void;
};

/**
 * Shop fields shared by the vendor signup tab and the vendor onboarding page.
 * The owner name is intentionally not collected here: the server resolves it
 * from the authenticated account.
 */
export function VendorDetailsFields({
  errors = {},
  disabled = false,
  idPrefix = "vendor",
  defaults,
  onUploadingChange,
  deferLogoUpload = false,
  onLogoFileChange,
}: VendorDetailsFieldsProps) {
  const [logoUrl, setLogoUrl] = useState(defaults?.logoUrl ?? "");
  const [deferredLogoFile, setDeferredLogoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  function setUploading(value: boolean) {
    setIsUploading(value);
    onUploadingChange?.(value);
  }

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    setUploadError(undefined);

    if (!file) {
      setLogoUrl("");
      setDeferredLogoFile(null);
      onLogoFileChange?.(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      setDeferredLogoFile(null);
      onLogoFileChange?.(null);
      event.currentTarget.value = "";
      return;
    }

    if (file.size > MAX_LOGO_BYTES) {
      setUploadError("The logo must be 5MB or smaller.");
      setDeferredLogoFile(null);
      onLogoFileChange?.(null);
      event.currentTarget.value = "";
      return;
    }

    if (deferLogoUpload) {
      setLogoUrl("");
      setDeferredLogoFile(file);
      onLogoFileChange?.(file);
      return;
    }

    setUploading(true);
    try {
      setLogoUrl(await uploadService.image(file));
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Logo upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  const shopNameErrorId = `${idPrefix}-shop-name-error`;
  const phoneErrorId = `${idPrefix}-phone-error`;
  const addressErrorId = `${idPrefix}-address-error`;
  const descriptionErrorId = `${idPrefix}-description-error`;

  return (
    <div className="flex flex-col gap-4">
      <input
        type="hidden"
        name="logoUrl"
        value={logoUrl}
        disabled={disabled}
        readOnly
      />

      <div>
        <AuthField
          id={`${idPrefix}-shop-name`}
          name="shopName"
          label="Restaurant / shop name"
          placeholder="e.g. SliceStack Kitchen"
          autoComplete="organization"
          defaultValue={defaults?.shopName ?? ""}
          disabled={disabled}
          required
          minLength={VENDOR_LIMITS.shopName.min}
          maxLength={VENDOR_LIMITS.shopName.max}
          aria-invalid={Boolean(errors.shopName)}
          aria-describedby={errors.shopName ? shopNameErrorId : undefined}
        />
        <FieldError id={shopNameErrorId} message={errors.shopName} />
      </div>

      <div>
        <AuthField
          id={`${idPrefix}-phone`}
          name="phone"
          label="Contact phone number"
          type="tel"
          autoComplete="tel"
          placeholder="e.g. +880 1700 000000"
          defaultValue={defaults?.phone ?? ""}
          disabled={disabled}
          required
          minLength={VENDOR_LIMITS.phone.min}
          maxLength={VENDOR_LIMITS.phone.max}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? phoneErrorId : undefined}
        />
        <FieldError id={phoneErrorId} message={errors.phone} />
      </div>

      <div>
        <Label
          htmlFor={`${idPrefix}-address`}
          className="text-[15px] leading-none font-semibold text-foreground"
        >
          Shop address
        </Label>
        <Textarea
          id={`${idPrefix}-address`}
          name="address"
          rows={2}
          placeholder="Street, area, city"
          defaultValue={defaults?.address ?? ""}
          disabled={disabled}
          required
          minLength={VENDOR_LIMITS.address.min}
          maxLength={VENDOR_LIMITS.address.max}
          aria-invalid={Boolean(errors.address)}
          aria-describedby={errors.address ? addressErrorId : undefined}
          className="mt-2.5 min-h-20 bg-card"
        />
        <FieldError id={addressErrorId} message={errors.address} />
      </div>

      <div>
        <Label
          htmlFor={`${idPrefix}-description`}
          className="text-[15px] leading-none font-semibold text-foreground"
        >
          Shop description
        </Label>
        <Textarea
          id={`${idPrefix}-description`}
          name="description"
          rows={3}
          placeholder="What makes your pizza shop special?"
          defaultValue={defaults?.description ?? ""}
          disabled={disabled}
          required
          minLength={VENDOR_LIMITS.description.min}
          maxLength={VENDOR_LIMITS.description.max}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? descriptionErrorId : undefined
          }
          className="mt-2.5 min-h-24 bg-card"
        />
        <FieldError id={descriptionErrorId} message={errors.description} />
      </div>

      <div>
        <AuthField
          id={`${idPrefix}-logo`}
          name="logo"
          type="file"
          accept="image/*"
          label="Shop logo or image (optional)"
          disabled={disabled}
          className="w-36"
          onChange={handleLogoChange}
          aria-invalid={Boolean(errors.logoUrl || uploadError)}
        />
        <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
          {isUploading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" aria-hidden />
              Uploading logo...
            </>
          ) : deferredLogoFile ? (
            <>
              <ImagePlus className="size-3.5" aria-hidden />
              Logo will upload after account creation.
            </>
          ) : logoUrl ? (
            <>
              <ImagePlus className="size-3.5" aria-hidden />
              Logo uploaded and ready to save.
            </>
          ) : (
            <>
              <ImagePlus className="size-3.5" aria-hidden />
              PNG or JPG, up to 5MB.
            </>
          )}
        </div>
        <FieldError
          id={`${idPrefix}-logo-error`}
          message={uploadError ?? errors.logoUrl}
        />
      </div>
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p id={id} className="mt-2 text-sm text-destructive">
      {message}
    </p>
  );
}
