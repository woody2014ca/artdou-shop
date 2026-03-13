import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe =
  stripeSecretKey != null
    ? new Stripe(stripeSecretKey, {
        apiVersion: "2026-02-25.clover",
      })
    : null;

const getOrdersPath = () =>
  path.join(process.cwd(), "data", "orders.json");

async function ensureDataDir() {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  if (!stripe || !stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const sessionId = (body as { session_id?: string }).session_id;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Missing session_id." },
      { status: 400 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Session not paid." },
        { status: 400 }
      );
    }

    const lineItems = session.line_items?.data ?? [];
    let designs: { productId: string; designId: string; quantity: number }[] = [];
    try {
      const raw = session.metadata?.cart_designs;
      if (typeof raw === "string") designs = JSON.parse(raw);
    } catch {
      // ignore
    }

    const order = {
      id: session.id,
      created: new Date().toISOString(),
      stripe_session_id: sessionId,
      amount_total: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      customer_email: session.customer_email ?? session.customer_details?.email ?? null,
      items: lineItems.map((li) => ({
        name: li.description ?? li.price?.nickname ?? "Item",
        quantity: li.quantity ?? 0,
        amount: li.amount_total ?? 0,
      })),
      designs,
    };

    // 本地/自建服务器可写入 data/orders.json；Vercel 为只读，此处会跳过写入
    try {
      await ensureDataDir();
      const ordersPath = getOrdersPath();
      let orders: unknown[] = [];
      try {
        const raw = await readFile(ordersPath, "utf-8");
        orders = JSON.parse(raw);
      } catch {
        // file missing or invalid
      }
      if (!Array.isArray(orders)) orders = [];
      orders.push(order);
      await writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf-8");
    } catch (fileErr) {
      console.warn("Order not saved to file (e.g. Vercel read-only):", fileErr);
    }

    return NextResponse.json({ ok: true, order_id: session.id });
  } catch (error) {
    console.error("Order save error:", error);
    return NextResponse.json(
      { error: "Failed to save order." },
      { status: 500 }
    );
  }
}
