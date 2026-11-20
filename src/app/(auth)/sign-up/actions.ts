"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/authorization";
import {
  activateVendorAccount,
  getShopForOwner,
  VendorApplicationError,
} from "@/lib/vendor-applications";
import {
  validateVendorDetails,
  type VendorActivationInput,
  type VendorActivationResult,
  type VendorDetailsValues,
} from "@/lib/vendor-validation";

function readInput(input: unknown): VendorDetailsValues {
  const record =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  return {
    shopName: String(record.shopName ?? "").trim(),
    phone: String(record.phone ?? "").trim(),
    address: String(record.address ?? "").trim(),
    description: String(record.description ?? "").trim(),
    logoUrl: String(record.logoUrl ?? "").trim(),
  };
}

/**
 * Activate the signed-in customer's vendor account.
 *
 * Security notes:
 * - The user id comes from the Better Auth session, never from the payload.
 * - The role is hard-coded to `vendor` in the data layer. The client cannot
 *   send a role, and Better Auth's `input: false` blocks role fields anyway.
 * - The shop fields are re-validated here even though the form validates them.
 */
export async function activateVendorAccountAction(
  input: VendorActivationInput,
): Promise<VendorActivationResult> {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      message: "Your session expired. Please sign in again and retry.",
    };
  }

  if (user.role === "admin") {
    return {
      ok: false,
      message: "Admin accounts cannot register as vendors.",
    };
  }

  if (user.role === "vendor") {
    const shop = await getShopForOwner(user.id);

    if (shop?.status === "active") {
      return {
        ok: true,
        message: "Your vendor account is already active.",
      };
    }

    if (shop?.status === "suspended") {
      return {
        ok: false,
        message:
          "This vendor account is suspended. Contact the SliceStack team for help.",
      };
    }
  }

  const values = readInput(input);
  const errors = validateVendorDetails(values);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  try {
    await activateVendorAccount({
      userId: user.id,
      ownerName: user.name,
      shopName: values.shopName,
      phone: values.phone,
      address: values.address,
      description: values.description,
      logoUrl: values.logoUrl || null,
    });
  } catch (error) {
    if (error instanceof VendorApplicationError) {
      return { ok: false, message: error.message };
    }

    // A concurrent activation hit the unique ownerId/userId index.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        ok: false,
        message:
          "Your vendor profile was already created. Refresh the page and continue.",
      };
    }

    console.error("Vendor activation failed", error);
    return {
      ok: false,
      message: "We could not activate your shop. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/customer");
  revalidatePath("/dashboard/vendor");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/vendors");
  revalidatePath("/register-as-a-vendor");

  return {
    ok: true,
    message: "Your shop is ready. Welcome to SliceStack!",
  };
}
