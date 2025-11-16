---
title: Hexo 博客部署到 Cloudflare Pages 完整教程
date: 2025-11-16 15:50:00
categories:
  - 教程
  - 博客建设
tags:
  - Hexo
  - Cloudflare
  - Pages
  - 静态网站
  - 部署
description: 详细讲解如何将 Hexo 博客部署到 Cloudflare Pages，实现免费托管、全球 CDN 加速、自动部署，打造高性能个人博客。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhex9i7zselk7DIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

Cloudflare Pages 是 Cloudflare 推出的免费静态网站托管服务，非常适合部署 Hexo 博客。相比其他托管平台，Cloudflare Pages 具有以下优势：

- 🆓 **完全免费** - 无限流量、无限带宽
- 🌍 **全球 CDN** - 遍布全球的边缘节点
- ⚡ **超快速度** - 国内访问速度优秀
- 🔄 **自动部署** - Git Push 自动触发构建
- 🔒 **免费 SSL** - 自动配置 HTTPS 证书
- 🌐 **自定义域名** - 支持绑定多个域名
- 📊 **实时分析** - 流量统计和访问分析

本文将详细介绍如何将 Hexo 博客部署到 Cloudflare Pages。

<!-- more -->

---

## 💡 为什么选择 Cloudflare Pages？

### 与其他平台对比

| 特性 | Cloudflare Pages | GitHub Pages | Netlify | Vercel |
|------|------------------|--------------|---------|--------|
| 价格 | ✅ 免费 | ✅ 免费 | ✅ 免费 | ✅ 免费 |
| 国内速度 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 流量限制 | ❌ 无限制 | ✅ 100 GB/月 | ✅ 100 GB/月 | ✅ 100 GB/月 |
| 带宽限制 | ❌ 无限制 | ❌ 有限制 | ❌ 有限制 | ❌ 有限制 |
| 构建次数 | ✅ 500次/月 | ❌ 无限制 | ✅ 300分钟/月 | ✅ 100次/天 |
| 自定义域名 | ✅ 支持 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| HTTPS | ✅ 自动 | ✅ 自动 | ✅ 自动 | ✅ 自动 |
| 部署速度 | ⚡ 快 | ⚡ 快 | ⚡ 快 | ⚡ 快 |

### Cloudflare Pages 优势

✅ **国内访问友好** - 相比 GitHub Pages 快很多  
✅ **无限流量带宽** - 不用担心超额  
✅ **全球 CDN** - 自动优化访问路径  
✅ **简单易用** - 配置简单，一键部署  
✅ **免费 SSL** - 自动配置 HTTPS  
✅ **完善的 DDoS 防护** - Cloudflare 级别防护

---

## 📦 准备工作

### 1. 注册 Cloudflare 账号

