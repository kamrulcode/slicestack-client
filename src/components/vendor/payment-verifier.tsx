"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { subscriptionService } from "@/services/subscriptions.service";
import { errorMessage } from "@/lib/api/client";

/**
 * Invisible component that verifies a Stripe Checkout session after the user
 * is redirected back. It calls the server verify endpoint, which checks the
 * payment with Stripe and activates premium if payment succeeded. After
 * verification completes, it reloads the page to show the updated plan.
 */
export function PaymentVerifier({
  sessionId,
  returnState,
}: {
  sessionId?: string;
  returnState: "success" | "cancelled";
}) {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const result = await subscriptionService.verify(
          sessionId ?? "",
          returnState === "cancelled",
        );
        if (cancelled) return;

        if (result.transactionStatus === "succeeded" && result.plan === "premium") {
          toast.success(
            "Payment successful! Your Premium subscription is now active.",
            { position: "top-center" },
          );
          router.replace("/dashboard/vendor/subscription");
        } else if (
          result.transactionStatus === "failed" &&
          returnState === "cancelled"
        ) {
          toast.info("Checkout was cancelled. No payment was made.", {
            position: "top-center",
          });
        } else if (result.transactionStatus === "failed") {
          toast.error("Payment failed. You can try subscribing again.", {
            position: "top-center",
          });
        } else if (returnState === "cancelled") {
          toast.info(
            "Checkout was cancelled, but Stripe is still processing the payment.",
            { position: "top-center" },
          );
        } else if (result.transactionStatus === "pending") {
          toast.info("Payment is pending confirmation from Stripe.", {
            position: "top-center",
          });
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Payment verification:", errorMessage(error));
        toast.error("We could not verify your payment with Stripe.", {
          position: "top-center",
        });
      } finally {
        if (!cancelled) {
          setVerifying(false);
          // Refresh the page data to show the verified plan and payment state.
          router.refresh();
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, returnState, router]);

  if (!verifying) return null;

  return (
    <div className="mb-5 rounded-xl border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
      Verifying your payment with Stripe…
    </div>
  );
}
