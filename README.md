# 🚀 LiuBei 的技术博客

[![Hexo](https://img.shields.io/badge/Hexo-8.0.0-blue)](https://hexo.io/)
[![Theme](https://img.shields.io/badge/Theme-Solitude-purple)](https://github.com/everfu/hexo-theme-solitude)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-green)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

> 记录技术，分享经验，持续学习

## 📝 简介

这是我的个人技术博客，使用 Hexo 搭建，采用 Solitude 主题。主要分享 Web 开发、云计算和开源技术相关内容。

- 🌐 **在线访问**: [https://example.com](https://example.com)
- 📅 **创建时间**: 2025年11月11日
- 🎨 **主题**: Solitude v3.0.21
- 💬 **评论系统**: Twikoo (Netlify + MongoDB)

## ✨ 特性

- ✅ 响应式设计，完美支持移动端
- ✅ 深色模式支持
- ✅ 本地搜索功能
- ✅ RSS 订阅 (Atom + RSS2)
- ✅ 网站地图自动生成
- ✅ 代码高亮 (Mac 终端风格)
- ✅ 图片灯箱效果
- ✅ 文章分享功能
- ✅ 阅读进度显示
- ✅ Twikoo 评论系统
- ✅ SEO 优化

## 🛠️ 技术栈

### 核心
- **静态生成器**: [Hexo 8.0.0](https://hexo.io/)
- **主题**: [Solitude v3.0.21](https://github.com/everfu/hexo-theme-solitude)
- **Node.js**: v18+

### 插件
- `hexo-generator-search` - 本地搜索
- `hexo-generator-feed` - RSS 订阅
- `hexo-generator-sitemap` - 网站地图
- `hexo-wordcount` - 字数统计

### 基础设施
- **托管**: Cloudflare Pages
- **评论**: Twikoo (Netlify + MongoDB Atlas)
- **版本控制**: GitHub
- **CDN**: Cloudflare

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- Git

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate

# 启动本地服务器
hexo server
```

访问 `http://localhost:4000` 查看博客。

### 新建文章

```bash
hexo new "文章标题"
```

### 新建页面

```bash
hexo new page "页面名称"
```

## 📁 项目结构

```
blog/
├── _config.yml                 # Hexo 配置文件
├── _config.solitude.yml        # 主题配置文件
├── package.json                # 依赖管理
├── source/                     # 源文件目录
│   ├── _data/                  # 数据文件
│   │   └── links.yml          # 友情链接数据
│   ├── _posts/                # 文章目录
│   ├── about/                 # 关于页面
│   ├── copyright/             # 版权页面
│   ├── links/                 # 友链页面
│   └── robots.txt             # 爬虫规则
├── themes/                     # 主题目录
└── public/                     # 生成的静态文件 (git ignored)
```

## 📝 内容管理

### 文章 Front Matter

```yaml
---
title: 文章标题
date: 2025-11-16 12:00:00
categories:
  - 分类
tags:
  - 标签1
  - 标签2
description: 文章描述
cover: 封面图片URL (可选)
---
```

### 友情链接

编辑 `source/_data/links.yml` 添加友链：

```yaml
- class_name: 分类名称
  descr: 分类描述
  link_list:
    - name: 网站名称
      link: https://example.com
      avatar: 头像URL
      descr: 网站描述
```

## 🌐 部署

### Cloudflare Pages (推荐)

1. 将代码推送到 GitHub
2. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 连接 GitHub 仓库
4. 配置构建设置：
   - **框架预设**: Hexo
   - **构建命令**: `hexo generate`
   - **构建输出目录**: `public`
5. 点击部署

详细教程：[Hexo 博客部署到 Cloudflare Pages 完整教程](./source/_posts/Hexo博客部署到Cloudflare完整教程.md)

### 其他平台

- **Netlify**: 支持，配置类似
- **Vercel**: 支持，配置类似
- **GitHub Pages**: 支持

## 📊 SEO 优化

- ✅ 自动生成 sitemap.xml
- ✅ RSS 订阅源 (atom.xml, rss2.xml)
- ✅ robots.txt 配置
- ✅ OpenGraph 协议支持
- ✅ 完善的 meta 标签

提交网站地图到搜索引擎：
- Google Search Console
- Bing Webmaster Tools
- 百度站长平台

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 版权声明

- 博客内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans) 许可协议
- 代码部分采用 MIT 许可协议
- 详见：[版权声明](./source/copyright/index.md)

## 🙏 致谢

- [Hexo](https://hexo.io/) - 博客框架
- [Solitude Theme](https://github.com/everfu/hexo-theme-solitude) - 主题
- [Twikoo](https://twikoo.js.org/) - 评论系统
- [Cloudflare](https://www.cloudflare.com/) - 托管服务
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - 数据库
- [Netlify](https://www.netlify.com/) - 云函数

## 📧 联系方式

- **邮箱**: liubei@example.com
- **博客**: [https://example.com](https://example.com)
- **GitHub**: [@LiuBei](https://github.com)

---

⭐ 如果这个项目对你有帮助，欢迎 Star！

📝 Created with ❤️ by LiuBei