访问 [Cloudflare](https://dash.cloudflare.com/sign-up) 注册账号（免费）

### 2. 确保博客已上传 GitHub

Cloudflare Pages 需要从 Git 仓库拉取代码，确保你的 Hexo 博客源码已上传到 GitHub。

**检查仓库：**
```bash
# 查看远程仓库
git remote -v

# 如果没有，参考上一篇教程上传到 GitHub
```

### 3. 本地测试博客

确保博客在本地能正常运行：

```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate

# 本地预览
hexo server
```

访问 http://localhost:4000 确认无误

---

## 🚀 部署到 Cloudflare Pages

### Step 1: 登录 Cloudflare Pages

1. 访问 https://pages.cloudflare.com/
2. 使用 Cloudflare 账号登录
3. 点击 **Create a project**

### Step 2: 连接 GitHub 仓库

1. 选择 **Connect to Git**
2. 点击 **Connect GitHub**
3. 授权 Cloudflare 访问你的 GitHub 账号
4. 选择要部署的仓库（如 `blog`）
5. 点击 **Begin setup**

### Step 3: 配置构建设置

填写项目配置信息：

**项目名称：**
```
your-blog
```

**生产分支：**
```
main
```

**构建设置：**

| 配置项 | 值 |
|--------|-----|
| Framework preset | `None` 或 `Hexo` |
| Build command | `hexo generate` 或 `npm run build` |
| Build output directory | `public` |

**环境变量（可选）：**

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_VERSION` | `18` | Node.js 版本 |
| `NPM_VERSION` | `9` | npm 版本 |

### Step 4: 开始部署

1. 点击 **Save and Deploy**
2. 等待构建完成（通常 1-3 分钟）
3. 部署成功后会显示访问地址

**默认域名：**
```
https://your-blog.pages.dev
```

---

## 🎨 详细配置说明

### 构建命令详解

#### 方法 1: 使用 Hexo CLI（推荐）

**Build command:**
```bash
hexo generate
```

**优点：** 简单直接

**前提：** `package.json` 中已安装 `hexo-cli`

#### 方法 2: 使用 npm scripts

**Build command:**
```bash
npm run build
```

**package.json 配置：**
```json
{
  "scripts": {
    "build": "hexo clean && hexo generate"
  }
}
```

**优点：** 可以添加额外的构建步骤

#### 方法 3: 自定义脚本

创建 `build.sh`：
```bash
#!/bin/bash
npm install
hexo clean
hexo generate
```

**Build command:**
```bash
chmod +x build.sh && ./build.sh
```

### Node.js 版本配置

**推荐配置：**

在 Cloudflare Pages 设置中添加环境变量：

```
NODE_VERSION = 18
```

或在项目根目录创建 `.nvmrc` 文件：

```
18
```

或在项目根目录创建 `.node-version` 文件：

```
18
```

### 安装依赖优化

**加速 npm 安装：**

在环境变量中添加：

```
NPM_CONFIG_REGISTRY = https://registry.npmmirror.com
```

---

## 🔄 自动部署配置

### 工作原理

```
Git Push → GitHub → Cloudflare Pages → 自动构建 → 部署上线
```

### 配置自动部署

**已默认开启！** 每次 Push 到 GitHub 都会自动触发部署。

**查看部署历史：**
1. 进入 Cloudflare Pages 项目
2. 点击 **Deployments** 标签
3. 查看每次部署的状态和日志

### 部署工作流程

```bash
# 1. 写文章
hexo new post "文章标题"

# 2. 本地预览
hexo s

# 3. 提交到 GitHub
git add .
git commit -m "新增文章：xxx"
git push

# 4. Cloudflare Pages 自动部署
# 等待 1-3 分钟即可访问
```

---

## 🌐 绑定自定义域名

### Step 1: 添加域名

1. 进入 Cloudflare Pages 项目
2. 点击 **Custom domains** 标签
3. 点击 **Set up a custom domain**
4. 输入你的域名（如 `blog.example.com`）
5. 点击 **Continue**

### Step 2: 配置 DNS

**场景 1: 域名已在 Cloudflare**

Cloudflare 会自动添加 DNS 记录，无需手动操作。

**场景 2: 域名在其他服务商**

需要手动添加 DNS 记录：

**CNAME 记录：**
```
类型: CNAME
名称: blog（或 @，如果是根域名）
目标: your-blog.pages.dev
```

**或使用 A 记录（根域名）：**

Cloudflare Pages 没有固定 IP，推荐先将域名转入 Cloudflare，或使用 CNAME 方式。

### Step 3: 等待生效

1. DNS 记录生效需要 5 分钟 - 24 小时
2. 可以使用 `nslookup` 或 `dig` 命令检查：

```bash
nslookup blog.example.com
```

3. 生效后访问自定义域名即可

### Step 4: 强制 HTTPS

1. 进入 Cloudflare Pages 项目
2. 点击 **Settings**
3. 找到 **Always use HTTPS**
4. 开启此选项

---

## 🔧 高级配置

### 1. 配置环境变量

**添加环境变量：**

1. 进入项目 **Settings** > **Environment variables**
2. 点击 **Add variable**
3. 填写变量名和值
4. 选择环境（Production / Preview）
5. 保存

**常用环境变量：**

```bash
# Node.js 版本
NODE_VERSION=18

# npm 镜像
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com

# 时区
TZ=Asia/Shanghai
```

### 2. 配置重定向规则

在项目根目录创建 `public/_redirects` 文件：

```
# 301 永久重定向
/old-post  /new-post  301

# 302 临时重定向
/temp  /permanent  302

# 域名重定向
https://old-domain.com/*  https://new-domain.com/:splat  301
```

### 3. 配置自定义 Headers

在项目根目录创建 `public/_headers` 文件：

```
# 为所有页面添加安全头
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=()

# 为静态资源添加缓存
/css/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/img/*
  Cache-Control: public, max-age=31536000, immutable
```

### 4. 配置 404 页面

Hexo 默认会生成 `404.html`，Cloudflare Pages 会自动使用。

**自定义 404 页面：**

创建 `source/404.md`：

```markdown
---
title: 页面未找到
layout: page
permalink: /404.html
---

# 404 - 页面未找到

抱歉，您访问的页面不存在。

[返回首页](/)
```

### 5. 预览分支部署

Cloudflare Pages 支持分支预览：

1. 创建新分支：
```bash
git checkout -b feature/new-design
```

2. 推送到 GitHub：
```bash
git push origin feature/new-design
```

3. Cloudflare Pages 自动创建预览环境

4. 访问预览地址：
```
https://feature-new-design.your-blog.pages.dev
```

---

## 📊 性能优化

### 1. 启用 Cloudflare 优化

**Auto Minify（自动压缩）：**
1. 进入 Cloudflare 仪表板
2. 选择你的域名
3. **Speed** > **Optimization**
4. 开启 JavaScript、CSS、HTML 压缩

**Brotli 压缩：**
1. **Speed** > **Optimization**
2. 开启 Brotli 压缩

**HTTP/3 (QUIC)：**
1. **Network** > **HTTP/3**
2. 开启 HTTP/3

### 2. 配置缓存规则

**Page Rules：**
1. **Rules** > **Page Rules**
2. 创建规则：
   - URL: `blog.example.com/css/*`
   - Cache Level: Cache Everything
   - Edge Cache TTL: 1 month

### 3. 优化图片

**使用 Cloudflare Images：**
- 自动优化图片大小
- WebP 格式转换
- 响应式图片

**或使用图床：**
- 将图片存储在 CDN
- 减少仓库体积

### 4. 启用缓存预留

在 `_headers` 文件中配置：

```
/
  Cache-Control: public, max-age=300, s-maxage=600
```

---

## 🚨 常见问题

### Q1: 构建失败 - 找不到 hexo 命令

**错误信息：**
```
hexo: command not found
```

**解决方案 1: 安装 hexo-cli**

确保 `package.json` 包含：
```json
{
  "dependencies": {
    "hexo": "^7.0.0"
  },
  "devDependencies": {
    "hexo-cli": "^4.3.0"
  }
}
```

**解决方案 2: 使用 npx**

修改构建命令：
```bash
npx hexo generate
```

### Q2: 构建成功但页面空白

**可能原因 1: 输出目录错误**

确认 Build output directory 为 `public`

**可能原因 2: 静态资源路径错误**

检查 `_config.yml`：
```yaml
# URL
url: https://your-blog.pages.dev
root: /
```

### Q3: 样式丢失

**原因：** 静态资源路径不正确

**解决方案：**

修改 `_config.yml`：
```yaml
# 使用相对路径
url: https://your-domain.com
root: /
```

清理重新生成：
```bash
hexo clean && hexo generate
```

### Q4: 部署很慢

**优化方案：**

1. **使用国内 npm 镜像：**
```bash
# 环境变量
NPM_CONFIG_REGISTRY=https://registry.npmmirror.com
```

2. **缓存 node_modules：**

Cloudflare Pages 会自动缓存依赖

3. **减少依赖：**

移除不必要的插件

### Q5: 自定义域名无法访问

**检查清单：**

1. DNS 记录是否正确
```bash
nslookup your-domain.com
```

2. 是否等待 DNS 生效（最长 24 小时）

3. 是否开启了 HTTPS

4. 清除浏览器缓存

### Q6: 构建超时

**原因：** 构建时间超过 20 分钟

**解决方案：**

1. 优化构建流程
2. 减少文章数量
3. 使用增量构建

---

## 🎯 完整部署流程总结

### 一、准备阶段

```bash
# 1. 确保博客源码在 GitHub
git remote -v

# 2. 本地测试无误
hexo clean && hexo generate && hexo server
```

### 二、Cloudflare Pages 配置

1. 访问 https://pages.cloudflare.com/
2. 连接 GitHub 仓库
3. 配置构建设置：
   - Build command: `hexo generate`
   - Build output directory: `public`
   - 环境变量: `NODE_VERSION=18`
4. 点击部署

### 三、绑定域名（可选）

1. Custom domains > 添加域名
2. 配置 DNS 记录
3. 等待生效
4. 开启 HTTPS

### 四、日常更新

```bash
# 1. 写文章
hexo new post "标题"

# 2. 本地预览
hexo s

# 3. 推送到 GitHub
git add .
git commit -m "新增文章"
git push

# 4. 等待自动部署（1-3分钟）
```

---

## 🔗 相关链接

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Cloudflare Dashboard](https://dash.cloudflare.com/)
- [Cloudflare Pages 示例](https://pages.cloudflare.com/)

---

## 📝 下一步

完成部署后，你可以：

- 🎨 **优化 SEO** - 配置 sitemap、robots.txt
- 📊 **添加统计** - Google Analytics、百度统计
- 💬 **配置评论** - Twikoo、Waline 等
- 🔍 **配置搜索** - Algolia、本地搜索
- 🚀 **性能优化** - 启用 Cloudflare 加速功能
- 🌐 **配置 CDN** - 使用 Cloudflare 全球 CDN

---

## 🎉 总结

通过 Cloudflare Pages 部署 Hexo 博客，你将获得：

✅ **免费托管** - 无限流量和带宽  
✅ **全球加速** - Cloudflare CDN  
✅ **自动部署** - Git Push 即部署  
✅ **HTTPS 安全** - 免费 SSL 证书  
✅ **高可用性** - 99.99% 在线率  
✅ **国内友好** - 访问速度快

### 最终工作流程

```bash
# 本地编辑
hexo new post "文章标题"
hexo s  # 预览

# 提交代码
git add .
git commit -m "新增文章"
git push

# Cloudflare Pages 自动：
# ✅ 拉取代码
# ✅ 安装依赖
# ✅ 执行构建
# ✅ 部署上线
```

**一切都是自动的，你只需专注于写作！** ✍️

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布

---

*让你的博客飞起来！如有问题欢迎在评论区讨论。*
