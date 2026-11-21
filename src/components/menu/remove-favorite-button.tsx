"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { favoriteService } from "@/services/favorites.service";

export function RemoveFavoriteButton({ menuItemId }: { menuItemId: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function remove() {
    setIsPending(true);

    try {
      await favoriteService.remove(menuItemId);
      toast.success("Removed from favorites.");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={remove}
      disabled={isPending}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        <HeartOff className="size-3.5" aria-hidden />
      )}
      Remove
    </Button>
  );
}
