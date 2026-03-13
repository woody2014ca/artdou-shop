"use client";

import { useEffect, useState } from "react";

type DesignRecord = {
  id: string;
  templateId: string;
  originalUrl: string;
  previewUrl: string;
  createdAt: string;
};

export default function AdminDesignsPage() {
  const [list, setList] = useState<DesignRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/designs")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#e1dcd5] bg-white p-8 text-center text-[#847d78]">
        加载中…
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-[#4c4648]">客户设计记录</h1>
      <p className="mt-1 text-sm text-[#847d78]">
        所有客户生成过的预览（无论是否下单），按时间倒序。
      </p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e1dcd5] bg-white shadow-sm">
        {list.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#998f88]">
            暂无设计记录。
          </div>
        ) : (
          <ul className="divide-y divide-[#e1dcd5]">
            {list.map((d) => (
              <li
                key={d.id}
                className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap"
              >
                <div className="flex shrink-0 gap-3">
                  <a
                    href={d.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-20 w-20 overflow-hidden rounded-lg border border-[#e1dcd5] bg-[#f4efea]"
                  >
                    <img
                      src={d.previewUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </a>
                  <a
                    href={d.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-20 w-20 overflow-hidden rounded-lg border border-[#e1dcd5] bg-[#f4efea]"
                  >
                    <img
                      src={d.originalUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </a>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xs text-[#5c6473]">{d.id}</p>
                  <p className="text-sm text-[#847d78]">
                    模板: {d.templateId} ·{" "}
                    {new Date(d.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
