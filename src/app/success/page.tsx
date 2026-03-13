"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const saved = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId || saved.current) return;
    saved.current = true;
    fetch("/api/order/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    }).catch(() => {});
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2ef] px-4">
      <div className="max-w-md rounded-3xl bg-white px-6 py-8 text-center shadow-md">
        <h1 className="text-xl font-semibold text-[#4c4648]">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-sm text-[#847d78]">
          Your payment was successful. We&apos;ll start preparing your ArtDoU
          pieces and send you a confirmation email soon.
        </p>
        <p className="mt-1 text-xs text-[#a7a09b]">
          感谢你的订单，我们会尽快处理并与您确认发货信息。
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#8a9ba8] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#7c8c99]"
        >
          Back to shop / 返回商城
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f2ef]" />}>
      <SuccessContent />
    </Suspense>
  );
}

