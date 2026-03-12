# 用 Vercel 部署 ArtDoU 商城（art.kunlunfo.com）

按下面步骤即可把商城部署到 Vercel，并绑定二级域名 `art.kunlunfo.com`。

---

## 1. 代码推到 GitHub

在本地项目目录执行（若已推过可跳过）：

```bash
cd C:\Users\Administrator\artdou-shop
git init
git add .
git commit -m "ArtDoU shop initial"
```

在 [GitHub](https://github.com/new) 新建一个仓库（如 `artdou-shop`），不要勾选 “Add a README”。然后：

```bash
git remote add origin https://github.com/你的用户名/artdou-shop.git
git branch -M main
git push -u origin main
```

---

## 2. 在 Vercel 导入项目

1. 打开 [vercel.com](https://vercel.com)，用 GitHub 登录。
2. 点 **Add New… → Project**。
3. 在列表里选 **artdou-shop**（或你起的仓库名），点 **Import**。
4. **Framework Preset** 保持 **Next.js**，**Root Directory** 不动。
5. 在 **Environment Variables** 里添加一条：
   - **Name**: `STRIPE_SECRET_KEY`
   - **Value**: 你的 Stripe 密钥（测试用 `sk_test_...`，正式用 `sk_live_...`）
6. 点 **Deploy**，等构建完成。

完成后会得到一个地址，例如 `artdou-shop-xxx.vercel.app`，先确认能打开、能加购和跳转 Stripe 支付。

---

## 3. 绑定域名 art.kunlunfo.com

1. 在 Vercel 里打开该项目，进入 **Settings → Domains**。
2. 在输入框填 **art.kunlunfo.com**，点 **Add**。
3. 按页面提示做 DNS 配置（下面以常见方式为例）。

**在你购买域名的服务商（如 Cloudflare、阿里云、GoDaddy）为 `kunlunfo.com` 添加一条解析：**

- **类型**：CNAME  
- **主机/名称**：`art`（或 `art.kunlunfo.com`，视服务商而定）  
- **目标/记录值**：Vercel 给出的 CNAME（例如 `cname.vercel-dns.com`）

若 Vercel 提示用 **A 记录**，就按它给的 IP 填 A 记录。

4. 保存 DNS 后等待几分钟到几十分钟生效。Vercel 会自动申请 SSL，生效后可用 **https://art.kunlunfo.com** 访问商城。

---

## 4. 订单查看说明

- Vercel 运行环境为只读，**无法在服务器上写本地文件**，所以订单不会写入 `data/orders.json`。
- 所有支付记录可在 **Stripe Dashboard → 支付 / Payments** 查看，包含金额、客户邮箱、商品等。
- 若以后需要在自己的后台“订单列表”里存单，可再接入数据库（如 Vercel Postgres、Supabase）并改 `/api/order/save` 写入数据库。

---

## 5. 之后更新网站

改完代码后执行：

```bash
git add .
git commit -m "更新说明"
git push
```

Vercel 会自动重新部署；若绑定了 `art.kunlunfo.com`，更新后也会自动生效。
