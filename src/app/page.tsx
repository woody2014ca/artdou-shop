"use client";

import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  tag?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  {
    id: "tee-classic",
    name: "ArtDoU Classic Tee",
    price: 38,
    description: "柔软舒适的中性版 T 恤，适合日常穿着与艺术展览。",
    image: "/products/tee-classic.jpg",
    tag: "热卖",
  },
  {
    id: "tee-black",
    name: "Black Studio Tee",
    price: 42,
    description: "黑色极简风 T 恤，突出图案与版型细节。",
    image: "/products/tee-black.jpg",
    tag: "新品",
  },
  {
    id: "hoodie-light",
    name: "Lightweight Hoodie",
    price: 68,
    description: "加州早晚温差适用的轻薄帽衫，内外皆可叠穿。",
    image: "/products/hoodie-light.jpg",
  },
];

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0),
    [cart]
  );

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) {
        return [...prev, { product, quantity: 1 }];
      }
      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
    setIsCartOpen(true);
    setAddedMessage(`${product.name} added to cart.`);
    setTimeout(() => {
      setAddedMessage(null);
    }, 1800);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
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
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight text-[#464044]">
              ArtDoU
            </span>
            <span className="text-xs font-medium text-[#8e8586]">
              California Studio Shop
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setIsCartOpen((open) => !open)}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#d8d0c7] bg-[#f4efea] px-4 py-1.5 text-sm font-medium shadow-sm transition hover:border-[#c9c0b5] hover:bg-[#f9f5f0]"
            >
              <span>Cart / 购物车</span>
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
                    Cart / 购物车 ({cartCount})
                  </h2>
                  <p className="text-xs text-[#9a918d]">
                    Review your items here and complete checkout.
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
                    Your cart is empty. Start by adding a piece you love.
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[#e1dcd5] bg-[#f4efea] px-3 py-3"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#4c4648]">
                          {item.product.name}
                        </span>
                        <span className="text-xs text-[#9a918d]">
                          ${item.product.price} × {item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.product.id, -1)
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
                            handleUpdateQuantity(item.product.id, 1)
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
                  <span className="text-[#847d78]">Subtotal / 小计</span>
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
                  Proceed to checkout / 前往结算
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

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
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
                Browse collection
              </a>
              <span className="text-xs text-[#9a918d]">
                Cart is always in the top right for quick review and checkout.
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#d5d7dd] via-[#c2c7d0] to-[#b0b7c4] shadow-xl" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
          </div>
        </section>

        <section
          id="collection"
          className="mt-16 border-t border-[#e1dcd5] pt-10 sm:mt-20 sm:pt-12"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-[#4a4446] sm:text-xl">
                Seasonal selection
              </h2>
              <p className="mt-1 text-sm text-[#998f88]">
                A few core pieces to experience the ordering flow. We can keep expanding by series later.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e3ddd6] bg-[#f8f5f1] text-left shadow-sm transition hover:-translate-y-1 hover:border-[#d4ccc3] hover:shadow-md"
              >
                <div className="relative">
                  <div className="aspect-[4/5] w-full bg-gradient-to-br from-[#e7e2dd] to-[#d7d4d0]" />
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
                      View details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="inline-flex items-center justify-center rounded-full bg-[#8a9ba8] px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
                    >
                      Add to cart / 加入购物车
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
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
                Add to cart / 加入购物车
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
