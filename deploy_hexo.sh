#!/bin/bash

# -------------------------------
# Hexo 自动部署到 GitHub + Cloudflare Pages
# 使用 GitHub CLI 浏览器授权（免输入 Token）
# 首次授权自动打开浏览器
# -------------------------------

# ==== 1. 设置博客本地路径 ====
BLOG_DIR="/Users/liubei/Desktop/m/blog/blog"
cd "$BLOG_DIR" || { echo "博客目录不存在：$BLOG_DIR"; exit 1; }

# ==== 2. 自动检测 GitHub CLI ====
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI 未安装，正在自动安装..."
  if ! command -v brew >/dev/null 2>&1; then
    echo "Homebrew 未安装，请先安装 Homebrew：https://brew.sh/"
    exit 1
  fi
  brew install gh
  echo "GitHub CLI 安装完成。"
fi

# ==== 3. GitHub CLI 浏览器授权（自动打开浏览器） ====
if ! gh auth status >/dev/null 2>&1; then
  echo "首次运行，需要在浏览器中登录 GitHub 完成授权..."
  gh auth login --web
fi

# ==== 4. 初始化 Git 仓库（如果不存在） ====
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# ==== 5. 配置远程仓库 URL ====
GIT_REMOTE_URL="https://github.com/CNLiuBei/blog.git"
if ! git remote | grep -q origin; then
  git remote add origin "$GIT_REMOTE_URL"
fi

# ==== 6. 构建 Hexo 静态文件 ====
echo "正在清理并生成 Hexo 静态文件..."
hexo clean
hexo generate

# ==== 7. 检查 Git 是否有改动 ====
if git status --porcelain | grep .; then
  echo "检测到修改，准备提交并推送到 GitHub..."
  git add .
  git commit -m "deploy: 更新博客 $(date '+%Y-%m-%d %H:%M:%S')"
  
  # 使用 gh CLI 推送
  gh repo sync CNLiuBei/blog --branch main --force
  echo "已成功推送！Cloudflare Pages 会自动构建。"
else
  echo "没有新修改，跳过提交。"
fi

# ==== 8. 确保 package.json 有 build 脚本 ====
if [ -f package.json ] && ! grep -q '"build":' package.json 2>/dev/null; then
  echo "正在在 package.json 中添加 build 脚本..."
  if ! command -v jq >/dev/null 2>&1; then
    echo "请先安装 jq: brew install jq"
    exit 1
  fi
  jq '.scripts.build="hexo generate"' package.json > package.tmp.json && mv package.tmp.json package.json
fi

echo "部署完成！以后更新博客只需再次运行此脚本即可全自动部署。"
