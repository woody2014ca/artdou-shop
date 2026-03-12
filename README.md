This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 部署到 art.kunlunfo.com（二级域名）

### 方式一：Vercel（推荐）

1. 把本项目推到 GitHub，在 [Vercel](https://vercel.com) 里 Import 该仓库。
2. 在 Vercel 项目 **Settings → Environment Variables** 添加：
   - `STRIPE_SECRET_KEY` = 你的 Stripe 密钥（正式环境用 `sk_live_...`）。
3. 部署完成后，在 **Settings → Domains** 添加域名：`art.kunlunfo.com`。
4. 到你的域名服务商（如 Cloudflare、阿里云）为 `kunlunfo.com` 添加解析：
   - 类型 **CNAME**，主机记录 `art`，记录值填 Vercel 给出的（如 `cname.vercel-dns.com`）；或按 Vercel 提示填 A 记录。
5. 等 DNS 生效后，用 https://art.kunlunfo.com 访问商城。

**说明**：Vercel 为无状态部署，订单存库目前用的是本地 `data/orders.json`，在 Vercel 上每次部署/冷启动后不会持久化。若要正式存单，后续可改为数据库（如 Vercel Postgres、Supabase）或 Stripe 后台查单。

### 方式二：自己的服务器（Node）

1. 在服务器上克隆项目，安装依赖：`npm ci`
2. 在项目根目录创建 `.env.local`，写入 `STRIPE_SECRET_KEY=sk_live_...`
3. 构建并启动：
   ```bash
   npm run build
   npm run start
   ```
4. 用 Nginx 做反向代理，将 `art.kunlunfo.com` 指向本机 3000 端口；并配置 SSL（如 Let’s Encrypt）。
5. 订单会写入服务器上的 `data/orders.json`，需定期备份或后续改为数据库。
