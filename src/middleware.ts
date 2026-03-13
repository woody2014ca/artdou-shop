import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "admin_session";

async function getAdminToken(): Promise<string | null> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  const data = new TextEncoder().encode(secret + ":admin");
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = await getAdminToken();

  if (path === "/admin/login") {
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    if (token && cookie === token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token) {
      if (path !== "/admin/login")
        return NextResponse.redirect(new URL("/admin/login", req.url));
      return NextResponse.next();
    }
    if (cookie !== token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/api/admin")) {
    if (path === "/api/admin/login") {
      return NextResponse.next();
    }
    const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!token || cookie !== token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/", "/admin/:path*", "/api/admin/:path*"],
};
