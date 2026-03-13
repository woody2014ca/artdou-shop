"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data?.error === "string"
            ? data.error
            : res.status === 401
              ? "密码错误（若一直显示 Unauthorized，请到 Vercel 项目 Settings 检查是否开启了 Password Protection，需关闭）"
              : "登录失败";
        setError(msg);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f2ef] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#e1dcd5] bg-white p-8 shadow-md">
        <h1 className="text-xl font-semibold text-[#4c4648]">
          商城后台登录
        </h1>
        <p className="mt-1 text-sm text-[#847d78]">
          请输入管理员密码（与 .env 中 ADMIN_SECRET 一致）
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理员密码"
            className="w-full rounded-lg border border-[#e1dcd5] px-4 py-2.5 text-sm"
            autoFocus
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#8a9ba8] py-2.5 text-sm font-medium text-white hover:bg-[#7c8c99] disabled:opacity-50"
          >
            {loading ? "登录中…" : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
