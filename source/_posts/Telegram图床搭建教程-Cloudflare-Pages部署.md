---
title: 基于 Cloudflare Pages 搭建免费 Telegram 图床
date: 2025-11-19 14:20:00
categories:
  - 教程
  - 云服务
tags:
  - Cloudflare
  - Telegram
  - 图床
  - Serverless
  - Pages
description: 详细讲解如何使用 Cloudflare Pages + Telegram Bot API 搭建一个完全免费、无限容量的图床服务，支持拖拽上传、批量管理、全球 CDN 加速。
cover: https://img.liubei.org/api/image/5s583d14ess
---

## 📖 前言

图床是博客写作和内容创作的重要基础设施，但传统图床常常存在：

- 💰 收费昂贵：存储和流量成本越来越高
- 📦 容量受限：免费额度捉襟见肘
- 🐌 访问缓慢：国内访问稳定性堪忧
- ⚠️ 数据风险：服务关停、策略变更导致图片失效

本篇文章带你用 **Cloudflare Pages + Telegram Bot API** 搭建一套：

- 🆓 完全免费  
- 📦 几乎无限容量  
- 🌍 全球加速  
- 🔒 安全可控  

的个人图床服务，特别适合 Hexo / 博客 / 文档类项目使用。

<!-- more -->

---

## 💡 方案优势总览

### 🆓 成本与额度

- **Cloudflare Pages**：构建次数和流量对个人博客场景几乎够用  
- **Telegram**：作为图片存储后端，不限容量、不限流量  
- **Cloudflare KV**：用于存储图片元数据，请求额度对个人使用完全足够  

整体下来：**个人使用基本零成本**。

### ✨ 功能亮点

- ✅ 支持 **点击上传 / 拖拽上传 / 粘贴上传**
- ✅ 上传前可 **本地预览**，点击可看大图
- ✅ 生成多种格式链接：**URL / Markdown / HTML / BBCode**
- ✅ 支持 **批量选择、批量复制链接**
- ✅ 内置 **搜索过滤**，按文件名 / 标签快速筛选
- ✅ Web 端删除会 **同步删除 Telegram 频道消息**
- ✅ 图片通过 **代理 API** 访问，不暴露 Bot Token
- ✅ **响应式设计**，手机端体验良好
- ✅ 借助 **Cloudflare CDN** 自动全球加速

### 🎯 适用场景

- 博客文章配图（Markdown 直接插入）
- 社交媒体分享图
- 团队共享素材库
- 项目文档截图存档
- 设计/产品原型图管理

---

## 🚀 部署准备

### 1. 创建 Telegram Bot

