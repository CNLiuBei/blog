---
title: Hexo 博客上传 GitHub 备份完整教程
date: 2025-11-16 15:45:00
categories:
  - 教程
  - 博客建设
tags:
  - Hexo
  - GitHub
  - Git
  - 版本控制
  - 博客备份
description: 详细讲解如何将 Hexo 博客源文件上传到 GitHub 进行备份，实现多设备同步和版本管理，保障博客数据安全。
cover: https://vip.123pan.cn/1821322860/ymjew503t0m000d7w32xysuirjit8ghaDIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

Hexo 博客的源文件包含了文章、配置、主题等重要内容，如果本地文件丢失，整个博客将无法恢复。将源文件上传到 GitHub 不仅可以备份数据，还能实现：

- 💾 **数据备份** - 防止本地文件丢失
- 🔄 **版本控制** - 记录每次修改历史
- 🖥️ **多设备同步** - 在不同电脑上编辑博客
- 👥 **团队协作** - 多人共同维护博客
- 🔙 **回滚功能** - 随时恢复到历史版本

本文将详细介绍如何将 Hexo 博客源文件上传到 GitHub 进行备份。

<!-- more -->

---

## 💡 核心概念

### Hexo 博客的两个仓库

**1. 源码仓库（本文重点）**
- 存储博客源文件（Markdown 文章、配置、主题）
- 仓库名：任意，如 `blog`
- 访问权限：可以是私有或公开

**2. 部署仓库**
- 存储生成的静态网页（public 文件夹）
- 仓库名：`username.github.io`
- 访问权限：必须公开

### Git vs GitHub

- **Git** - 版本控制系统，本地软件
- **GitHub** - 代码托管平台，在线服务

---

## 📦 准备工作

### 1. 安装 Git

**Windows：**

