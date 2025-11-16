---
title: Emby 媒体服务器 Docker 部署完整教程
date: 2025-11-16 15:00:00
categories:
  - 教程
  - 影音管理
tags:
  - Emby
  - Docker
  - NAS
  - 媒体服务器
  - 家庭影院
description: 详细讲解如何使用 Docker 部署 Emby 媒体服务器，打造个人家庭影音娱乐中心，支持多设备访问和流媒体播放。
cover: https://vip.123pan.cn/1821322860/ymjew503t0n000d7w32ye6fwx6y2h688DIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

Emby 是一款强大的媒体服务器软件，可以帮你：

- 🎬 **整理媒体库** - 自动识别电影、剧集、音乐
- 📱 **多设备访问** - 手机、电脑、电视、平板通用
- 🌐 **远程观看** - 随时随地访问家中媒体
- 🎨 **精美界面** - 海报墙、元数据自动获取
- 👨‍👩‍👧‍👦 **多用户管理** - 家庭成员独立账号
- 🔄 **实时转码** - 自适应设备和网络

本文将详细介绍如何使用 Docker 部署 Emby 4.8.11.0 版本。

<!-- more -->

---

## 💡 为什么选择 Emby？

### Emby vs Plex vs Jellyfin

| 特性 | Emby | Plex | Jellyfin |
|------|------|------|----------|
| 开源 | ❌ 闭源 | ❌ 闭源 | ✅ 开源 |
| 收费 | 付费解锁高级功能 | 付费解锁高级功能 | 完全免费 |
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 插件 | 丰富 | 丰富 | 较少 |
| 中文支持 | ✅ 优秀 | ✅ 良好 | ✅ 良好 |
| 硬件转码 | ✅ 支持 | ✅ 支持 | ✅ 支持 |

### Emby 优势

✅ **稳定性强** - 成熟的商业产品  
✅ **功能完善** - 插件生态丰富  
✅ **性能优异** - 转码效率高  
✅ **界面精美** - 用户体验好  
✅ **支持完善** - 社区活跃

---

## 📦 准备工作

### 1. 环境要求

- ✅ Docker 已安装（版本 20.10+）
- ✅ Docker Compose 已安装（版本 2.0+）
- ✅ 足够的存储空间（建议 500GB+）
- ✅ 良好的网络环境

### 2. 硬件建议

**最低配置：**
- CPU: 双核处理器
- 内存: 2GB RAM
- 存储: 100GB 可用空间

**推荐配置：**
- CPU: 四核以上，支持硬件转码（Intel Quick Sync / NVIDIA）
- 内存: 4GB+ RAM
- 存储: 1TB+ 硬盘（媒体文件）+ 50GB SSD（配置文件）

### 3. 目录规划

建议提前规划好目录结构：

```bash
/vol1/1000/docker/emby/    # 配置目录（SSD）
├── config/                # 配置文件
├── cache/                 # 缓存文件
└── metadata/              # 元数据

/vol2/1000/media/          # 媒体目录（HDD）
├── movies/                # 电影
├── tv/                    # 电视剧
├── music/                 # 音乐
├── photos/                # 照片
└── anime/                 # 动漫
```

### 4. 创建目录

```bash
# 创建配置目录
mkdir -p /vol1/1000/docker/emby

# 创建媒体目录
mkdir -p /vol2/1000/media/{movies,tv,music,photos,anime}

# 设置权限
chmod -R 755 /vol1/1000/docker/emby
chmod -R 755 /vol2/1000/media
```

---

## 🚀 部署步骤

### Step 1: 创建 Docker Compose 文件

创建配置文件：

```bash
cd /vol1/1000/docker/emby
nano docker-compose.yml
```

### Step 2: 粘贴配置

将以下配置粘贴到文件中：

```yaml
services:
  emby:
    image: amilys/embyserver:4.8.11.0
    container_name: emby-server
    restart: always
    network_mode: bridge
    ports:
      - "127.0.0.1:8096:8096"  # 本地访问
      - "10.10.10.10:8096:8096"  # 内网访问
    environment:
      - PUID=0
      - PGID=0
      - TZ=Asia/Shanghai
    volumes:
      - /vol1/1000/docker/emby:/config
      - /vol2/1000/media:/media
```

