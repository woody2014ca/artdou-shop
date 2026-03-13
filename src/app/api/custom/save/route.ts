import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";

const DESIGNS_DIR = path.join(process.cwd(), "public", "designs");
const DESIGNS_INDEX = path.join(process.cwd(), "data", "designs.json");

type DesignRecord = {
  id: string;
  templateId: string;
  originalUrl: string;
  previewUrl: string;
  createdAt: string;
};

function generateId(): string {
  return "d-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const templateId = (formData.get("templateId") as string) || "";
    const originalFile = formData.get("original") as File | null;
    const previewFile = formData.get("preview") as File | null;

    if (!templateId || !originalFile?.size || !previewFile?.size) {
      return NextResponse.json(
        { error: "Missing templateId, original image, or preview image." },
        { status: 400 }
      );
    }

    const id = generateId();
    const designDir = path.join(DESIGNS_DIR, id);
    await ensureDir(designDir);

    const ext = path.extname(originalFile.name) || ".jpg";
    const originalPath = path.join(designDir, "original" + ext);
    const previewPath = path.join(designDir, "preview.jpg");

    const origBuf = Buffer.from(await originalFile.arrayBuffer());
    const prevBuf = Buffer.from(await previewFile.arrayBuffer());
    await writeFile(originalPath, origBuf);
    await writeFile(previewPath, prevBuf);

    const baseUrl = "/designs";
    const record: DesignRecord = {
      id,
      templateId,
      originalUrl: `${baseUrl}/${id}/original${ext}`,
      previewUrl: `${baseUrl}/${id}/preview.jpg`,
      createdAt: new Date().toISOString(),
    };

    let list: DesignRecord[] = [];
    try {
      const raw = await readFile(DESIGNS_INDEX, "utf-8");
      list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];
    } catch {
      await ensureDir(path.dirname(DESIGNS_INDEX));
    }
    list.unshift(record);
    await writeFile(DESIGNS_INDEX, JSON.stringify(list, null, 2), "utf-8");

    return NextResponse.json({
      designId: id,
      previewUrl: record.previewUrl,
      originalUrl: record.originalUrl,
    });
  } catch (e) {
    console.error("Design save error:", e);
    return NextResponse.json(
      { error: "Failed to save design." },
      { status: 500 }
    );
  }
}
