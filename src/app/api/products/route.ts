import { NextResponse } from "next/server";
import products from "@/data/products.json";
import type { Product } from "@/types/product";

export async function GET() {
  return NextResponse.json(products as Product[]);
}
