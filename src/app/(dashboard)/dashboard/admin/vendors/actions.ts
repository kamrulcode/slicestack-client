"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/authorization";
import {
  reviewVendorApplication,
  VendorApplicationError,
  type ReviewAction,
} from "@/lib/vendor-applications";

export type ReviewState = {
  ok: boolean;
  message: string;
};

const REVIEW_ACTIONS: ReviewAction[] = ["approve", "reject", "suspend"];

const DONE_LABEL: Record<ReviewAction, string> = {
  approve: "approved",
  reject: "rejected",
  suspend: "suspended",
};

/**
 * Approve / reject / suspend a vendor application.
 *
 * The admin role is re-checked here even though the page already guards the
 * route: every mutation must be authorized on its own.
 */
export async function reviewVendorApplicationAction(
  _previousState: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const admin = await requireRole(["admin"], "/dashboard/admin/vendors");

  const applicationId = String(formData.get("applicationId") ?? "").trim();
  const rawAction = String(formData.get("action") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();

  const action = REVIEW_ACTIONS.find((value) => value === rawAction);

  if (!applicationId || !action) {
    return { ok: false, message: "Invalid review request." };
  }

  if (reason.length > 500) {
    return { ok: false, message: "The rejection reason is too long." };
  }

  try {
    await reviewVendorApplication({
      applicationId,
      adminId: admin.id,
      action,
      reason: action === "reject" ? reason || null : null,
    });
  } catch (error) {
    if (error instanceof VendorApplicationError) {
      return { ok: false, message: error.message };
    }
    console.error("Vendor review failed", error);
    return {
      ok: false,
      message: "The review could not be saved. Please try again.",
    };
  }

  revalidatePath("/dashboard/admin/vendors");
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/customer");
  revalidatePath("/dashboard/vendor");

  return {
    ok: true,
    message: `Application ${DONE_LABEL[action]} successfully.`,
  };
}
