"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { errorMessage } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { orderService } from "@/services/orders.service";

export function OrderForm({
  menuItemId,
  price,
  shopName,
}: {
  menuItemId: string;
  price: number;
  shopName: string;
}) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const [deliveryDate, setDeliveryDate] = useState(today);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!deliveryDate) {
      toast.error("Choose a delivery date.");
      return;
    }

    if (deliveryAddress.trim().length < 5) {
      toast.error("Enter a delivery address (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await orderService.create({
        menuItemId,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        message: message.trim(),
      });

      toast.success(result.message);
      router.push(`/dashboard/customer/orders/${result.order.id}`);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-primary" aria-hidden />
          Order this item
        </CardTitle>
        <CardDescription>
          {shopName || "This shop"} · {formatPrice(price)} per item
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="delivery-date">Delivery date</Label>
            <div className="relative">
              <CalendarDays
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="delivery-date"
                type="date"
                min={today}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delivery-address">Delivery address</Label>
            <Input
              id="delivery-address"
              value={deliveryAddress}
              onChange={(event) => setDeliveryAddress(event.target.value)}
              placeholder="House, street, area, city"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="delivery-message">
              Message or special instructions
            </Label>
            <Textarea
              id="delivery-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Optional notes for the shop"
              rows={3}
            />
          </div>

          <Button type="submit" size="lg" className="h-12 gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Placing order...
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" aria-hidden />
                Place order · {formatPrice(price)}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