1. 在 Telegram 搜索 [@BotFather](https://t.me/BotFather)  
2. 发送 `/newbot` 创建新 Bot  
3. 设置 Bot 名称和用户名  
4. BotFather 会返回一串 `Bot Token`：

```text
示例：8540259082:AAHJ5TSo070bpg1Xnx2XYAqtlntTyc6OocY
```

> ⚠️ 请妥善保管 Token，不要公开到仓库或截图中。

### 2. 创建存储频道（Channel）

1. 新建一个 **私有频道**，建议命名为：`Image Storage` 之类  
2. 将刚刚创建的 Bot 添加为频道管理员  
3. 勾选以下权限：

- ✅ Post Messages（发送消息）
- ✅ Edit Messages（编辑消息）
- ✅ **Delete Messages（删除消息）** ← 同步删除必须

### 3. 获取频道 ID

有两种常见方式：

**方式一：通过 Telegram API**

1. 在频道里随便发一条消息  
2. 浏览器访问（替换 `YOUR_BOT_TOKEN`）：

```text
https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
```

3. 在返回的 JSON 中找到：

```json
"chat": {
  "id": -1002370158691,
  "title": "Your Channel",
  "type": "channel"
}
```

**方式二：使用 @userinfobot**

1. 搜索 [@userinfobot](https://t.me/userinfobot)  
2. 把频道中任意一条消息“转发”给它  
3. 它会回复包含频道 ID 的信息：

```text
示例：-1002370158691
```

---

## 🗂 创建 Cloudflare KV 命名空间

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)  
2. 进入 `Workers & Pages` → `KV`  
3. 点击 `Create a namespace`  
4. 命名为：`IMAGE_DB`  
5. 记录下它的 **Namespace ID**，后面会用到：

```text
示例：856a4b0b473748d9963600c117cabbfd
```

---

## 🏗 部署到 Cloudflare Pages

项目仓库（示例）：  
[https://github.com/CNLiuBei/Cloudflare-telegram-imgge](https://github.com/CNLiuBei/Cloudflare-telegram-imgge)

### 1. Fork 仓库

1. 打开仓库页面  
2. 点击右上角 `Fork`，将项目复制到你自己的 GitHub 账号下

### 2. 连接 Cloudflare Pages

1. 打开 Cloudflare 后台 → `Workers & Pages`  
2. 点击 `Create application` → 选择 `Pages`  
3. `Connect to Git`，选择你刚 Fork 的仓库  
4. 授权后进入构建配置页面

### 3. 配置构建命令

在构建设置中填写：

```text
Framework preset: None
Build command: npm run build
Build output directory: public
Root directory: /
```

保存并部署一次，让 Cloudflare Pages 建立项目。

### 4. 配置环境变量（Environment Variables）

1. 在项目页面进入 `Settings` → `Environment variables`  
2. 在 `Production` 与 `Preview` 中都添加：

```text
TELEGRAM_BOT_TOKEN = 你的 Bot Token
TELEGRAM_CHAT_ID   = 你的频道 ID
```

### 5. 绑定 KV 命名空间

1. `Settings` → `Functions`  
2. 找到 `KV namespace bindings`  
3. 添加一条绑定：

```text
Variable name: IMAGE_DB
KV namespace: 选择你上一步创建的 IMAGE_DB
```

保存后返回。

### 6. 重新部署

1. 打开 `Deployments`  
2. 找到最新一次部署，右侧点 `...`  
3. 选择 `Retry deployment`，等待构建完成  

此时 Cloudflare 会给你一个形如：

```text
https://your-project-name.pages.dev
```

的访问地址，你的图床已经可以使用了。

---

## 🌐 可选：绑定自定义域名

如果你有自己的域名，如 `img.liubei.org`，推荐进行绑定。

1. 在 Pages 项目中打开 `Custom domains`  
2. 点击 `Set up a custom domain`  
3. 填入你的域名（如 `img.example.com`）  
4. 按照 Cloudflare 提示配置 DNS：

典型配置（CNAME）：

```text
类型: CNAME
名称: img
值: your-project-name.pages.dev
TTL: Auto
```

等待几分钟到几小时，SSL 证书生效后即可通过自定义域名访问。

---

## 📖 使用说明

### 1. 上传图片

支持三种方式：

- **点击上传**：点击上传区域，选择本地文件  
- **拖拽上传**：将图片从文件管理器拖到页面中  
- **粘贴上传**：复制图片到剪贴板，在页面按 `Ctrl+V` / `Cmd+V`

上传前可以预览缩略图，确认无误再点击“确认上传”。

### 2. 获取图片链接

上传成功后，页面会展示多种链接格式：

- **URL**：适合直接访问或配置  
- **Markdown**：适合博客、文档  
- **HTML**：适合网站、说明页  
- **BBCode**：适合论坛、社区

你可以：

- 单张复制  
- 多选后批量复制链接，方便一次性插入多张图

### 3. 搜索与管理

- 在搜索框输入文件名或标签，快速筛选图片  
- 支持多选进行批量操作  
- 分类、时间、关键词都可以配合使用

### 4. 删除图片（含 Telegram 同步删除）

点击删除时，系统会：

1. 删除 KV 中的图片元数据  
2. 请求 Telegram 删除对应频道消息  
3. 移除 Web 界面中的记录  

> ⚠️ 删除是不可逆的操作，慎重！

---

## 🔧 进阶配置（可选）

### 1. 限制最大文件大小

在 `wrangler.toml` 的 `[vars]` 中可以添加：

```toml
[vars]
MAX_FILE_SIZE = "10485760"  # 10MB
```

### 2. 限制允许的图片格式

```toml
[vars]
ALLOWED_TYPES = "image/jpeg,image/png,image/gif,image/webp"
```

### 3. 主要 API 一览

| 端点              | 方法 | 说明         |
|-------------------|------|--------------|
| `/api/upload`     | POST | 上传图片     |
| `/api/images`     | GET  | 获取图片列表 |
| `/api/search`     | GET  | 搜索图片     |
| `/api/delete`     | POST | 删除图片     |
| `/api/image/[id]` | GET  | 代理图片访问 |

---

## 📊 性能与成本

### 性能特点

- 首次访问：从 Telegram 拉取，稍慢但可接受  
- 后续访问：由 Cloudflare CDN 缓存，速度极快  
- 支持 HTTP/2 / HTTP/3，默认 HTTPS 加密

### 成本估算（个人博客）

假设：

- 每月 10,000 次图片访问  
- 平均图片大小 300KB  

在 Cloudflare + Telegram 的免费额度下，**基本为 0 成本**。

---

## ⚠️ 注意事项与最佳实践

### Telegram 限制

- 单文件最大约 **20MB**  
- API 有频率限制（写操作请避免短时间大量请求）

### Cloudflare 免费额度

- Workers 请求：100,000 / 天  
- KV 读取：100,000 / 天  
- KV 写入：1,000 / 天  

对于个人、轻度团队使用非常宽裕。

### 安全建议

- 把频道设置为 **私有**，避免敏感图片被爬取  
- 不要在前端或公开仓库中暴露 Bot Token  
- 对重要素材建议本地+云盘多重备份  
- 删除功能仅用于需要彻底清理的场景

---

## 🧩 常见问题排查

**Q：上传失败 / 提示网络错误？**

- 检查 Bot Token 是否正确  
- 检查频道 ID 是否填写错误  
- 确认 Bot 已被添加为频道管理员  
- Cloudflare 环境变量是否已正确配置

---

**Q：删除后 Telegram 里消息还在？**

- 检查 Bot 是否有 Delete Messages 权限  
- 确认对应消息确实是这个 Bot 发送的  
- 看 Cloudflare 日志里是否有报错

---

**Q：图片 URL 打不开？**

- 确认没有误删 KV 或 Telegram 消息  
- 等待几分钟，确认 CDN 缓存是否更新  
- 检查自定义域名与 SSL 配置是否正常

---

## 📁 项目结构概览

```text
telegram-image-bed/
├── src/
│   ├── index.html       # 前端页面
│   ├── script.js        # 前端逻辑
│   └── build-worker.js  # 构建脚本
├── functions/           # Cloudflare Pages Functions
│   └── api/
│       ├── upload.js    # 图片上传 API
│       ├── delete.js    # 图片删除 API
│       ├── images.js    # 图片列表 API
│       ├── search.js    # 图片搜索 API
│       └── image/[id].js # 图片代理 API
├── wrangler.toml        # Cloudflare 配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

---

## 🌟 技术架构

### 前端

- **HTML5** - 语义化结构
- **CSS3** - 响应式布局
- **JavaScript** - 原生 JS，无第三方框架依赖

### 后端

- **Cloudflare Pages Functions** - 提供上传、删除、查询等 API
- **Telegram Bot API** - 实际图片存储位置
- **Cloudflare KV** - 保存图片元数据（如文件名、TG 消息 ID 等）
- **Cloudflare CDN** - 为图片访问提供全局加速

### 简化工作流程

```text
用户上传图片
    ↓
前端预览确认
    ↓
Pages Functions 接收请求
    ↓
通过 Bot 将图片发到 Telegram 频道
    ↓
将图片信息写入 KV
    ↓
返回可直接访问的图片 URL
    ↓
Cloudflare CDN 缓存并分发
```

---

## 🎯 后续可扩展方向

- 图片压缩与 WebP 自动转换
- 自定义水印（文字/图片）
- 更细粒度的权限控制（如 Token 鉴权）
- 图片分类 / 标签管理
- 导出为图床 API 服务，供其他应用使用

---

## 🤝 贡献与支持

### 如何参与

欢迎你：

- 🐛 提交 Bug 报告  
- 💡 提交新功能建议  
- 📖 帮忙完善文档  
- 🔧 优化代码实现

可以通过 GitHub Issues 的形式参与项目协作。

### 支持项目

如果这个图床项目或本篇教程对你有帮助：

- ⭐ 给仓库点一个 Star  
- 🔁 分享给更多朋友  
- 💬 在 Issue 中留下你的使用体验

---

## 📝 总结

通过本文，你可以快速搭建一套：

- ✅ **完全免费** 的个人图床  
- ✅ **几乎无限容量** 的图片存储  
- ✅ **全球加速** 的访问体验  
- ✅ **易用且安全** 的管理后台  

非常适合个人博客、技术文档、项目说明等长期内容的图片托管需求。

现在就可以把你博客里的本地图片，逐步迁移到这套 Telegram 图床上，让内容更稳定、更持久地在线。

---

## 📧 联系方式

- **项目地址**: https://github.com/CNLiuBei/Cloudflare-telegram-imgge  
- **问题反馈**: https://github.com/CNLiuBei/Cloudflare-telegram-imgge/issues  
- **邮箱**: cn.liubei@qq.com

---

<div align="center">

**如果这篇教程对你有帮助，欢迎点赞和分享！**

Made with ❤️ by LiuBei

</div>
