"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LangContext";

export function ShopHeader() {
  const { t } = useLang();
  return (
    <header className="border-b border-[#e1dcd5] bg-[#f7f4f1]/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight text-[#464044]">
            ArtDoU
          </span>
          <span className="text-xs font-medium text-[#8e8586]">
            California Studio Shop
          </span>
        </div>
        <Link
          href="/"
          className="rounded-full border border-[#d8d0c7] bg-[#f4efea] px-4 py-1.5 text-sm font-medium text-[#4c4648] shadow-sm transition hover:bg-[#f9f5f0]"
        >
          {t("backToShop")}
        </Link>
      </div>
    </header>
  );
}
