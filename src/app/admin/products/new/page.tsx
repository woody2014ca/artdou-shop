"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (!name || isNaN(numPrice) || !description) {
      alert("请填写名称、价格、描述");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: numPrice,
          description,
          image: imageUrl || "/products/placeholder.jpg",
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

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">新增商品</h1>
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
            标签（可选，如：热卖、新品）
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
          {uploading && (
            <span className="ml-2 text-sm text-[#847d78]">上传中…</span>
          )}
          {imageUrl && (
            <p className="mt-1 text-sm text-[#5c6473]">已上传：{imageUrl}</p>
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
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-[#d8d0c7] px-5 py-2 text-sm hover:bg-[#f4efea]"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