保存文件（Ctrl+O，Enter，Ctrl+X）。

### Step 3: 启动容器

```bash
# 拉取镜像
docker-compose pull

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f emby
```

### Step 4: 访问 Web 界面

等待容器启动完成（约 1-2 分钟），访问：

**本地访问：**
```
http://127.0.0.1:8096
```

**内网访问：**
```
http://10.10.10.10:8096
```

⚠️ **请将 `10.10.10.10` 替换为你的实际内网 IP**

---

## 📖 配置详解

### 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `PUID` | 运行用户 UID | `0` (root) |
| `PGID` | 运行用户 GID | `0` (root) |
| `TZ` | 时区设置 | `Asia/Shanghai` |

### 端口配置

```yaml
ports:
  - "127.0.0.1:8096:8096"  # 仅本机访问
  - "10.10.10.10:8096:8096"  # 内网IP访问
```

**说明：**
- `127.0.0.1:8096` - 只允许本机访问（安全）
- `10.10.10.10:8096` - 允许内网指定 IP 访问
- 如需全网访问，改为 `8096:8096`（不推荐）

### 目录挂载

| 容器路径 | 宿主机路径 | 用途 |
|----------|------------|------|
| `/config` | `/vol1/1000/docker/emby` | 配置文件、缓存 |
| `/media` | `/vol2/1000/media` | 媒体文件 |

### 网络模式

```yaml
network_mode: bridge
```

**Bridge 模式特点：**
- ✅ 安全性好，网络隔离
- ✅ 端口映射灵活
- ⚠️ 性能略低于 host 模式

---

## ⚙️ 初始配置

### 1. 首次设置向导

访问 Web 界面后，按照向导进行初始设置：

#### 步骤 1: 选择语言
- 选择 **简体中文**
- 点击 **下一步**

#### 步骤 2: 创建管理员账户
```
用户名: admin
密码: ******** （设置强密码）
```

#### 步骤 3: 添加媒体库

**电影库：**
```
类型: 电影
文件夹: /media/movies
语言: Chinese
国家: China
```

**电视剧库：**
```
类型: 电视节目
文件夹: /media/tv
语言: Chinese
国家: China
```

**音乐库：**
```
类型: 音乐
文件夹: /media/music
```

#### 步骤 4: 元数据设置
- 勾选 **TheMovieDb**
- 勾选 **TheTVDB**
- 勾选 **豆瓣**（需安装插件）

#### 步骤 5: 远程访问
- 启用远程访问
- 设置外部访问域名（如有）

### 2. 媒体库刮削

添加媒体库后，Emby 会自动：
1. 扫描文件
2. 识别影片信息
3. 下载海报、背景
4. 获取简介、演员等元数据

⏱️ **首次刮削可能需要较长时间，请耐心等待**

### 3. 转码设置

进入 **设置** > **转码**：

**硬件加速：**
- Intel CPU: 选择 **Intel Quick Sync**
- NVIDIA GPU: 选择 **NVIDIA NVENC**
- AMD GPU: 选择 **AMD AMF**

**转码质量：**
```
目标比特率: 自动
质量: 高
```

---

## 🔧 高级配置

### 1. 安装插件

进入 **插件** > **目录**：

**推荐插件：**
- 📊 **Trakt** - 观看记录同步
- 🎨 **豆瓣元数据** - 中文元数据支持
- 📝 **Kodi Sync Queue** - Kodi 同步
- 🔔 **Notifications** - 通知推送

安装后需要重启 Emby。

### 2. 字幕设置

**内置字幕：**
- 自动提取视频内嵌字幕
- 支持 SRT、ASS、SSA 等格式

**外部字幕：**
```
电影.mp4
电影.zh.srt  （中文字幕）
电影.en.srt  （英文字幕）
```

### 3. 用户管理

**添加家庭成员：**
1. 进入 **用户** > **新用户**
2. 设置用户名和密码
3. 配置媒体库访问权限
4. 设置家长控制（可选）

### 4. 远程访问配置

