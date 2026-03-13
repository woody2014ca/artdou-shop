"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/admin", label: "首页" },
  { href: "/admin/products", label: "商品管理" },
  { href: "/admin/hero", label: "主图设置" },
  { href: "/admin/designs", label: "设计记录" },
  { href: "/admin/orders", label: "订单管理" },
];

export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f2ef]">
      <header className="border-b border-[#e1dcd5] bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <nav className="flex items-center gap-1">
            {nav.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === href || (href !== "/admin" && pathname.startsWith(href))
                    ? "bg-[#e8e4e0] text-[#4c4648]"
                    : "text-[#847d78] hover:bg-[#f4efea] hover:text-[#4c4648]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#8a9ba8] hover:underline"
            >
              访问商城
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm text-[#847d78] hover:bg-[#f4efea] hover:text-[#4c4648]"
            >
              退出
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
