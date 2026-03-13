"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { ShopHeader } from "@/components/ShopHeader";
import { useLang } from "@/contexts/LangContext";

function SuccessContent() {
  const { t } = useLang();
  const searchParams = useSearchParams();
  const saved = useRef(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || saved.current) return;
    saved.current = true;
    fetch("/api/order/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data: { ok?: boolean; order_id?: string }) => {
        if (data.ok && data.order_id) setOrderId(data.order_id);
      })
      .catch(() => {});
  }, [searchParams]);

  const shortId = orderId
    ? orderId.replace(/^cs_/, "").slice(0, 12).toUpperCase()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5]">
      <ShopHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-3xl border border-[#e1dcd5] bg-white px-6 py-8 text-center shadow-md">
          <h1 className="text-xl font-semibold text-[#4c4648]">
            {t("thankYou")}
          </h1>
          <p className="mt-3 text-sm text-[#847d78]">
            {t("paymentSuccess")}
          </p>
          {shortId && (
            <p className="mt-2 text-xs font-medium text-[#5c6473]">
              {t("orderNumber")}{shortId}
            </p>
          )}
          <p className="mt-1 text-xs text-[#a7a09b]">
            {t("orderThanks")}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8a9ba8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
          >
            {t("backToShop")}
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f2ef]" />}>
      <SuccessContent />
    </Suspense>
  );
}

