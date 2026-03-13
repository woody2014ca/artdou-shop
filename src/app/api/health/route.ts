import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "artdou-shop",
    time: new Date().toISOString(),
  });
}
