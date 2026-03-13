"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定删除「${name}」吗？`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
    else alert("删除失败");
  };

  if (loading) {
    return <div className="text-[#847d78]">加载中…</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-[#4c4648]">商品管理</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-[#8a9ba8] px-4 py-2 text-sm font-medium text-white hover:bg-[#7c8c99]"
        >
          新增商品
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e1dcd5] bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center text-[#847d78]">
            暂无商品，点击「新增商品」添加。
          </div>
        ) : (
          <ul className="divide-y divide-[#e1dcd5]">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-4 px-4 py-4 sm:flex-nowrap"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#e8e4e0]">
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[#4c4648]">{p.name}</div>
                  <div className="text-sm text-[#847d78]">
                    ${p.price} · {p.description.slice(0, 50)}…
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="rounded-lg border border-[#d8d0c7] px-3 py-1.5 text-sm hover:bg-[#f4efea]"
                  >
                    编辑
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.name)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    删除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
