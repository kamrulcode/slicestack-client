"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { subscriptionService } from "@/services/subscriptions.service";

export function UpgradeButton({ disabled }: { disabled?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);

  async function upgrade() {
    setIsLoading(true);

    try {
      const result = await subscriptionService.checkout();
      window.location.href = result.url;
    } catch (error) {
      toast.error(errorMessage(error));
      setIsLoading(false);
    }
  }

  return (
    <Button type="button" onClick={upgrade} disabled={isLoading || disabled}>
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <CreditCard className="size-4" aria-hidden />
      )}
      {isLoading ? "Opening checkout..." : "Upgrade to Premium"}
    </Button>
  );
}
