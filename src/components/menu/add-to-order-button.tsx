"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export function AddToOrderButton({ price }: { price: number }) {
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="lg"
      className="h-12 gap-2 px-6"
      disabled={added}
      onClick={() => setAdded(true)}
    >
      {added ? (
        <>
          <Check className="size-4" aria-hidden />
          Added to order
        </>
      ) : (
        <>
          <ShoppingBag className="size-4" aria-hidden />
          Add to order · {formatPrice(price)}
        </>
      )}
    </Button>
  );
}
