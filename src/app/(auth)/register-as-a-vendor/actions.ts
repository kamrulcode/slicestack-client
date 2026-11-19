"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/authorization";
import {
  getVendorApplicationForUser,
  submitVendorApplication,
  VendorApplicationError,
} from "@/lib/vendor-applications";
import {
  readVendorForm,
  validateVendorApplication,
  type VendorFormState,
} from "@/lib/vendor-validation";

/**
 * Submit (or resubmit) the current user's vendor application.
 *
 * Security notes:
 * - The user id comes from the verified Better Auth session, never the form.
 * - The form cannot set a role; the user stays a customer until an admin
 *   approves the application through the protected review action.
 */
export async function submitVendorApplicationAction(
  _previousState: VendorFormState,
  formData: FormData,
): Promise<VendorFormState> {
  const user = await requireAuth("/register-as-a-vendor");

  if (user.role !== "customer") {
    return {
      ok: false,
      message: "Your account already has vendor or admin access.",
      errors: {},
    };
  }

  const values = readVendorForm(formData);
  const errors = validateVendorApplication(values);

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors,
      values,
    };
  }

  const existing = await getVendorApplicationForUser(user.id);

  if (existing && existing.status !== "REJECTED") {
    return {
      ok: false,
      message:
        existing.status === "APPROVED"
          ? "Your vendor application is already approved."
          : "You already have a vendor application in progress.",
      errors: {},
      values,
    };
  }

  try {
    await submitVendorApplication({
      userId: user.id,
      shopName: values.shopName,
      ownerName: values.ownerName,
      phone: values.phone,
      address: values.address,
      description: values.description,
      logoUrl: values.logoUrl || null,
    });
  } catch (error) {
    if (error instanceof VendorApplicationError) {
      return { ok: false, message: error.message, errors: {}, values };
    }
    // Unique index on userId: two submissions raced each other.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        ok: false,
        message: "You already have a vendor application in progress.",
        errors: {},
        values,
      };
    }
    console.error("Vendor application submission failed", error);
    return {
      ok: false,
      message: "We could not save your application. Please try again.",
      errors: {},
      values,
    };
  }

  revalidatePath("/dashboard/customer");
  revalidatePath("/register-as-a-vendor");

  return {
    ok: true,
    message:
      "Application submitted. Your vendor application is awaiting admin review.",
    errors: {},
  };
}
