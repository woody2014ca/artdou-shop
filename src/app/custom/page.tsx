"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LangContext";

type PrintArea = { left: number; top: number; width: number; height: number };
type Template = {
  id: string;
  name: string;
  productId: string;
  templateImage: string;
  printArea: PrintArea;
};

export default function CustomDesignPage() {
  const { t, lang } = useLang();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedDesign, setSavedDesign] = useState<{
    designId: string;
    previewUrl: string;
    productId: string;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const templateImgRef = useRef<HTMLImageElement | null>(null);
  const userImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    fetch("/api/design-templates")
      .then((r) => r.json())
      .then(setTemplates)
      .catch(() => setTemplates([]));
  }, []);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const template = templateImgRef.current;
    const userImg = userImgRef.current;
    if (!canvas || !template?.complete || !userImg?.complete || !selected) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = template.naturalWidth;
    const h = template.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    const { left, top, width, height } = selected.printArea;
    const x = Math.round(left * w);
    const y = Math.round(top * h);
    const sw = Math.round(width * w);
    const sh = Math.round(height * h);

    ctx.drawImage(template, 0, 0);
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, sw, sh);
    ctx.clip();
    ctx.drawImage(userImg, x, y, sw, sh);
    ctx.restore();
  }, [selected]);

  useEffect(() => {
    if (!selected || !userImage) return;
    const tImg = new Image();
    tImg.crossOrigin = "anonymous";
    templateImgRef.current = tImg;
    tImg.onload = () => {
      const uImg = new Image();
      uImg.crossOrigin = "anonymous";
      userImgRef.current = uImg;
      uImg.onload = () => {
        templateImgRef.current = tImg;
        userImgRef.current = uImg;
        drawPreview();
      };
      uImg.src = userImage;
    };
    tImg.src = selected.templateImage;
  }, [selected, userImage, drawPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUserFile(file);
    setUserImage(URL.createObjectURL(file));
    setSavedDesign(null);
  };

  const handleSaveDesign = async () => {
    if (!selected || !userFile || !canvasRef.current) return;
    setSaving(true);
    try {
      const canvas = canvasRef.current;
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.92)
      );
      if (!blob) throw new Error("Canvas to blob failed");

      const form = new FormData();
      form.set("templateId", selected.id);
      form.set("original", userFile);
      form.set("preview", blob, "preview.jpg");

      const res = await fetch("/api/custom/save", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedDesign({
        designId: data.designId,
        previewUrl: data.previewUrl,
        productId: selected.productId,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCartWithDesign = () => {
    if (!savedDesign) return;
    const cart = JSON.parse(localStorage.getItem("artdou-cart") || "[]");
    const existing = cart.find(
      (x: { id: string; designId?: string }) =>
        x.id === savedDesign.productId && x.designId === savedDesign.designId
    );
    const payload = existing
      ? cart.map((x: { id: string; quantity: number; designId?: string }) =>
          x.id === savedDesign.productId && x.designId === savedDesign.designId
            ? { ...x, quantity: x.quantity + 1 }
            : x
        )
      : [...cart, { id: savedDesign.productId, quantity: 1, designId: savedDesign.designId }];
    localStorage.setItem("artdou-cart", JSON.stringify(payload));
    window.location.href = "/?added=1";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5]">
      <header className="sticky top-0 z-20 border-b border-[#e1dcd5] bg-[#f7f4f1]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-[#464044]">
            ArtDoU
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-[#5a5450] hover:text-[#4c4648]"
            >
              {lang === "zh" ? "返回商城" : "Back to shop"}
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-[#4c4648]">
          {lang === "zh" ? "AI 区 · 自定义图案" : "Custom design"}
        </h1>
        <p className="mt-1 text-sm text-[#847d78]">
          {lang === "zh"
            ? "上传你的设计或图片，预览印在 T 恤/布袋上的效果，保存后可选商品加购。"
            : "Upload your design, preview on product, save and add to cart."}
        </p>

        {!selected ? (
          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-[#4c4648]">
              {lang === "zh" ? "选择款式" : "Choose product"}
            </p>
            <div className="flex flex-wrap gap-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelected(t)}
                  className="rounded-2xl border border-[#e1dcd5] bg-white px-5 py-3 text-sm font-medium shadow-sm hover:border-[#d4ccc3] hover:shadow-md"
                >
                  {t.name}
                </button>
              ))}
            </div>
            {templates.length === 0 && (
              <p className="text-sm text-[#847d78]">
                {lang === "zh" ? "加载中…" : "Loading…"}
              </p>
            )}
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-[#847d78]">
                {lang === "zh" ? "当前款式" : "Template"}: {selected.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setUserImage(null);
                  setUserFile(null);
                  setSavedDesign(null);
                }}
                className="text-sm text-[#8a9ba8] hover:underline"
              >
                {lang === "zh" ? "换一款" : "Change"}
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#4c4648]">
                  {lang === "zh" ? "上传你的图案/照片" : "Upload your design"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm"
                />
                {userImage && (
                  <div className="mt-2 aspect-square max-w-[200px] overflow-hidden rounded-lg border border-[#e1dcd5]">
                    <img
                      src={userImage}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#4c4648]">
                  {lang === "zh" ? "预览效果" : "Preview"}
                </p>
                <div className="aspect-square max-w-full overflow-hidden rounded-2xl border border-[#e1dcd5] bg-[#f4efea]">
                  {userImage ? (
                    <canvas
                      ref={canvasRef}
                      className="h-full w-full object-contain"
                      style={{ maxHeight: "400px" }}
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-[#9a918d]">
                      {lang === "zh" ? "上传图片后显示预览" : "Upload to see preview"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {userImage && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDesign}
                  disabled={saving}
                  className="rounded-full bg-[#8a9ba8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#7c8c99] disabled:opacity-50"
                >
                  {saving
                    ? lang === "zh"
                      ? "保存中…"
                      : "Saving…"
                    : lang === "zh"
                      ? "保存设计"
                      : "Save design"}
                </button>
                {savedDesign && (
                  <>
                    <span className="text-sm text-[#5c6473]">
                      {lang === "zh" ? "已保存" : "Saved"}
                    </span>
                    <button
                      type="button"
                      onClick={handleAddToCartWithDesign}
                      className="rounded-full border border-[#8a9ba8] bg-white px-5 py-2.5 text-sm font-medium text-[#8a9ba8] hover:bg-[#f4efea]"
                    >
                      {lang === "zh" ? "选商品加购" : "Add to cart"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
