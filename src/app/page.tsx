"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import productsData from "@/data/products.json";
import designTemplatesData from "@/data/design-templates.json";
import { useLang } from "@/contexts/LangContext";

type DesignTemplate = {
  id: string;
  name: string;
  productId: string;
  templateImage: string;
  printArea: { left: number; top: number; width: number; height: number };
};

const designTemplates: DesignTemplate[] = designTemplatesData as DesignTemplate[];
const SEASONAL_COUNT = 4;
const AI_ZONE_COUNT = 4;

const CART_STORAGE_KEY = "artdou-cart";

type CartItem = {
  product: Product;
  quantity: number;
  designId?: string;
};

const products: Product[] = productsData as Product[];

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      id: string;
      quantity: number;
      designId?: string;
    }[];
    if (!Array.isArray(parsed)) return [];
    const items: CartItem[] = [];
    for (const { id, quantity, designId } of parsed) {
      const product = products.find((p) => p.id === id);
      if (product && quantity > 0)
        items.push({ product, quantity, ...(designId ? { designId } : {}) });
    }
    return items;
  } catch {
    return [];
  }
}

export default function Home() {
  const { t, lang, setLang } = useLang();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    setCart(loadCartFromStorage());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = cart.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
      ...(item.designId ? { designId: item.designId } : {}),
    }));
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cart]
  );

  const handleAddToCart = (product: Product, designId?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id && (item.designId ?? "") === (designId ?? "")
      );
      if (!existing) {
        return [...prev, { product, quantity: 1, ...(designId ? { designId } : {}) }];
      }
      return prev.map((item) =>
        item.product.id === product.id && (item.designId ?? "") === (designId ?? "")
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
    setIsCartOpen(true);
    setAddedMessage(`${product.name} ${lang === "zh" ? "已加入购物车" : "added to cart"}`);
    setTimeout(() => {
      setAddedMessage(null);
    }, 1800);
  };

  const handleUpdateQuantity = (
    productId: string,
    delta: number,
    designId?: string
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId &&
          (item.designId ?? "") === (designId ?? "")
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleStartCheckout = async () => {
    if (!cart.length) return;

    const items = cart.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      ...(item.designId ? { designId: item.designId } : {}),
    }));

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = (await response.json()) as { url?: string };

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert(
        "Checkout is not ready yet. Please make sure Stripe is configured on the server."
      );
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5] text-[#444444]">
      {addedMessage && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-30 flex justify-center">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-[#4b5563]/90 px-4 py-2 text-xs font-medium text-white shadow-lg">
            <span>{addedMessage}</span>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-20 border-b border-[#e1dcd5] bg-[#f7f4f1]/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 w-full max-w-[1536px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-[#464044]">
              ArtDoU
            </span>
            <span className="text-xs font-medium text-[#8e8586]">
              California Studio Shop
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "zh" : "en")}
              className="rounded-full border border-[#d8d0c7] bg-[#f4efea] px-3 py-1.5 text-xs font-medium text-[#5a5450] transition hover:bg-[#f9f5f0]"
            >
              {lang === "en" ? "中文" : "EN"}
            </button>
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#4c4648] hover:bg-[#f4efea] hover:text-[#2d2a28]"
            >
              {lang === "zh" ? "关于我们" : "About"}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#4c4648] hover:bg-[#f4efea] hover:text-[#2d2a28]"
            >
              {lang === "zh" ? "联系我们" : "Contact"}
            </Link>
            <Link
              href="/custom"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#4c4648] hover:bg-[#f4efea] hover:text-[#2d2a28]"
            >
              {lang === "zh" ? "AI 区" : "Custom"}
            </Link>
            <button
              type="button"
              onClick={() => setIsCartOpen((open) => !open)}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#d8d0c7] bg-[#f4efea] px-4 py-1.5 text-sm font-medium shadow-sm transition hover:border-[#c9c0b5] hover:bg-[#f9f5f0]"
            >
              <span>{t("cart")}</span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#5c6473] px-2 text-xs font-semibold text-white">
                {cartCount}
              </span>
            </button>
          </nav>

          {/* 购物车下拉面板（紧贴按钮下方） */}
          {isCartOpen && (
            <div className="absolute right-0 top-[72px] z-40 w-full max-w-sm rounded-3xl border border-[#e1dcd5] bg-[#f8f5f1] shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#e1dcd5] px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#4c4648]">
                    {t("cartCount", { count: cartCount })}
                  </h2>
                  <p className="text-xs text-[#9a918d]">
                    {t("reviewItems")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full p-1 text-[#a39a91] hover:bg-[#e8e1d9] hover:text-[#5a5450]"
                >
                  ✕
                </button>
              </div>

              <div className="max-h-80 space-y-4 overflow-y-auto px-5 py-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-[#998f88]">
                    {t("cartEmpty")}
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.designId ?? ""}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#e1dcd5] bg-[#f4efea] px-3 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#4c4648]">
                          {item.product.name}
                          {item.designId && (
                            <span className="ml-1 text-xs text-[#8a9ba8]">
                              {lang === "zh" ? "· 自定义" : "· custom"}
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-[#9a918d]">
                          ${item.product.price} × {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              -1,
                              item.designId
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d3cbc2] text-sm text-[#5a5450] hover:bg-[#efe7de]"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              1,
                              item.designId
                            )
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#8a9ba8] bg-[#8a9ba8] text-sm text-white hover:bg-[#7c8c99]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[#e1dcd5] px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#847d78]">{t("subtotal")}</span>
                  <span className="text-base font-semibold text-[#4c4648]">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!cart.length}
                  onClick={handleStartCheckout}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-[#8a9ba8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7c8c99] disabled:cursor-not-allowed disabled:bg-[#c5c0bb]"
                >
                  {t("checkout")}
                </button>
                <p className="mt-2 text-[11px] leading-relaxed text-[#a7a09b]">
                  In the first version we will send you to a Stripe payment page
                  for credit and debit cards in the US. Orders will be stored in
                  the backend for easy management.
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1536px] px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center rounded-full bg-[#8a9ba8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              ArtDoU · Apparel
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
              Art, made for you
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#847d78] sm:text-base">
              Thoughtfully designed pieces that carry the spirit of ArtDoU into everyday life in California.
              Starting with tees and hoodies, and soon expanding into more art-inspired collections.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="inline-flex items-center justify-center rounded-full bg-[#8a9ba8] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
              >
                {t("browseCollection")}
              </a>
              <span className="text-xs text-[#9a918d]">
                {lang === "zh" ? "右上角可随时查看购物车并结算。" : "Cart is in the top right for quick checkout."}
              </span>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#d5d7dd] via-[#c2c7d0] to-[#b0b7c4] shadow-xl">
            <img
              src="/hero.jpg"
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          </div>
        </section>

        <section
          id="collection"
          className="mt-16 border-t border-[#e1dcd5] pt-10 sm:mt-20 sm:pt-12"
        >
          <div className="grid gap-12 lg:grid-cols-2">
            {/* 当季精选：4 个商品，每行 2 个 */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#4a4446] sm:text-xl">
                {t("seasonalSelection")}
              </h2>
              <p className="mt-1 text-sm text-[#998f88]">
                {lang === "zh" ? "几款当季单品，后续可按系列扩展。" : "A few core pieces to experience the ordering flow."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
                {products.slice(0, SEASONAL_COUNT).map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#e3ddd6] bg-[#f8f5f1] text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d4ccc3] hover:shadow-md"
                  >
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#e7e2dd] to-[#d7d4d0]">
                      <div className="absolute inset-0 flex items-center justify-center px-3 py-4 text-center text-sm font-medium text-[#847d78]">
                        {product.name}
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="relative h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      {product.tag ? (
                        <span className="absolute left-3 top-3 rounded-full bg-[#8a9ba8] px-3 py-1 text-xs font-medium text-white">
                          {product.tag}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 px-4 py-4">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="text-sm font-semibold text-[#4c4648]">
                          {product.name}
                        </h3>
                        <p className="text-sm font-medium text-[#4c4648]">
                          ${product.price}
                        </p>
                      </div>
                      <p className="line-clamp-2 text-xs text-[#998f88]">
                        {product.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#a7a09b] underline-offset-4 hover:underline"
                        >
                          {t("viewDetails")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center justify-center rounded-full bg-[#8a9ba8] px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
                        >
                          {t("addToCart")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 区：4 张图，每行 2 个 */}
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#4a4446] sm:text-xl">
                {lang === "zh" ? "AI 区" : "Custom Design"}
              </h2>
              <p className="mt-1 text-sm text-[#998f88]">
                {lang === "zh" ? "上传图案，预览印在 T 恤/布袋上的效果，保存后可加购。" : "Upload your art, preview on tees & bags, then add to cart."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6">
                {Array.from({ length: AI_ZONE_COUNT }, (_, i) => {
                  const template = designTemplates[i];
                  if (template) {
                    return (
                      <Link
                        key={template.id}
                        href={`/custom?template=${template.id}`}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-[#e3ddd6] bg-[#f8f5f1] text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d4ccc3] hover:shadow-md"
                      >
                        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-[#e7e2dd] to-[#d7d4d0]">
                          <div className="absolute inset-0 flex items-center justify-center px-3 py-4 text-center text-sm font-medium text-[#847d78]">
                            {template.name}
                          </div>
                          <img
                            src={template.templateImage}
                            alt={template.name}
                            className="relative h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#5c6473] px-3 py-1 text-xs font-medium text-white">
                            {lang === "zh" ? "自定义" : "Custom"}
                          </span>
                        </div>
                        <div className="flex flex-1 flex-col gap-1 px-4 py-4">
                          <h3 className="text-sm font-semibold text-[#4c4648]">
                            {template.name}
                          </h3>
                          <span className="text-xs text-[#8a9ba8]">
                            {lang === "zh" ? "上传图案 → 预览 → 加购" : "Upload → Preview → Add to cart"}
                          </span>
                        </div>
                      </Link>
                    );
                  }
                  return (
                    <Link
                      key={`ai-placeholder-${i}`}
                      href="/custom"
                      className="group flex flex-col overflow-hidden rounded-2xl border border-dashed border-[#d4ccc3] bg-[#f8f5f1] text-left transition hover:border-[#8a9ba8] hover:bg-[#f4efea]"
                    >
                      <div className="relative flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-[#e7e2dd] to-[#d7d4d0]">
                        <span className="text-sm font-medium text-[#8a9ba8]">
                          {lang === "zh" ? "更多敬请期待" : "More coming"}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 px-4 py-4">
                        <h3 className="text-sm font-semibold text-[#4c4648]">
                          {lang === "zh" ? "更多款式" : "More styles"}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-20 border-t border-[#e1dcd5] py-10">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <Link
              href="/about"
              className="font-medium text-[#4c4648] hover:text-[#8a9ba8]"
            >
              {lang === "zh" ? "关于我们" : "About Us"}
            </Link>
            <span className="text-[#d8d0c7]">|</span>
            <Link
              href="/contact"
              className="font-medium text-[#4c4648] hover:text-[#8a9ba8]"
            >
              {lang === "zh" ? "联系我们" : "Contact"}
            </Link>
            <span className="text-[#d8d0c7]">|</span>
            <a
              href="/"
              className="font-medium text-[#4c4648] hover:text-[#8a9ba8]"
            >
              {lang === "zh" ? "商城首页" : "Shop"}
            </a>
          </div>
          <p className="mt-4 text-center text-xs text-[#a7a09b]">
            ArtDoU · California Studio Shop
          </p>
        </footer>
      </main>

      {/* 商品详情抽屉 */}
      {selectedProduct && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/20 sm:items-center">
          <div className="w-full max-w-md rounded-t-3xl bg-[#f8f5f1] p-6 shadow-2xl sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-[#4c4648]">
                  {selectedProduct.name}
                </h3>
                <p className="mt-1 text-sm text-[#998f88]">
                  {selectedProduct.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="rounded-full p-1 text-[#a39a91] hover:bg-[#e8e1d9] hover:text-[#5a5450]"
              >
                ✕
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <p className="text-lg font-semibold text-[#4c4648]">
                ${selectedProduct.price}
              </p>
              <button
                type="button"
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="inline-flex items-center justify-center rounded-full bg-[#8a9ba8] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
