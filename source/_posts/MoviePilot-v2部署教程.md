---
title: MoviePilot v2 Docker 部署完整教程
date: 2025-11-16 14:50:00
categories:
  - 教程
  - 影音管理
tags:
  - MoviePilot
  - Docker
  - NAS
  - 媒体管理
  - 自动化
description: 详细讲解如何使用 Docker 部署 MoviePilot v2 媒体管理系统，实现自动化影视资源管理和订阅。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0m000d7w33gn1e2tfjqia4lDIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

MoviePilot 是一款基于 Python 开发的自动化媒体管理工具，支持：

- 🎬 **自动订阅** - 自动追剧、追番
- 📥 **资源下载** - 对接主流下载器
- 📂 **智能整理** - 自动分类、重命名、刮削
- 🔍 **资源搜索** - 多站点资源聚合
- 📊 **影视管理** - Emby/Jellyfin/Plex 集成

本文将详细介绍如何使用 Docker 部署 MoviePilot v2 最新版本。

<!-- more -->

---

## 💡 版本特性

### MoviePilot v2 新特性

✅ **全新架构** - 更稳定、更快速  
✅ **Web UI** - 现代化管理界面  
✅ **插件系统** - 丰富的扩展功能  
✅ **多用户支持** - 权限管理  
✅ **TMDB 集成** - 完善的元数据支持  
✅ **通知推送** - 多渠道消息通知

---

## 📦 准备工作

### 1. 环境要求

- ✅ Docker 已安装（版本 20.10+）
- ✅ Docker Compose 已安装（版本 2.0+）
- ✅ 足够的存储空间（建议 100GB+）
- ✅ 稳定的网络连接

### 2. 目录规划

建议提前规划好目录结构：

```bash
/vol1/1000/docker/moviepilot/
├── config/          # 配置文件目录
└── core/            # 浏览器核心文件

/vol2/1000/media/    # 媒体文件目录
├── movies/          # 电影
├── tv/              # 电视剧
├── anime/           # 动漫
└── downloads/       # 下载目录
```

### 3. 创建目录

```bash
# 创建配置目录
mkdir -p /vol1/1000/docker/moviepilot/config
mkdir -p /vol1/1000/docker/moviepilot/core

# 创建媒体目录
mkdir -p /vol2/1000/media/{movies,tv,anime,downloads}

# 设置权限
chmod -R 755 /vol1/1000/docker/moviepilot
chmod -R 755 /vol2/1000/media
```

---

## 🚀 部署步骤

### Step 1: 创建 Docker Compose 文件

创建 `docker-compose.yml` 文件：

```bash
cd /vol1/1000/docker/moviepilot
nano docker-compose.yml
```

### Step 2: 粘贴配置

将以下配置粘贴到文件中：

```yaml
services:
  moviepilot:
    stdin_open: true
    tty: true
    container_name: moviepilot-v2
    hostname: moviepilot-v2
    network_mode: host
    volumes:
      - '/vol2/1000/media:/media'
      - '/vol1/1000/docker/moviepilot/config:/config'
      - '/vol1/1000/docker/moviepilot/core:/moviepilot/.cache/ms-playwright'
      - '/var/run/docker.sock:/var/run/docker.sock:ro'

    environment:
      - 'NGINX_PORT=3000'
      - 'PORT=3001'
      - 'PUID=0'
      - 'PGID=0'
      - 'UMASK=000'
      - 'TZ=Asia/Shanghai'
      - 'SUPERUSER=admin' #超级管理员用户名
      - 'SUPERUSER_PASSWORD=admin123' #超级管理员初始密码
      - 'TMDB_IMAGE_DOMAIN=tmdb.liubei.org' #tmdb代理
      - 'TMDB_API_DOMAIN=tmdb.liubei.org' #tmdb代理

    restart: always
    image: jxxghp/moviepilot-v2:latest
```

保存文件（Ctrl+O，Enter，Ctrl+X）。