**方式一：内网穿透**
- 使用 frp / ngrok
- 安全性高，推荐

**方式二：端口映射**
- 路由器配置 DDNS
- 映射 8096 端口
- ⚠️ 注意安全风险

**方式三：反向代理**
- 使用 Nginx / Caddy
- 配置 SSL 证书
- 最安全的方式

---

## 🎨 客户端使用

### 1. Web 端

直接访问：
```
http://服务器IP:8096
```

### 2. 移动端

**iOS：**
- App Store 搜索 "Emby"
- 下载并登录

**Android：**
- Google Play / 应用商店搜索 "Emby"
- 下载并登录

### 3. TV 端

**智能电视：**
- 应用商店搜索 "Emby"
- 或通过 U 盘安装 APK

**Apple TV / Roku / Fire TV：**
- 对应商店下载 Emby 客户端

### 4. Kodi

安装 Emby for Kodi 插件，实现完美集成。

---

## 📂 媒体文件命名规范

### 电影命名

```
/media/movies/
├── 盗梦空间 (2010)/
│   ├── 盗梦空间 (2010).mp4
│   └── 盗梦空间 (2010).zh.srt
├── 阿凡达 (2009)/
│   └── 阿凡达 (2009).mkv
```

**格式：**
```
电影名称 (年份)/电影名称 (年份).扩展名
```

### 电视剧命名

```
/media/tv/
├── 权力的游戏 (2011)/
│   ├── Season 01/
│   │   ├── S01E01.mkv
│   │   ├── S01E02.mkv
│   └── Season 02/
│       ├── S02E01.mkv
```

**格式：**
```
剧名 (年份)/Season XX/SXXEXX.扩展名
```

### 动漫命名

```
/media/anime/
├── 进击的巨人 (2013)/
│   ├── Season 01/
│   │   ├── [进击的巨人][01].mkv
│   │   ├── [进击的巨人][02].mkv
```

---

## 🔍 常用操作

### 查看日志

```bash
# 实时日志
docker-compose logs -f emby

# 最近 100 行
docker-compose logs --tail 100 emby

# 容器内日志
docker exec -it emby-server cat /config/logs/embyserver.txt
```

### 重启服务

```bash
# 重启容器
docker-compose restart

# 或在 Web 界面
设置 > 服务器 > 重启服务器
```

### 更新版本

```bash
# 拉取新镜像
docker-compose pull

# 重新创建容器
docker-compose up -d

# 清理旧镜像
docker image prune -f
```

### 备份配置

```bash
# 备份配置目录
tar -czf emby-backup-$(date +%Y%m%d).tar.gz /vol1/1000/docker/emby

# 恢复配置
tar -xzf emby-backup-20251116.tar.gz -C /
```

### 库刷新

```bash
# 手动触发扫描
设置 > 库 > 扫描所有库

# 或使用命令
docker exec emby-server curl -X POST http://localhost:8096/Library/Refresh
```

---

## 🚨 常见问题

### Q1: 无法访问 Web 界面？

**解决方案：**
```bash
# 1. 检查容器状态
docker ps | grep emby

# 2. 检查端口
netstat -tulpn | grep 8096

# 3. 检查防火墙
systemctl status firewalld
firewall-cmd --zone=public --add-port=8096/tcp --permanent
firewall-cmd --reload

# 4. 查看日志
docker-compose logs emby
```

### Q2: 硬件转码不可用？

**解决方案：**
```yaml
# Intel Quick Sync 需要添加设备映射
services:
  emby:
    devices:
      - /dev/dri:/dev/dri

# NVIDIA GPU 需要安装 nvidia-docker2
runtime: nvidia
```

### Q3: 刮削失败？

**可能原因：**
1. 文件命名不规范
2. 网络连接问题（TMDB 访问受限）
3. 元数据源配置错误

**解决方案：**
- 检查文件命名是否符合规范
- 配置 TMDB 代理
- 手动匹配元数据

### Q4: 播放卡顿？

**优化建议：**
1. 启用硬件转码
2. 降低转码质量
3. 检查网络带宽
4. 使用直接播放（不转码）

### Q5: 字幕乱码？

