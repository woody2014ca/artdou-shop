"use client";

import Link from "next/link";
import { ShopHeader } from "@/components/ShopHeader";
import { useLang } from "@/contexts/LangContext";

export default function CancelPage() {
  const { t } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5]">
      <ShopHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="max-w-md rounded-3xl border border-[#e1dcd5] bg-white px-6 py-8 text-center shadow-md">
          <h1 className="text-xl font-semibold text-[#4c4648]">
            {t("paymentCancelled")}
          </h1>
          <p className="mt-3 text-sm text-[#847d78]">
            {t("cancelMessage")}
          </p>
          <p className="mt-1 text-xs text-[#a7a09b]">
            {t("cancelMessageZh")}
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

