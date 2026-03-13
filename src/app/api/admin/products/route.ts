import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Product } from "@/types/product";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const getProductsPath = () =>
  path.join(process.cwd(), "src", "data", "products.json");

async function loadProducts(): Promise<Product[]> {
  const raw = await readFile(getProductsPath(), "utf-8");
  const data = JSON.parse(raw);
  return Array.isArray(data) ? data : [];
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await loadProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const { name, price, description, image, tag } = body as Partial<Product>;

  if (!name || typeof price !== "number" || !description) {
    return NextResponse.json(
      { error: "Missing name, price, or description" },
      { status: 400 }
    );
  }

  const id =
    (name as string)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") +
    "-" +
    Date.now().toString(36);

  const product: Product = {
    id,
    name: String(name),
    price: Number(price),
    description: String(description),
    image: image && typeof image === "string" ? image : "/products/placeholder.jpg",
    tag: tag ? String(tag) : undefined,
  };

  try {
    const products = await loadProducts();
    products.push(product);
    await writeFile(
      getProductsPath(),
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return NextResponse.json(product);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to save product" },
      { status: 500 }
    );
  }
}
