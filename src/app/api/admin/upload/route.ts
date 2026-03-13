import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const PRODUCTS_DIR = path.join(process.cwd(), "public", "products");
const HERO_PATH = path.join(process.cwd(), "public", "hero.jpg");

function safeFilename(name: string): string {
  const ext = path.extname(name) || "";
  const base = path.basename(name, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
  return base.slice(0, 80) + ext || "image.jpg";
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const type = (formData.get("type") as string) || "product";

  if (!file || !file.size) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (type === "hero") {
      await writeFile(HERO_PATH, buffer);
      return NextResponse.json({ url: "/hero.jpg" });
    }

    await mkdir(PRODUCTS_DIR, { recursive: true });
    const filename = safeFilename(file.name || "upload.jpg");
    const filePath = path.join(PRODUCTS_DIR, filename);
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/products/${filename}` });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
