"use client";

import { useEffect, useState } from "react";

type OrderItem = { name: string; quantity: number; amount: number };
type Order = {
  id: string;
  created: string;
  stripe_session_id: string;
  amount_total: number;
  currency: string;
  customer_email: string | null;
  items: OrderItem[];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then(setOrders)
      .catch(() => setError("无法加载订单"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e1dcd5] bg-white p-8 text-center text-[#847d78]">
        加载中…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[#e1dcd5] bg-white p-6">
        <p className="text-[#c44]">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">订单管理</h1>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e1dcd5] bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#998f88]">
            暂无订单。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#e1dcd5] bg-[#f8f5f1]">
                  <th className="px-4 py-3 font-medium text-[#4c4648]">订单号</th>
                  <th className="px-4 py-3 font-medium text-[#4c4648]">时间</th>
                  <th className="px-4 py-3 font-medium text-[#4c4648]">金额</th>
                  <th className="px-4 py-3 font-medium text-[#4c4648]">邮箱</th>
                  <th className="px-4 py-3 font-medium text-[#4c4648]">商品</th>
                </tr>
              </thead>
              <tbody>
                {[...orders].reverse().map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#e1dcd5] last:border-0"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-[#5c6473]">
                      {order.stripe_session_id.slice(0, 20)}…
                    </td>
                    <td className="px-4 py-3 text-[#847d78]">
                      {new Date(order.created).toLocaleString("zh-CN")}
                    </td>
                    <td className="px-4 py-3 text-[#4c4648]">
                      ${(order.amount_total / 100).toFixed(2)} {order.currency}
                    </td>
                    <td className="px-4 py-3 text-[#847d78]">
                      {order.customer_email ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-[#847d78]">
                      {order.items
                        .map((i) => `${i.name} × ${i.quantity}`)
                        .join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
