import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const DESIGNS_INDEX = path.join(process.cwd(), "data", "designs.json");

export async function GET(req: NextRequest) {
  if (!isAdminAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const raw = await readFile(DESIGNS_INDEX, "utf-8");
    const list = JSON.parse(raw);
    return NextResponse.json(Array.isArray(list) ? list : []);
  } catch {
    return NextResponse.json([]);
  }
}
