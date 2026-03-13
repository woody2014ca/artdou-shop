"use client";

import Link from "next/link";
import { ShopHeader } from "@/components/ShopHeader";
import { useLang } from "@/contexts/LangContext";

const SUPPORT_EMAIL = "shop@kunlunfo.com";

export default function ContactPage() {
  const { t, lang } = useLang();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f2ef] to-[#f0f4f5]">
      <ShopHeader />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-[#4c4648]">
          {lang === "zh" ? "联系我们" : "Contact"}
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#847d78]">
          {lang === "zh" ? (
            <>
              <p>
                订单、发货或商品相关问题，请发邮件至：
              </p>
              <p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-[#5c6473] underline hover:text-[#8a9ba8]"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p>
                支付成功后，我们会通过 Stripe 向您填写的邮箱发送收据；如需订单确认或物流更新，我们也会通过邮件与您联系。
              </p>
            </>
          ) : (
            <>
              <p>
                For order, shipping, or product questions, please email:
              </p>
              <p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-medium text-[#5c6473] underline hover:text-[#8a9ba8]"
                >
                  {SUPPORT_EMAIL}
                </a>
              </p>
              <p>
                After payment, Stripe will send a receipt to your email. We will also contact you by email for order confirmation and shipping updates.
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
            href="/about"
            className="rounded-full border border-[#d8d0c7] bg-[#f4efea] px-5 py-2.5 text-sm font-medium text-[#4c4648] transition hover:bg-[#f9f5f0]"
          >
            {lang === "zh" ? "关于我们" : "About"}
          </Link>
        </div>
      </main>
    </div>
  );
}
