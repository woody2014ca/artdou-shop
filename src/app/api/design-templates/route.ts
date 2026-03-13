import { NextResponse } from "next/server";
import templatesData from "@/data/design-templates.json";

export async function GET() {
  return NextResponse.json(templatesData);
}
