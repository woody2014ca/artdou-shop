"use client";

import Link from "next/link";
import { ShopHeader } from "@/components/ShopHeader";
import { useLang } from "@/contexts/LangContext";

export default function AboutPage() {
  const { t, lang } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5]">
      <ShopHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-[#4c4648]">
          {lang === "zh" ? "关于 ArtDoU" : "About ArtDoU"}
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#847d78]">
          {lang === "zh" ? (
            <>
              <p>
                ArtDoU 是来自加州的艺术与生活品牌，将创作与日常穿着结合，从 T 恤、帽衫等基础单品开始，把艺术带入每一天。
              </p>
              <p>
                本商城为 ArtDoU 官方线上店铺，支持信用卡/借记卡支付（Stripe），订单我们会妥善处理并与您确认发货。如有疑问，请通过「联系」页面与我们沟通。
              </p>
            </>
          ) : (
            <>
              <p>
                ArtDoU is a California-based brand where art meets everyday life. We start with tees and hoodies, bringing art into your daily wear.
              </p>
              <p>
                This shop is the official ArtDoU store. We accept card payments via Stripe and will process your order and confirm shipping with you. For any questions, please reach out via the Contact page.
              </p>
            </>
          )}
        </div>
        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="rounded-full bg-[#8a9ba8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7c8c99]"
          >
            {t("backToShop")}
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-[#d8d0c7] bg-[#f4efea] px-5 py-2.5 text-sm font-medium text-[#4c4648] transition hover:bg-[#f9f5f0]"
          >
            {lang === "zh" ? "联系我们" : "Contact"}
          </Link>
        </div>
      </main>
    </div>
  );
}
