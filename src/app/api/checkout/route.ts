import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe =
  stripeSecretKey != null
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2026-02-25.clover",
      })
    : null;

export async function POST(req: NextRequest) {
  if (!stripe || !stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { items } = body as {
    items: { id: string; name: string; price: number; quantity: number }[];
  };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "No items found in the request." },
      { status: 400 }
    );
  }

  try {
    const origin = req.headers.get("origin") ?? undefined;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}

