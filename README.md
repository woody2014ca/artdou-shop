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

本地开发默认端口为 **3001**，打开 [http://localhost:3001](http://localhost:3001) 即可访问。

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

## ArtDoU Shop · art.kunlunfo.com

本仓库为 **ArtDoU 官方商城** 前端与 API，面向二级域名 **art.kunlunfo.com** 部署（与 shop.kunlunfo.com 为不同项目）。

### 功能概览

- **前台**：首页商品展示、购物车（localStorage 持久化）、Stripe 支付、关于我们 / 联系我们（页脚 + 头部）
- **后台**：`https://art.kunlunfo.com/admin` 统一入口，登录后可管理：
  - **商品管理**：新增 / 编辑 / 删除商品，上传商品图
  - **主图设置**：上传首页右上角 Hero 主图
  - **订单管理**：查看所有订单
- 后台登录密码 = 环境变量 **`ADMIN_SECRET`**（必设，否则无法登录后台）
- 中英切换、SEO、订单号展示、订单写入 `data/orders.json`

### 部署到 art.kunlunfo.com（二级域名）

#### 方式一：Vercel（推荐）

1. 将本项目推到 GitHub，在 [Vercel](https://vercel.com) 中 Import 该仓库。
2. 在项目 **Settings → Environment Variables** 添加：
   - `STRIPE_SECRET_KEY` = 你的 Stripe 密钥（正式环境用 `sk_live_...`）。
   - **`ADMIN_SECRET`** = 后台登录密码（必设），用于访问 `/admin` 管理商品、主图、订单。
3. 部署完成后，在 **Settings → Domains** 添加域名：**art.kunlunfo.com**。
4. 在域名服务商（如 Cloudflare、阿里云）为 `kunlunfo.com` 添加解析：
   - 类型 **CNAME**，主机记录 **art**，记录值填 Vercel 提供的地址（如 `cname.vercel-dns.com`）；或按 Vercel 提示配置 A 记录。
5. DNS 生效后，使用 https://art.kunlunfo.com 访问商城。

**说明**：Vercel 为无状态部署，订单当前写入本地 `data/orders.json`，在 Vercel 上无法持久化。正式环境建议改为数据库（Vercel Postgres、Supabase）或依赖 Stripe 后台查单。

#### 方式二：自建服务器（Node）

1. 在服务器上克隆项目并安装依赖：`npm ci`。
2. 在项目根目录创建 `.env.local`，例如：
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   ADMIN_SECRET=你的后台密码
   ```
3. 构建并启动：
   ```bash
   npm run build
   npm run start
   ```
4. 使用 Nginx 将 **art.kunlunfo.com** 反向代理到本机 3000 端口，并配置 SSL（如 Let’s Encrypt）。
5. 订单会写入服务器上的 `data/orders.json`，建议定期备份；详见 `data/README.md`。
