"use client";

import { useState, useRef, useEffect } from "react";

export default function AdminHeroPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview("/hero.jpg");
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    setUploading(true);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("type", "hero");
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data.url) {
        setPreview(data.url + "?t=" + Date.now());
        setMessage("主图已更新，首页右上角将显示新图。");
      } else {
        setMessage("上传失败");
      }
    } catch {
      setMessage("上传失败");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">主图设置</h1>
      <p className="mt-1 text-sm text-[#847d78]">
        设置首页右上角大图（Hero）。建议尺寸约 800×1000 或等比例。
      </p>
      <div className="mt-6 max-w-md">
        <div className="mb-4 aspect-[4/5] overflow-hidden rounded-2xl border border-[#e1dcd5] bg-[#e8e4e0]">
          {preview ? (
            <img
              src={preview}
              alt="主图预览"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src="/hero.jpg"
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-[#8a9ba8] px-5 py-2 text-sm font-medium text-white hover:bg-[#7c8c99] disabled:opacity-50"
        >
          {uploading ? "上传中…" : "选择图片上传"}
        </button>
        {message && (
          <p className="mt-2 text-sm text-[#5c6473]">{message}</p>
        )}
      </div>
    </div>
  );
}
