---
title: Lucky 网络工具 Docker 部署完整教程
date: 2025-11-16 15:15:00
categories:
  - 教程
  - 网络工具
tags:
  - Lucky
  - Docker
  - 内网穿透
  - 端口转发
  - DDNS
description: 详细讲解如何使用 Docker 部署 Lucky 网络工具，实现端口转发、Stun内网穿透、DDNS、Web服务等功能，让你的 NAS 和家庭服务器更好用。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhep18xzjqlotDIYvDIDvDqYzDcxPAda0DY==.jpeg
---

## 📖 前言

Lucky 最初是作为一个小工具开发，用于替代 socat，在小米路由 AX6000 官方系统上实现公网 IPv6 转内网 IPv4 的功能。Lucky 采用 Golang 实现核心程序，前端使用 Vue3.2 开发，具有高效、稳定、跨平台等优点。

**主要功能模块：**

- 🌐 **端口转发** - TCP/UDP 端口映射，支持公网 IPv6 转内网 IPv4
- 🔐 **Stun 内网穿透** - 无需公网 IPv4，适合运营商级 NAT1 网络
- 🌍 **DDNS** - 动态域名解析，支持 20+ DNS 服务商
- 🌐 **Web 服务** - 反向代理、重定向、URL 跳转
- � **网络唤醒** - 远程唤醒/关机，支持第三方物联网平台
- ⏰ **计划任务** - 可视化 Cron，支持 Windows
- 🔒 **ACME 证书** - 自动申请和续签 SSL 证书
- 💾 **网络存储** - 文件存储功能

Lucky 特别适合 NAS 用户和家庭服务器玩家，一个工具解决多个网络需求。

<!-- more -->

---

## 💡 Lucky 核心功能

### 1. 端口转发

**官方特性：**
- 主要用于实现公网 IPv6 转内网 IPv4 的 TCP/UDP 端口转发
- 支持界面化管理转发规则
- 单条规则支持设置多个转发端口
- 提供一键开关和定时开关功能
- 支持黑白名单安全模式切换
- 白名单模式让内网服务端口更安全地暴露到公网
- 实时记录访问日志
- 规则列表日志一目了然

**应用场景：**
```
公网 IPv6:8080 → 内网 IPv4 192.168.1.100:80
公网 IPv6:3306 → 内网 IPv4 192.168.1.50:3306
```

### 2. Stun 内网穿透

**官方特性：**
- 实现内网穿透，无需公网 IPv4 地址
- 适合于国内运营商级 NAT1 宽带网络

⚠️ **注意：** Lucky 使用 Stun 协议进行内网穿透，不是 frp

### 3. 动态域名 (DDNS)

**支持的 DNS 服务商：**
- 阿里云、百度云、华为云、京东云、腾讯云
- 火山引擎、帝恩爱斯-DNS.LA、西部数码
- Cloudflare、deSEC
- DNSPod.CN、DNSPod.COM
- Dynadot、Dynv6、Freemyip
- GoDaddy、Name.com、NameSilo
- Porkbun、Vercel

**功能特性：**
- 支持全功能自定义回调（Callback）
- 支持设置 BasicAuth
- Webhook 支持自定义 headers
- 内置常用免费 DNS 服务商设置模板（每步、No-IP、Dynv6、Dynu）

### 4. Web 服务

**官方特性：**
- 支持反向代理、重定向和 URL 跳转
- 支持 HTTP 基本认证
- 支持 IP 黑白名单模式
- 支持 UserAgent 黑白名单
- 规则日志清晰易懂
- 支持一键开关规则和定时开关规则
- 支持一键启用 HTTP3
- 快速构建静态网站
- 安全可靠，集成 CorazaWAF

### 5. 网络唤醒

**官方特性：**
- 支持远程控制唤醒和关机操作
- 支持接入第三方物联网平台（点灯科技、巴法云）
- 可通过各大平台的语音助手控制设备唤醒和关机

### 6. 计划任务

**官方特性：**
- 不依赖 Linux 系统的 Cron，支持 Windows 系统
- 操作简便，可视化编辑
- 可操作控制 Lucky 框架内的其他模块开关

### 7. ACME 自动证书

**官方特性：**
- 支持 ACME 自动证书的申请和续签
- 支持所有 DDNS 模块中的 DNS 服务商

---

## 📦 准备工作