### Step 3: 启动容器

```bash
# 拉取镜像
docker-compose pull

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

### Step 4: 访问 Web 界面

等待容器启动完成后，访问：

```
http://你的IP地址:3000
```

使用默认账号登录：
- **用户名**: `admin`
- **密码**: `admin123`

⚠️ **首次登录后请立即修改密码！**

---

## 📖 配置详解

### 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `NGINX_PORT` | Web 界面端口 | `3000` |
| `PORT` | API 服务端口 | `3001` |
| `PUID` | 运行用户 UID | `0` (root) |
| `PGID` | 运行用户 GID | `0` (root) |
| `UMASK` | 文件权限掩码 | `000` |
| `TZ` | 时区 | `Asia/Shanghai` |
| `SUPERUSER` | 管理员用户名 | - |
| `SUPERUSER_PASSWORD` | 管理员密码 | - |
| `TMDB_IMAGE_DOMAIN` | TMDB 图片代理 | - |
| `TMDB_API_DOMAIN` | TMDB API 代理 | - |

### 目录挂载说明

| 容器路径 | 宿主机路径 | 用途 |
|----------|------------|------|
| `/media` | `/vol2/1000/media` | 媒体文件存储 |
| `/config` | `/vol1/1000/docker/moviepilot/config` | 配置文件 |
| `/moviepilot/.cache/ms-playwright` | `/vol1/1000/docker/moviepilot/core` | 浏览器核心 |
| `/var/run/docker.sock` | `/var/run/docker.sock` | Docker 通信（只读） |

### 网络模式

```yaml
network_mode: host
```

**优势：**
- ✅ 性能最佳，无 NAT 损耗
- ✅ 直接使用宿主机网络
- ✅ 简化端口映射

**注意：**
- ⚠️ 端口可能与宿主机冲突
- ⚠️ 安全性相对较低

---

## ⚙️ 初始配置

### 1. 基础设置

登录后进入 **设置** > **基本设置**：

#### 媒体服务器配置
- 选择媒体服务器类型（Emby/Jellyfin/Plex）
- 填写服务器地址和 API Key
- 测试连接

#### 下载器配置
- 添加 qBittorrent/Transmission
- 配置下载目录
- 设置下载限速

#### 媒体库配置
```
电影目录: /media/movies
电视剧目录: /media/tv
动漫目录: /media/anime
下载目录: /media/downloads
```

### 2. 站点配置

进入 **站点管理**：

1. 添加 PT 站点
2. 填写用户名和密码或 Cookie
3. 测试连接
4. 启用自动签到

### 3. 订阅设置

进入 **订阅管理**：

1. 设置订阅规则
2. 配置质量偏好
3. 设置自动下载

---

## 🔍 TMDB 代理配置

### 为什么需要 TMDB 代理？

- 🌍 国内访问 TMDB 不稳定
- 🖼️ 图片加载缓慢
- 🔑 隐藏 API Key

### 配置说明

配置中已设置 TMDB 代理：

```yaml
environment:
  - 'TMDB_IMAGE_DOMAIN=tmdb.liubei.org'
  - 'TMDB_API_DOMAIN=tmdb.liubei.org'
```

**替换为你自己的域名：**
1. 部署 TMDB 代理服务（参考我的另一篇教程）
2. 修改域名为你的代理地址
3. 重启容器生效

---

## 🔧 常用操作

### 查看日志

```bash
# 实时日志
docker-compose logs -f moviepilot

# 最近 100 行
docker-compose logs --tail 100 moviepilot
```

### 重启容器

```bash
docker-compose restart
```

### 停止容器

```bash
docker-compose down
```

### 更新版本

```bash
# 拉取最新镜像
docker-compose pull

# 重新创建容器
docker-compose up -d

# 清理旧镜像
docker image prune -f
```

### 备份配置

```bash
# 备份配置目录
tar -czf moviepilot-backup-$(date +%Y%m%d).tar.gz /vol1/1000/docker/moviepilot/config

