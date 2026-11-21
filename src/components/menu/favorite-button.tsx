"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { favoriteService } from "@/services/favorites.service";

export function FavoriteButton({
  menuItemId,
  initialFavorite,
}: {
  menuItemId: string;
  initialFavorite: boolean;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, setIsPending] = useState(false);

  async function toggle() {
    setIsPending(true);

    try {
      if (isFavorite) {
        await favoriteService.remove(menuItemId);
        setIsFavorite(false);
        toast.success("Removed from favorites.");
      } else {
        await favoriteService.add(menuItemId);
        setIsFavorite(true);
        toast.success("Saved to favorites.");
      }
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
      size="lg"
      className="h-12 gap-2 px-5"
      onClick={toggle}
      disabled={isPending}
      aria-pressed={isFavorite}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Heart
          className={isFavorite ? "size-4 fill-primary text-primary" : "size-4"}
          aria-hidden
        />
      )}
      {isFavorite ? "Saved" : "Save"}
    </Button>
  );
}