### 1. 环境要求

- ✅ Docker 已安装（版本 20.10+）
- ✅ Docker Compose 已安装（版本 2.0+）
- ✅ 具备公网 IP（内网穿透需要）
- ✅ 域名（可选，DDNS 需要）

### 2. 网络要求

Lucky 使用 **host 网络模式**，需要注意：

- ⚠️ 端口不能与宿主机冲突
- ✅ 可以直接访问宿主机端口
- ✅ 性能最佳

### 3. 目录规划

```bash
/vol1/1000/docker/lucky/    # 配置目录
├── config.yaml             # 配置文件
├── rules/                  # 规则文件
└── logs/                   # 日志文件
```

### 4. 创建目录

```bash
# 创建配置目录
mkdir -p /vol1/1000/docker/lucky

# 设置权限
chmod -R 755 /vol1/1000/docker/lucky
```

---

## 🚀 部署步骤

### Step 1: 创建 Docker Compose 文件

创建配置文件：

```bash
cd /vol1/1000/docker/lucky
nano docker-compose.yml
```

### Step 2: 粘贴配置

将以下配置粘贴到文件中：

```yaml
services:
  lucky:
    image: gdy666/lucky
    container_name: lucky
    volumes:
      - /vol1/1000/docker/lucky:/goodluck
    network_mode: host
    restart: always
```

保存文件（Ctrl+O，Enter，Ctrl+X）。

### Step 3: 启动容器

```bash
# 拉取镜像
docker-compose pull

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f lucky
```

### Step 4: 访问 Web 界面

等待容器启动完成（约 10 秒），访问：

```
http://服务器IP:16601
```

**默认账号：**
- 用户名: `admin`
- 密码: 首次访问需要设置

⚠️ **首次访问会要求设置管理员密码，请设置强密码！**

---

## 📖 配置详解

### 网络模式说明

```yaml
network_mode: host
```

**Host 模式特点：**
- ✅ **性能最佳** - 无 NAT 损耗
- ✅ **直接访问** - 使用宿主机网络
- ✅ **端口映射简单** - 无需声明 ports
- ⚠️ **端口冲突** - 注意与宿主机端口冲突
- ⚠️ **安全性** - 相对桥接模式安全性较低

### 目录挂载

| 容器路径 | 宿主机路径 | 用途 |
|----------|------------|------|
| `/goodluck` | `/vol1/1000/docker/lucky` | 配置和数据 |

**存储内容：**
- 配置文件
- 规则数据
- 日志文件
- SSL 证书

### 默认端口

| 端口 | 用途 | 说明 |
|------|------|------|
| `16601` | Web 管理界面 | 可在配置中修改 |

---

## ⚙️ 功能配置

### 1. 端口转发配置

**进入 Web 界面** > **端口转发**

#### 添加转发规则

**示例 1: HTTP 服务转发**
```
名称: Web 服务
监听地址: 0.0.0.0
监听端口: 8080
目标地址: 192.168.1.100
目标端口: 80
协议: TCP
```

**示例 2: UDP 转发**
```
名称: DNS 服务
监听地址: 0.0.0.0
监听端口: 5353
目标地址: 192.168.1.1
目标端口: 53
协议: UDP
```

**示例 3: 范围端口转发**
```
监听端口: 10000-10100
目标端口: 10000-10100
协议: TCP
```

### 2. Stun 内网穿透配置

**进入 Web 界面** > **Stun 内网穿透**

⚠️ **注意：** Lucky 使用 Stun 协议进行内网穿透，适合于国内运营商级 NAT1 宽带网络。具体配置请参考官方文档。

### 3. DDNS 配置

**进入 Web 界面** > **DDNS**

#### Cloudflare DDNS

```
服务商: Cloudflare
API Token: your_cloudflare_api_token
Zone ID: your_zone_id
域名: home.yourdomain.com
记录类型: A (IPv4) / AAAA (IPv6)
TTL: 300
代理状态: 关闭
```

#### 阿里云 DDNS

```
服务商: 阿里云
AccessKey ID: your_access_key_id
AccessKey Secret: your_access_key_secret
域名: home.yourdomain.com
记录类型: A
```

#### 自定义 DDNS

```
更新 URL: https://api.example.com/update?ip={IP}
请求方法: GET / POST
请求头: Authorization: Bearer xxx
```

### 4. Web 服务配置