# 恢复配置
tar -xzf moviepilot-backup-20251116.tar.gz -C /
```

---

## 🚨 常见问题

### Q1: 无法访问 Web 界面？

**解决方案：**
```bash
# 检查容器状态
docker ps | grep moviepilot

# 检查端口占用
netstat -tulpn | grep 3000

# 查看日志
docker-compose logs moviepilot
```

### Q2: 提示 TMDB 连接失败？

**解决方案：**
1. 检查 TMDB 代理是否正常
2. 测试代理地址可访问性
3. 确认域名配置正确

### Q3: 下载器连接失败？

**解决方案：**
1. 确认下载器已启动
2. 检查网络模式是否冲突
3. 验证账号密码正确

### Q4: 媒体刮削失败？

**解决方案：**
1. 检查 TMDB 配置
2. 确认网络连接
3. 查看刮削日志

### Q5: 自动订阅不工作？

**解决方案：**
1. 检查站点连接状态
2. 确认订阅规则正确
3. 查看订阅日志

---

## ⚡ 性能优化

### 1. 资源限制

添加资源限制（可选）：

```yaml
services:
  moviepilot:
    # ... 其他配置
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          memory: 512M
```

### 2. 日志管理

限制日志大小：

```yaml
services:
  moviepilot:
    # ... 其他配置
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3. 定期清理

```bash
# 清理未使用的 Docker 资源
docker system prune -a -f

# 清理缓存
rm -rf /vol1/1000/docker/moviepilot/core/cache/*
```

---

## 🔐 安全建议

### 1. 修改默认密码

⚠️ **首次登录后立即修改管理员密码！**

### 2. 限制访问

使用反向代理（Nginx/Caddy）：
- 添加 SSL 证书
- 配置访问控制
- 启用 IP 白名单

### 3. 定期备份

```bash
# 添加定时任务
crontab -e

# 每天凌晨 3 点备份
0 3 * * * tar -czf /backup/moviepilot-$(date +\%Y\%m\%d).tar.gz /vol1/1000/docker/moviepilot/config
```

### 4. 更新及时

定期更新到最新版本，修复安全漏洞。

---

## 📊 推荐配置

### 最佳实践

1. **分离数据盘** - 配置和媒体分开存储
2. **使用 SSD** - 配置目录使用 SSD，提升性能
3. **定期清理** - 清理下载缓存和日志
4. **备份策略** - 定期备份配置文件
5. **监控告警** - 配置状态监控和告警

### 目录结构建议

```
/vol1/1000/docker/moviepilot/  # 系统盘（SSD）
├── config/                     # 配置文件
└── core/                       # 缓存文件

/vol2/1000/media/              # 数据盘（HDD）
├── movies/                     # 电影库
├── tv/                         # 剧集库
├── anime/                      # 动漫库
└── downloads/                  # 下载目录
    ├── complete/              # 完成
    └── incomplete/            # 进行中
```

---

## 🎉 总结

通过本教程，你已经成功部署了 MoviePilot v2，实现了：

✅ **自动化管理** - 影视资源自动订阅和下载  
✅ **智能整理** - 自动分类、重命名、刮削  
✅ **媒体集成** - 对接 Emby/Jellyfin/Plex  
✅ **TMDB 加速** - 使用代理提升访问速度  
✅ **稳定运行** - Docker 容器化部署

### 下一步

- 📝 配置更多 PT 站点
- 🎬 添加订阅规则
- 🔔 设置消息通知
- 🎨 探索插件系统

---

## 🔗 相关链接

- [MoviePilot 官方文档](https://github.com/jxxghp/MoviePilot)
- [Docker 官方文档](https://docs.docker.com/)
- [TMDB API 文档](https://developers.themoviedb.org/3)
- [MoviePilot 插件市场](https://github.com/jxxghp/MoviePilot-Plugins)

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布

---

*如有问题欢迎在评论区讨论！*
