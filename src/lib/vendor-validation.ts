export const VENDOR_LIMITS = {
  shopName: { min: 2, max: 100 },
  phone: { min: 7, max: 20 },
  address: { min: 10, max: 300 },
  description: { min: 20, max: 1000 },
  logoUrl: { max: 500 },
} as const;

export type VendorField =
  | "shopName"
  | "phone"
  | "address"
  | "description"
  | "logoUrl";

export type VendorFieldErrors = Partial<Record<VendorField, string>>;

/**
 * Vendor fields collected at signup. The owner name is intentionally absent:
 * the server resolves it from the authenticated Better Auth account.
 */
export type VendorDetailsValues = {
  shopName: string;
  phone: string;
  address: string;
  description: string;
  logoUrl: string;
};

/** Payload accepted by the secure vendor activation server action. */
export type VendorActivationInput = {
  shopName: string;
  phone: string;
  address: string;
  description: string;
  logoUrl?: string | null;
};

export type VendorActivationResult = {
  ok: boolean;
  message: string;
  errors?: VendorFieldErrors;
};

export function readVendorDetails(formData: FormData): VendorDetailsValues {
  return {
    shopName: String(formData.get("shopName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    logoUrl: String(formData.get("logoUrl") ?? "").trim(),
  };
}

/**
 * Validate the shop fields shared by signup and onboarding. Called on the
 * client for fast feedback and again in the server action before any write.
 */
export function validateVendorDetails(
  values: VendorDetailsValues,
): VendorFieldErrors {
  const errors: VendorFieldErrors = {};

  if (values.shopName.length < VENDOR_LIMITS.shopName.min) {
    errors.shopName = "Shop name must be at least 2 characters.";
  } else if (values.shopName.length > VENDOR_LIMITS.shopName.max) {
    errors.shopName = "Shop name must be 100 characters or fewer.";
  }

  if (!/^[+]?[\d\s()-]{7,20}$/.test(values.phone)) {
    errors.phone = "Enter a valid contact phone number.";
  }

  if (values.address.length < VENDOR_LIMITS.address.min) {
    errors.address = "Shop address must be at least 10 characters.";
  } else if (values.address.length > VENDOR_LIMITS.address.max) {
    errors.address = "Shop address must be 300 characters or fewer.";
  }

  if (values.description.length < VENDOR_LIMITS.description.min) {
    errors.description = "Describe your shop in at least 20 characters.";
  } else if (values.description.length > VENDOR_LIMITS.description.max) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  if (values.logoUrl) {
    if (values.logoUrl.length > VENDOR_LIMITS.logoUrl.max) {
      errors.logoUrl = "Image URL is too long.";
    } else if (!/^https?:\/\/\S+$/i.test(values.logoUrl)) {
      errors.logoUrl = "Image URL must start with http:// or https://.";
    }
  }

  return errors;
}