**进入 Web 界面** > **Web 服务**

#### 反向代理

```
监听地址: 0.0.0.0
监听端口: 80
域名: blog.yourdomain.com
后端地址: http://192.168.1.100:8080
HTTP 基本认证: 可选
IP 黑白名单: 可选
```

#### HTTPS 反向代理

```
监听地址: 0.0.0.0
监听端口: 443
域名: secure.yourdomain.com
后端地址: http://192.168.1.100:8080
SSL 证书: 使用 ACME 自动申请
```

#### 静态网站

```
监听端口: 80
静态文件目录: /goodluck/www
```

---

## 🎯 实用场景

### 场景 1: 家庭 NAS 外网访问

**需求：** 外网访问家中 NAS 的各种服务

**解决方案：**

1. **端口转发规则：**
```
Emby 影音服务:
  监听: 8096 → 目标: 192.168.1.100:8096
  
qBittorrent 下载器:
  监听: 6800 → 目标: 192.168.1.100:6800
  
NAS 管理界面:
  监听: 5000 → 目标: 192.168.1.100:5000
```

2. **DDNS 配置：**
```
域名: nas.yourdomain.com
更新间隔: 5 分钟
```

3. **访问方式：**
```
http://nas.yourdomain.com:8096  # Emby
http://nas.yourdomain.com:6800  # qBittorrent
http://nas.yourdomain.com:5000  # NAS 管理
```

### 场景 2: Web 服务统一管理

**需求：** 多个 Web 服务通过统一域名访问

**解决方案：**

**Web 服务配置：**

```
子域名反向代理:
- emby.yourdomain.com → 192.168.1.100:8096
- qb.yourdomain.com → 192.168.1.100:6800
- nas.yourdomain.com → 192.168.1.100:5000

启用功能:
- IP 白名单（仅允许特定 IP）
- HTTP 基本认证（用户名密码）
- CorazaWAF 防护
```

### 场景 3: 动态 IP 自动更新

**需求：** 家庭宽带公网 IP 经常变化

**解决方案：**

**DDNS 配置：**
```
服务商: Cloudflare
域名: home.yourdomain.com
更新间隔: 5 分钟
IP 获取方式: 自动检测
通知: 启用（IP 变化时通知）
```

---

## 🔧 常用操作

### 查看日志

```bash
# 实时日志
docker-compose logs -f lucky

# 最近 100 行
docker-compose logs --tail 100 lucky

# 容器内日志
docker exec lucky cat /goodluck/logs/lucky.log
```

### 重启服务

```bash
# 重启容器
docker-compose restart

# 或在 Web 界面
系统设置 > 重启服务
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
tar -czf lucky-backup-$(date +%Y%m%d).tar.gz /vol1/1000/docker/lucky

# 恢复配置
tar -xzf lucky-backup-20251116.tar.gz -C /
```

### 修改管理端口

编辑配置文件：

```bash
nano /vol1/1000/docker/lucky/config.yaml
```

修改端口：
```yaml
admin:
  port: 18888  # 修改为其他端口
```

重启容器生效：
```bash
docker-compose restart
```

---

## 🚨 常见问题

### Q1: 无法访问 Web 界面？

**解决方案：**
```bash
# 1. 检查容器状态
docker ps | grep lucky

# 2. 检查端口占用
netstat -tulpn | grep 16601

# 3. 检查防火墙
firewall-cmd --zone=public --add-port=16601/tcp --permanent
firewall-cmd --reload

# 4. 查看日志
docker-compose logs lucky
```

### Q2: 端口转发不生效？

**检查项：**
1. 目标服务是否正常运行
2. 监听地址是否正确（0.0.0.0 或具体 IP）
3. 防火墙规则是否允许
4. 目标端口是否被占用

**测试方法：**
```bash
# 测试目标端口
telnet 192.168.1.100 80

# 测试转发端口
telnet 服务器IP 8080
```

### Q3: DDNS 更新失败？

**可能原因：**
1. API Token 或密钥错误
2. 域名配置错误
3. 网络连接问题
4. IP 获取方式不正确

**解决方案：**
- 检查 API 凭证是否正确
- 验证域名是否已在 DNS 服务商添加
- 查看更新日志
- 手动测试 API 接口

### Q4: Stun 内网穿透使用问题？

