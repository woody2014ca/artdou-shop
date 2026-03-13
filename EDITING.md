# 如何编辑商品和图片

## 1. 右上角那个大框是什么？

那是**首页主图区**（Hero 区域）：目前是一块灰色渐变占位，没有放图片。  
若需要主图，可在项目里放一张图（例如 `public/hero.jpg`），然后让首页引用它（需改代码）。需要的话可以让我帮你加上。

---

## 2. 下面三个商品：在哪里改信息、上传图片、改价格？

### 编辑文字和价格

- **文件位置**：`src/data/products.json`
- 用任意编辑器打开，直接改：
  - `name`：商品名称  
  - `price`：价格（数字，单位美元）  
  - `description`：描述  
  - `tag`：可选，如 `"热卖"`、`"新品"`  
  - `image`：图片路径（见下方）

示例：

```json
{
  "id": "tee-classic",
  "name": "ArtDoU Classic Tee",
  "price": 38,
  "description": "柔软舒适的中性版 T 恤……",
  "image": "/products/tee-classic.jpg",
  "tag": "热卖"
}
```

改完后保存，重新运行或刷新页面即可看到效果。

### 上传商品图片

- **存放目录**：`public/products/`
- 把图片文件放进该目录，例如：
  - `public/products/tee-classic.jpg`
  - `public/products/tee-black.jpg`
  - `public/products/hoodie-light.jpg`
- 在 `src/data/products.json` 里，每个商品的 `image` 填对应路径即可，例如：`"/products/tee-classic.jpg"`

**注意**：若没有放图片或路径写错，页面上会显示灰色占位块（当前就是这样）。

### 增加/删除商品

- 在 `src/data/products.json` 里按同样格式增加或删除一条商品对象即可。  
- 每项必须包含：`id`、`name`、`price`、`description`、`image`；`tag` 可省略。

---

## 3. 管理员（订单后台）的“用户名和密码”

- 本项目**没有**传统的“管理员账号/密码”登录。
- 只有**订单查看页**有简单保护：
  - 地址：**https://art.kunlunfo.com/admin/orders**
  - 若在服务器或 Vercel 里配置了环境变量 **`ADMIN_SECRET`**（例如设成一段随机字符串），打开该页时会要求输入**同一个字符串**作为“密码”，输入正确才能看到订单列表。
  - 若**没有**配置 `ADMIN_SECRET`，则任何人打开 `/admin/orders` 都能看到订单（适合自用或内网）。

**如何设置“密码”：**

- 本地：在项目根目录 `.env.local` 里加一行：`ADMIN_SECRET=你想要的密码`
- Vercel：在项目 Settings → Environment Variables 里添加 `ADMIN_SECRET`，值为你设定的密码。

总结：没有“用户名”，只有你自定义的 `ADMIN_SECRET` 作为查看订单的密码；不设则订单页不设防。
