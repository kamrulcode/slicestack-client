// /app/api/checkout_sessions/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const origin = (await headers()).get("origin");
    const body = await req.json();
    const { type } = body;

    // ── 1. Build line item based on payment type ───────────────────
    let lineItem,
      metadata = {},
      mode,
      successUrl;

    if (type === "subscription") {
      // Fixed plan: use a pre-created Price ID from the Stripe dashboard
      lineItem = { price: "price_1TfcIkKExS1h0fIIuuxbZXVi", quantity: 1 }; // price id from stripe dashboard
      mode = "subscription";
      successUrl = `${origin}/dashboard/premium-success?session_id={CHECKOUT_SESSION_ID}`;
    } else {
      // Dynamic price: pass price_data inline (no dashboard setup required)
      lineItem = {
        price_data: {
          currency: "usd",
          unit_amount: body.totalTicketPrice * 100, // ALWAYS multiply by 100 for cents
          product_data: { name: body.eventTitle },
        },
        quantity: body.quantity,
      };
      mode = "payment";
      successUrl = `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`;

      // Store whatever you need to identify this transaction later
      metadata = {
        userId: body.userId || "",
        eventId: body.eventId || "",
        eventTitle: body.eventTitle || "",
        quantity: body.quantity || 1,
        amount: body.totalTicketPrice || 0,
      };
    }

    // ── 2. Create the Stripe Checkout Session ──────────────────────
    const session = await stripe.checkout.sessions.create({
      line_items: [lineItem],
      mode,
      metadata,
      success_url: successUrl,
      cancel_url: `${origin}/payment-cancelled`,
      customer_email: body.email || undefined, // optional: pre-fill email
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    const error =
      err instanceof Error ? err : new Error("An unexpected error occurred");
    return NextResponse.json(
      { error: error.message },
      {
        status:
          "statusCode" in error && typeof error.statusCode === "number"
            ? error.statusCode
            : 500,
      },
    );
  }
}
