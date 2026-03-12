import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2ef] px-4">
      <div className="max-w-md rounded-3xl bg-white px-6 py-8 text-center shadow-md">
        <h1 className="text-xl font-semibold text-[#4c4648]">
          Payment cancelled
        </h1>
        <p className="mt-3 text-sm text-[#847d78]">
          You have cancelled the payment. Your cart is still available in case
          you want to complete the order later.
        </p>
        <p className="mt-1 text-xs text-[#a7a09b]">
          你刚刚取消了支付，如需再次下单，可以回到商城重新结算。
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

