#!/bin/bash

# -------------------------------
# Hexo 自动部署到 GitHub + Cloudflare Pages (HTTPS + PAT)
# -------------------------------

# ==== 1. 设置博客本地路径 ====
BLOG_DIR=/Users/liubei/Desktop/m/blog/blog    # ← 修改为你的 Hexo 博客路径
cd "$BLOG_DIR" || { echo "博客目录不存在：$BLOG_DIR"; exit 1; }

# ==== 2. 初始化 Git 仓库（如果不存在） ====
if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

# ==== 3. 配置远程仓库（HTTPS + PAT） ====
# 请输入你的 GitHub Token（第一次运行会提示）
GIT_REMOTE_URL="https://github.com/CNLiuBei/blog.git"

if ! git remote | grep -q origin; then
  git remote add origin "$GIT_REMOTE_URL"
fi

# 启用 macOS Keychain 保存凭据
git config --global credential.helper osxkeychain

# ==== 4. 构建 Hexo 静态文件 ====
echo "正在清理并生成 Hexo 静态文件..."
hexo clean
hexo generate

# ==== 5. 检查 Git 是否有改动 ====
if git status --porcelain | grep .; then
  echo "检测到修改，准备提交并推送到 GitHub..."
  git add .
  git commit -m "deploy: 更新博客 $(date '+%Y-%m-%d %H:%M:%S')"

  # 推送时使用 HTTPS + PAT
  echo "请输入你的 GitHub Token（首次输入后会保存在 Keychain）:"
  git push https://<你的用户名>@github.com/CNLiuBei/blog.git main
  echo "已成功推送！Cloudflare Pages 会自动构建。"
else
  echo "没有新修改，跳过提交。"
fi

# ==== 6. 确保 pa
