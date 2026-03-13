import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const getOrdersPath = () => path.join(process.cwd(), "data", "orders.json");

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const ordersPath = getOrdersPath();
    const raw = await readFile(ordersPath, "utf-8");
    const orders = JSON.parse(raw);
    if (!Array.isArray(orders)) {
      return NextResponse.json([]);
    }
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json([]);
  }
}