下载并安装 [Git for Windows](https://git-scm.com/download/win)

**macOS：**

```bash
# 使用 Homebrew 安装
brew install git

# 或者使用 Xcode Command Line Tools
xcode-select --install
```

**Linux：**

```bash
# Ubuntu/Debian
sudo apt install git

# CentOS/RHEL
sudo yum install git

# Arch Linux
sudo pacman -S git
```

### 2. 验证安装

```bash
git --version
```

输出类似：
```
git version 2.39.0
```

### 3. 配置 Git

```bash
# 配置用户名
git config --global user.name "Your Name"

# 配置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

### 4. 注册 GitHub 账号

访问 [GitHub](https://github.com/) 注册账号（如已有账号可跳过）

---

## 🚀 创建 GitHub 仓库

### Step 1: 登录 GitHub

访问 https://github.com/ 并登录

### Step 2: 创建新仓库

1. 点击右上角 `+` > `New repository`
2. 填写仓库信息：
   - **Repository name**: `blog`（仓库名，可自定义）
   - **Description**: `我的 Hexo 博客源码`（可选）
   - **Public/Private**: 选择 `Private`（私有，保护源码）
   - ⚠️ **不要勾选** `Add a README file`
   - ⚠️ **不要选择** `.gitignore` 模板
   - ⚠️ **不要选择** License
3. 点击 `Create repository`

### Step 3: 复制仓库地址

创建完成后，GitHub 会显示仓库地址，复制 HTTPS 地址：

```
https://github.com/username/blog.git
```

---

## 📝 配置 .gitignore

在 Hexo 博客根目录创建或编辑 `.gitignore` 文件，排除不需要上传的文件。

### 创建 .gitignore

**方法 1: 使用文本编辑器**

在博客根目录创建 `.gitignore` 文件，添加以下内容：

```bash
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
.deploy_git*/
.idea
.vscode
*.swp
*.swo
*~
.tmp
.cache
```

**方法 2: 使用命令行**

```bash
# 切换到博客目录
cd /path/to/your/blog

# 创建 .gitignore 文件
cat > .gitignore << 'EOF'
.DS_Store
Thumbs.db
db.json
*.log
node_modules/
public/
.deploy*/
.deploy_git*/
.idea
.vscode
*.swp
*.swo
*~
.tmp
.cache
EOF
```

### .gitignore 说明

| 文件/目录 | 说明 |
|-----------|------|
| `.DS_Store` | macOS 系统文件 |
| `Thumbs.db` | Windows 缩略图缓存 |
| `db.json` | Hexo 数据库文件 |
| `*.log` | 日志文件 |
| `node_modules/` | Node.js 依赖包（体积大） |
| `public/` | 生成的静态文件（不需要备份） |
| `.deploy*/` | 部署临时文件 |
| `.idea`, `.vscode` | IDE 配置文件 |

⚠️ **为什么不上传 node_modules？**

- 体积巨大（100MB+）
- 可以通过 `npm install` 恢复
- 不同系统可能需要重新编译

---

## 🔧 初始化 Git 仓库

### Step 1: 切换到博客目录

```bash
cd /path/to/your/hexo/blog
```

### Step 2: 初始化 Git

```bash
git init
```

输出：
```
Initialized empty Git repository in /path/to/blog/.git/
```

### Step 3: 添加远程仓库

```bash
git remote add origin https://github.com/username/blog.git
```

**说明：**
- `origin` - 远程仓库的默认名称
- 将 `username/blog` 替换为你的仓库地址

### Step 4: 验证远程仓库

```bash
git remote -v
```

输出：
```
origin  https://github.com/username/blog.git (fetch)
origin  https://github.com/username/blog.git (push)
```

---

## 📤 首次上传

### Step 1: 查看文件状态

```bash
git status
```

会显示所有未跟踪的文件（红色）

### Step 2: 添加所有文件

```bash
git add .
```

**说明：**
- `.` 表示添加当前目录所有文件
- `.gitignore` 中的文件会自动排除

### Step 3: 查看添加结果

```bash
git status
```

已添加的文件会显示为绿色

### Step 4: 提交到本地仓库

```bash
git commit -m "初始提交：Hexo 博客源码"
```

**说明：**
- `-m` 后面是提交信息
- 提交信息要简洁明了

### Step 5: 创建主分支

GitHub 默认分支名为 `main`，需要重命名：

```bash
git branch -M main
```

### Step 6: 推送到 GitHub

```bash
git push -u origin main
```

**说明：**
- `-u` 设置上游分支，以后可以直接用 `git push`
- 首次推送会要求输入 GitHub 用户名和密码

⚠️ **GitHub 密码认证已废弃！**

需要使用 Personal Access Token（个人访问令牌）

---

## 🔑 配置 GitHub 访问令牌

### Step 1: 生成 Personal Access Token

1. 登录 GitHub
2. 点击右上角头像 > `Settings`
3. 左侧菜单选择 `Developer settings`
4. 选择 `Personal access tokens` > `Tokens (classic)`
5. 点击 `Generate new token` > `Generate new token (classic)`
6. 填写信息：
   - **Note**: `Hexo Blog`
   - **Expiration**: `No expiration`（永不过期）或自定义
   - **Select scopes**: 勾选 `repo`（完整仓库权限）
7. 点击 `Generate token`
8. **复制 Token**（只显示一次，请妥善保存！）

### Step 2: 使用 Token 推送

```bash
git push -u origin main
```

当提示输入密码时，粘贴 Token（不是 GitHub 密码）

### Step 3: 保存凭证（可选）

**方法 1: 使用凭证存储**

```bash
# Windows
git config --global credential.helper wincred

# macOS
git config --global credential.helper osxkeychain

# Linux
git config --global credential.helper store
```

**方法 2: 修改远程 URL（包含 Token）**

```bash
git remote set-url origin https://username:TOKEN@github.com/username/blog.git
```

⚠️ **安全提示：** 此方法会将 Token 明文存储，不推荐

---

## 🔄 日常更新流程

### 场景 1: 新增文章

```bash
# 1. 写完文章后，查看状态
git status

# 2. 添加新文件
git add .

# 3. 提交
git commit -m "新增文章：Hexo 博客上传 GitHub 教程"

# 4. 推送到 GitHub
git push
```

### 场景 2: 修改配置

```bash
# 1. 修改 _config.yml 后
git status

# 2. 添加修改
git add _config.yml

# 3. 提交
git commit -m "更新站点配置：修改站点标题和描述"

# 4. 推送
git push
```

### 场景 3: 更新主题

```bash
# 1. 更新主题文件后
git add themes/

# 2. 提交
git commit -m "更新 Solitude 主题到 v3.0.21"

# 3. 推送
git push
```

### 场景 4: 批量操作

```bash
# 添加所有修改（包括新增、修改、删除）
git add -A

# 提交
git commit -m "更新多篇文章和主题配置"

# 推送
git push
```

---

## 🖥️ 在新电脑上恢复博客

### Step 1: 克隆仓库

```bash
# 克隆到指定目录
git clone https://github.com/username/blog.git hexo-blog

# 进入目录
cd hexo-blog
```

### Step 2: 安装依赖

```bash
npm install
```

或使用国内镜像：

```bash
npm install --registry=https://registry.npmmirror.com
```

### Step 3: 安装 Hexo CLI

```bash
npm install -g hexo-cli
```

### Step 4: 测试运行

```bash
# 清理缓存
hexo clean

# 生成静态文件
hexo generate

# 启动本地服务器
hexo server
```

访问 http://localhost:4000 查看博客

### Step 5: 后续更新

```bash
# 拉取最新代码
git pull

# 安装新依赖（如果 package.json 更新）
npm install

# 重新生成
hexo clean && hexo generate
```

---

## 📊 常用 Git 命令

### 查看状态

```bash
# 查看文件修改状态
git status

# 查看修改内容
git diff

# 查看提交历史
git log

# 查看简洁历史
git log --oneline
```

### 添加文件

```bash
# 添加所有文件
git add .

# 添加指定文件
git add source/_posts/new-post.md

# 添加所有 .md 文件
git add *.md
```

### 提交更改

```bash
# 提交并添加说明
git commit -m "提交说明"

# 修改上次提交信息
git commit --amend -m "新的提交说明"
```

### 推送拉取

```bash
# 推送到远程
git push

# 从远程拉取
git pull

# 强制推送（谨慎使用）
git push -f
```

### 分支管理

```bash
# 查看分支
git branch

# 创建新分支
git branch feature

# 切换分支
git checkout feature

# 创建并切换分支
git checkout -b feature

# 合并分支
git merge feature

# 删除分支
git branch -d feature
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- file.md

# 撤销暂存区文件
git reset HEAD file.md

# 回退到上一个版本
git reset --hard HEAD^

# 回退到指定版本
git reset --hard commit_id
```

---

## 🚨 常见问题

### Q1: 推送时提示 "fatal: remote origin already exists"

**原因：** 远程仓库已存在

**解决方案：**
```bash
# 删除原有远程仓库
git remote rm origin

# 重新添加
git remote add origin https://github.com/username/blog.git
```

### Q2: 推送时提示 "Permission denied"

**原因：** 权限不足或 Token 错误

**解决方案：**
1. 检查 Token 是否正确
2. 确认 Token 有 `repo` 权限
3. 重新配置远程 URL

### Q3: 文件太大无法推送

**原因：** GitHub 单文件限制 100MB

**解决方案：**
```bash
# 将大文件添加到 .gitignore
echo "large-file.zip" >> .gitignore

# 移除已跟踪的大文件
git rm --cached large-file.zip

# 重新提交
git commit -m "移除大文件"
git push
```

### Q4: 不小心上传了敏感信息

**解决方案：**
```bash
# 从历史中删除文件
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch secrets.txt" \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

### Q5: 提交历史太乱，想重新开始

**解决方案：**
```bash
# 删除 .git 目录
rm -rf .git

# 重新初始化
git init
git add .
git commit -m "重新开始"
git remote add origin https://github.com/username/blog.git
git push -f -u origin main
```

### Q6: 合并冲突

**解决方案：**
```bash
# 拉取远程代码
git pull

# 手动解决冲突文件
# 编辑冲突文件，删除 <<<<<<<, =======, >>>>>>> 标记

# 添加解决后的文件
git add conflict-file.md

# 提交
git commit -m "解决合并冲突"

# 推送
git push
```

---

## 🎯 最佳实践

### 1. 提交信息规范

**推荐格式：**
```
类型: 简短描述

详细说明（可选）
```

**常用类型：**
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `chore`: 构建/工具变动

**示例：**
```bash
git commit -m "feat: 新增关于页面"
git commit -m "fix: 修复评论系统显示问题"
git commit -m "docs: 更新 README"
```

### 2. 定期备份

```bash
# 每天或每周执行一次
git add .
git commit -m "$(date +%Y-%m-%d) 定期备份"
git push
```

**自动化脚本：**

创建 `backup.sh`：
```bash
#!/bin/bash
cd /path/to/hexo/blog
git add .
git commit -m "$(date +%Y-%m-%d-%H:%M:%S) 自动备份"
git push
echo "备份完成！"
```

设置定时任务：
```bash
# Linux/macOS - crontab
0 2 * * * /path/to/backup.sh

# Windows - 任务计划程序
```

### 3. 使用分支

**开发流程：**
```bash
# 主分支保持稳定
git checkout main

# 创建开发分支
git checkout -b develop

# 开发新功能
git checkout -b feature/new-theme

# 完成后合并
git checkout develop
git merge feature/new-theme

# 测试无误后合并到主分支
git checkout main
git merge develop
```

### 4. 使用 .gitattributes

在博客根目录创建 `.gitattributes`：

```
# 自动检测文本文件并规范化换行符
* text=auto

# 明确指定文本文件
*.md text
*.yml text
*.json text

# 明确指定二进制文件
*.png binary
*.jpg binary
*.gif binary
*.ico binary
```

### 5. 保护重要文件

将敏感文件添加到 `.gitignore`：

```
# 环境变量
.env
.env.local

# API 密钥
*_key.json
secrets.yml

# 数据库配置
db.config.js
```

---

## 📋 完整备份清单

### 必须备份的文件

- ✅ `source/` - 文章和页面
- ✅ `themes/` - 主题文件
- ✅ `_config.yml` - 站点配置
- ✅ `_config.[theme].yml` - 主题配置
- ✅ `package.json` - 依赖列表
- ✅ `scaffolds/` - 文章模板

### 不需要备份的文件

- ❌ `node_modules/` - 依赖包（可恢复）
- ❌ `public/` - 生成的静态文件
- ❌ `.deploy_git/` - 部署临时文件
- ❌ `db.json` - 数据库文件（可重建）

### 可选备份的文件

- ⚠️ `themes/[theme]/.git/` - 如果主题是 Git 子模块
- ⚠️ 自定义脚本
- ⚠️ 图片等媒体文件（如果很大，考虑单独存储）

---

## 🔐 安全建议

### 1. 使用 SSH 密钥（推荐）

**生成 SSH 密钥：**
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

**添加到 GitHub：**
1. 复制公钥：`cat ~/.ssh/id_ed25519.pub`
2. GitHub > Settings > SSH and GPG keys > New SSH key
3. 粘贴公钥并保存

**修改远程 URL：**
```bash
git remote set-url origin git@github.com:username/blog.git
```

### 2. 使用私有仓库

博客源码包含配置信息，建议使用私有仓库

### 3. 不要上传敏感信息

- API 密钥
- 数据库密码
- 邮箱账号密码
- 个人隐私信息

### 4. 定期更改 Token

Personal Access Token 建议定期更换

### 5. 启用两步验证

GitHub 账号启用 2FA，增强安全性

---

## 🎉 总结

通过将 Hexo 博客上传到 GitHub，你可以：

✅ **安全备份** - 数据永不丢失  
✅ **版本控制** - 追踪每次修改  
✅ **多设备同步** - 随时随地编辑  
✅ **回滚能力** - 恢复历史版本  
✅ **团队协作** - 多人共同维护

### 日常工作流程

```bash
# 1. 写文章
hexo new post "文章标题"

# 2. 本地预览
hexo s

# 3. 生成静态文件
hexo g

# 4. 部署到 GitHub Pages
hexo d

# 5. 备份源码到 GitHub
git add .
git commit -m "新增文章：xxx"
git push
```

### 下一步

- 🔧 配置自动化部署（GitHub Actions）
- 🌐 绑定自定义域名
- 📊 添加网站统计
- 🔍 优化 SEO
- 💬 完善评论系统

---

## 🔗 相关链接

- [Git 官方文档](https://git-scm.com/doc)
- [GitHub 官方文档](https://docs.github.com/)
- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [GitHub Desktop](https://desktop.github.com/) - 图形化界面工具

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布

---

*保护好你的博客源码，让创作无后顾之忧！如有问题欢迎在评论区讨论。*
