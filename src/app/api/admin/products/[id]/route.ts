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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { name, price, description, image, tag } = body as Partial<Product>;

  try {
    const products = await loadProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const existing = products[index];
    products[index] = {
      id: existing.id,
      name: name !== undefined ? String(name) : existing.name,
      price: price !== undefined ? Number(price) : existing.price,
      description:
        description !== undefined ? String(description) : existing.description,
      image: image !== undefined ? String(image) : existing.image,
      tag: tag !== undefined ? (tag ? String(tag) : undefined) : existing.tag,
    };

    await writeFile(
      getProductsPath(),
      JSON.stringify(products, null, 2),
      "utf-8"
    );
    return NextResponse.json(products[index]);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const products = await loadProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    await writeFile(
      getProductsPath(),
      JSON.stringify(filtered, null, 2),
      "utf-8"
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