**解决方案：**
- 使用 UTF-8 编码的字幕文件
- 重命名字幕文件为 `.zh.srt`
- 在播放器中手动选择字幕

---

## ⚡ 性能优化

### 1. 启用硬件加速

```yaml
services:
  emby:
    # Intel GPU
    devices:
      - /dev/dri:/dev/dri
    
    # NVIDIA GPU
    runtime: nvidia
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_DRIVER_CAPABILITIES=all
```

### 2. 优化缓存

进入 **设置** > **服务器** > **转码**：
```
转码临时路径: /config/transcoding-temp
图像缓存路径: /config/cache/images
```

### 3. 资源限制

```yaml
services:
  emby:
    deploy:
      resources:
        limits:
          cpus: '4'
          memory: 4G
        reservations:
          memory: 2G
```

### 4. 网络优化

```yaml
services:
  emby:
    # 使用 host 网络模式（性能最佳）
    network_mode: host
```

---

## 🔐 安全建议

### 1. 访问控制

**仅允许内网访问：**
```yaml
ports:
  - "192.168.1.100:8096:8096"  # 指定内网IP
```

**使用反向代理：**
```nginx
# Nginx 配置示例
server {
    listen 443 ssl;
    server_name emby.yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8096;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. 强密码策略

- 管理员账户使用强密码
- 定期更换密码
- 启用两步验证（如支持）

### 3. 定期备份

```bash
# 添加定时任务
crontab -e

# 每周备份一次
0 3 * * 0 tar -czf /backup/emby-$(date +\%Y\%m\%d).tar.gz /vol1/1000/docker/emby
```

### 4. 更新及时

定期更新到最新稳定版本，修复安全漏洞。

---

## 🎯 最佳实践

### 1. 目录结构

```
/vol1/1000/docker/emby/     # SSD（配置）
├── config/
├── cache/
└── transcoding-temp/

/vol2/1000/media/           # HDD（媒体）
├── movies/
├── tv/
├── music/
└── photos/
```

### 2. 媒体组织

- 使用 Sonarr / Radarr 自动整理
- 保持命名规范
- 定期清理重复文件

### 3. 监控告警

使用 Grafana + Prometheus 监控：
- CPU / 内存使用率
- 磁盘空间
- 转码任务
- 用户活动

### 4. 数据备份

**重要数据：**
- 配置文件（/config）
- 数据库（emby.db）
- 用户数据

**备份策略：**
- 每日增量备份
- 每周完整备份
- 异地备份（云存储）

---

## 📊 容量规划

### 存储需求

**1080p 电影：** 约 3-8GB/部  
**4K 电影：** 约 20-60GB/部  
**电视剧：** 约 300MB-1GB/集  
**音乐：** 约 10-30MB/首

**建议容量：**
- 500部电影 ≈ 2TB
- 50部剧集 ≈ 1TB
- 1000首音乐 ≈ 20GB
- **总计：** 4TB+ 起步

### 网络带宽

**本地播放：** 100Mbps+  
**远程 1080p：** 10Mbps  
**远程 4K：** 25Mbps+

---

## 🎉 总结

通过本教程，你已经成功部署了 Emby 媒体服务器，实现了：

✅ **个人影音中心** - 整理和管理媒体文件  
✅ **多设备访问** - 手机、电脑、电视通用  
✅ **远程观看** - 随时随地访问  
✅ **自动刮削** - 精美的媒体库展示  
✅ **硬件转码** - 流畅的播放体验

### 下一步

- 📚 添加更多媒体内容
- 🎨 安装豆瓣插件
- 👥 创建家庭成员账号
- 🔔 配置通知推送
- 🌐 设置远程访问

---

## 🔗 相关链接

- [Emby 官方网站](https://emby.media/)
- [Emby 文档](https://support.emby.media/)
- [Emby 论坛](https://emby.media/community/)
- [Docker Hub - Emby](https://hub.docker.com/r/emby/embyserver)
- [媒体命名规范](https://support.emby.media/support/solutions/articles/44001159102)

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布，基于 Emby 4.8.11.0

---

*享受你的私人影音娱乐中心！如有问题欢迎在评论区讨论。*
