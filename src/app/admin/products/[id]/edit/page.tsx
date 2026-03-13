"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((list: Product[]) => {
        const p = list.find((x) => x.id === id);
        if (p) {
          setProduct(p);
          setName(p.name);
          setPrice(String(p.price));
          setDescription(p.description);
          setTag(p.tag ?? "");
          setImageUrl(p.image);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("type", "product");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price);
    if (!product || !name || isNaN(numPrice) || !description) {
      alert("请填写名称、价格、描述");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: numPrice,
          description,
          image: imageUrl,
          tag: tag.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-[#847d78]">加载中…</div>;
  if (!product) return <div className="text-[#c44]">商品不存在</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">编辑商品</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4c4648]">
            商品名称 *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e1dcd5] px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4c4648]">
            价格（美元）*
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e1dcd5] px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4c4648]">
            描述 *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-[#e1dcd5] px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4c4648]">
            标签（可选）
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#e1dcd5] px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4c4648]">
            商品图片
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="mt-1 text-sm"
          />
          {uploading && <span className="ml-2 text-sm text-[#847d78]">上传中…</span>}
          {imageUrl && (
            <p className="mt-1 text-sm text-[#5c6473]">当前：{imageUrl}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#8a9ba8] px-5 py-2 text-sm font-medium text-white hover:bg-[#7c8c99] disabled:opacity-50"
          >
            {saving ? "保存中…" : "保存"}
          </button>
          <Link
            href="/admin/products"
            className="rounded-full border border-[#d8d0c7] px-5 py-2 text-sm hover:bg-[#f4efea]"
          >
            取消
          </Link>
        </div>
      </form>
    </div>
  );
}