**注意事项：**
- Lucky 使用 Stun 协议实现内网穿透
- 适合运营商级 NAT1 网络环境
- 具体配置方法请参考官方文档

**官方文档：** https://lucky666.cn/docs/intro

### Q5: Host 网络模式端口冲突？

**解决方案：**

**方式一：修改服务端口**
```bash
# 修改冲突服务的端口
# 例如修改 Nginx 端口
```

**方式二：使用桥接模式**
```yaml
services:
  lucky:
    # network_mode: host  # 注释掉
    ports:
      - "16601:16601"     # 添加端口映射
```

---

## ⚡ 性能优化

### 1. 限制资源使用

```yaml
services:
  lucky:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          memory: 128M
```

### 2. 日志管理

限制日志大小：

```yaml
services:
  lucky:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3. 定期清理

```bash
# 清理旧日志
find /vol1/1000/docker/lucky/logs -name "*.log" -mtime +30 -delete

# 添加定时任务
crontab -e
0 3 * * 0 find /vol1/1000/docker/lucky/logs -name "*.log" -mtime +30 -delete
```

---

## 🔐 安全建议

### 1. 修改默认端口

避免使用默认的 16601 端口：

```yaml
# 配置文件修改
admin:
  port: 28888
```

### 2. 强密码策略

- 管理员密码使用 16 位以上
- 包含大小写字母、数字、特殊字符
- 定期更换密码

### 3. 限制访问 IP

在防火墙中限制管理界面访问：

```bash
# 只允许内网访问
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" port port="16601" protocol="tcp" accept'
firewall-cmd --reload
```

### 4. HTTPS 访问

使用反向代理配置 HTTPS：

```nginx
server {
    listen 443 ssl;
    server_name lucky.yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://127.0.0.1:16601;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 5. 定期备份

```bash
# 每日备份脚本
#!/bin/bash
backup_dir="/backup/lucky"
mkdir -p $backup_dir
tar -czf $backup_dir/lucky-$(date +%Y%m%d).tar.gz /vol1/1000/docker/lucky

# 保留最近 7 天备份
find $backup_dir -name "lucky-*.tar.gz" -mtime +7 -delete
```

---

## 📊 规则管理

### 1. 规则操作

**Web 界面功能：**
- 一键开关规则
- 定时开关规则
- 查看规则日志
- 黑白名单设置

### 2. 日志查看

**官方支持的日志：**
- 端口转发访问日志
- Web 服务规则日志
- DDNS 更新日志
- 系统运行日志

⚠️ **注意：** 具体功能以 Web 界面实际显示为准

---

## 🎯 最佳实践

### 1. 规则命名规范

```
服务类型-设备-端口
例如: HTTP-NAS-8096
     SSH-Server-22
     Web-Blog-80
```

### 2. 端口规划

**建议端口分配：**
```
10000-19999: 内部服务
20000-29999: 外部访问
30000-39999: 临时服务
```

### 3. 备份策略

**重要数据：**
- 配置文件
- 转发规则
- SSL 证书
- DDNS 配置

**备份频率：**
- 每日增量备份
- 每周完整备份
- 异地备份

### 4. 安全加固

**多层防护：**
1. 修改默认端口
2. 强密码策略
3. IP 白名单
4. SSL/TLS 加密
5. 定期更新

---

## 🎉 总结

通过本教程，你已经成功部署了 Lucky 网络工具，实现了：

✅ **端口转发** - 公网 IPv6 转内网 IPv4  
✅ **Stun 内网穿透** - 无公网 IPv4 也能外网访问  
✅ **DDNS** - 自动更新动态 IP  
✅ **Web 服务** - 反向代理、静态网站、HTTP3  
✅ **ACME 证书** - 自动申请和续签 SSL 证书

### 下一步

- 🔧 配置常用端口转发规则
- 🌐 设置 DDNS 自动更新
- 🔐 配置 Stun 内网穿透
- 🌐 设置 Web 服务反向代理
- � 配置 ACME 自动证书

---

## 🔗 相关链接

- [Lucky GitHub](https://github.com/gdy666/lucky)
- [Lucky 官方文档](https://lucky666.cn/)
- [Lucky 功能介绍](https://lucky666.cn/docs/intro)
- [Cloudflare API 文档](https://api.cloudflare.com/)

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布

---

*让你的网络更 Lucky！如有问题欢迎在评论区讨论。*
