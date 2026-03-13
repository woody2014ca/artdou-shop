import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const ADMIN_COOKIE = "admin_session";

function getAdminToken(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret + ":admin").digest("hex");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawPassword = (body as { password?: string }).password;
  const password = typeof rawPassword === "string" ? rawPassword.trim() : "";

  const secret = process.env.ADMIN_SECRET;
  const token = getAdminToken();
  if (!token || !secret) {
    return NextResponse.json(
      { error: "后台未配置：请在 Vercel 项目 Settings → Environment Variables 中添加 ADMIN_SECRET" },
      { status: 503 }
    );
  }

  const secretTrimmed = secret.trim();
  if (password !== secretTrimmed) {
    return NextResponse.json(
      { error: "密码错误：请确认与 Vercel 里 ADMIN_SECRET 完全一致（无空格、区分大小写）" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
  res.cookies.set(ADMIN_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    secure: isProd,
  });
  return res;
}
