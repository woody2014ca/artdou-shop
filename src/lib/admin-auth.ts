import { createHash } from "crypto";

const ADMIN_COOKIE = "admin_session";

export function getAdminToken(): string | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;
  return createHash("sha256").update(secret + ":admin").digest("hex");
}

export function isAdminAuthenticated(req: {
  cookies: { get: (name: string) => { value: string } | undefined };
  headers: { get: (name: string) => string | null };
}): boolean {
  const token = getAdminToken();
  if (!token) return false;
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookie === token) return true;
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get("authorization") === `Bearer ${secret}`)
    return true;
  return false;
}
