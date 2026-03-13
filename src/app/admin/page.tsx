import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">后台首页</h1>
      <p className="mt-1 text-sm text-[#847d78]">
        请从上方导航进入：商品管理、主图设置、订单管理。
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="rounded-2xl border border-[#e1dcd5] bg-white p-6 shadow-sm transition hover:border-[#d4ccc3] hover:shadow-md"
        >
          <span className="text-2xl">📦</span>
          <h2 className="mt-2 font-medium text-[#4c4648]">商品管理</h2>
          <p className="mt-1 text-xs text-[#847d78]">
            新增、编辑、删除商品，上传商品图
          </p>
        </Link>
        <Link
          href="/admin/hero"
          className="rounded-2xl border border-[#e1dcd5] bg-white p-6 shadow-sm transition hover:border-[#d4ccc3] hover:shadow-md"
        >
          <span className="text-2xl">🖼️</span>
          <h2 className="mt-2 font-medium text-[#4c4648]">主图设置</h2>
          <p className="mt-1 text-xs text-[#847d78]">
            设置首页右上角主图（Hero）
          </p>
        </Link>
        <Link
          href="/admin/designs"
          className="rounded-2xl border border-[#e1dcd5] bg-white p-6 shadow-sm transition hover:border-[#d4ccc3] hover:shadow-md"
        >
          <span className="text-2xl">🎨</span>
          <h2 className="mt-2 font-medium text-[#4c4648]">设计记录</h2>
          <p className="mt-1 text-xs text-[#847d78]">
            客户生成过的所有设计图（无论是否下单）
          </p>
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-2xl border border-[#e1dcd5] bg-white p-6 shadow-sm transition hover:border-[#d4ccc3] hover:shadow-md"
        >
          <span className="text-2xl">📋</span>
          <h2 className="mt-2 font-medium text-[#4c4648]">订单管理</h2>
          <p className="mt-1 text-xs text-[#847d78]">
            查看所有订单
          </p>
        </Link>
      </div>
    </div>
  );
}
