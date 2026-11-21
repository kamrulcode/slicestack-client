"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { orderService } from "@/services/orders.service";

export function VendorOrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<
    "accepted" | "rejected" | null
  >(null);

  if (status !== "pending") return null;

  async function update(next: "accepted" | "rejected") {
    setPendingAction(next);

    try {
      const result = await orderService.setVendorStatus(orderId, next);
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        disabled={pendingAction !== null}
        onClick={() => update("accepted")}
      >
        {pendingAction === "accepted" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Check className="size-4" aria-hidden />
        )}
        Accept order
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={pendingAction !== null}
        onClick={() => update("rejected")}
      >
        {pendingAction === "rejected" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <X className="size-4" aria-hidden />
        )}
        Reject order
      </Button>
    </div>
  );
}
