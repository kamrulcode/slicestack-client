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
export function PaymentVerifier({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const result = await subscriptionService.verify(sessionId);
        if (cancelled) return;

        if (result.paymentStatus === "paid" && result.plan === "premium") {
          toast.success("Premium activated! Your plan has been upgraded.");
        } else if (result.paymentStatus === "unpaid") {
          toast.info(
            "Payment is still being processed. Refresh in a moment.",
          );
        }
      } catch (error) {
        if (cancelled) return;
        // Don't show an error toast if verification fails — the success banner
        // is already visible and webhooks may still activate premium.
        console.error("Payment verification:", errorMessage(error));
      } finally {
        if (!cancelled) {
          setVerifying(false);
          // Refresh the page data to show updated plan status.
          router.refresh();
        }
      }
    }

    verify();
    return () => {
      cancelled = true;
    };
  }, [sessionId, router]);

  if (!verifying) return null;

  return (
    <div className="mb-5 rounded-xl border border-blue-300 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
      Verifying your payment with Stripe…
    </div>
  );
}
