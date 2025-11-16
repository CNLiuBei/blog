---
title: VPS 一键重装系统脚本完整教程
date: 2025-11-16 15:30:00
categories:
  - 教程
  - 服务器运维
tags:
  - VPS
  - Linux
  - Windows
  - 系统重装
  - DD
description: 详细讲解如何使用 reinstall 脚本一键重装 VPS 系统，支持 Linux 和 Windows 互相重装，自动配置 IP，适合低配置服务器。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhetrv4zoyp5aDIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

在 VPS 使用过程中，经常需要更换操作系统。传统方式要么依赖服务商提供的模板，要么通过 IPMI/VNC 手动安装，费时费力。

**reinstall** 是一款强大的一键重装脚本，由 [bin456789](https://github.com/bin456789) 开发，具有以下特点：

- 🐧 **支持 19 种 Linux 发行版** - Debian、Ubuntu、CentOS、Alpine 等
- 🪟 **支持 Windows 系统** - 使用官方原版 ISO，自动安装驱动
- 🔄 **任意方向重装** - Linux ↔ Windows 互相转换
- 🌐 **自动配置 IP** - 智能识别静态/动态 IP，支持纯 IPv6
- 💾 **低内存要求** - 最低 256 MB，比官方 netboot 更省资源
- 🔒 **安全可靠** - 不含自制包，所有资源从官方镜像源获取

<!-- more -->

---

## 💡 核心特性

### 1. 支持的系统

**Linux 发行版：**
- Debian 9-13
- Ubuntu 16.04-25.10
- AlmaLinux、Rocky、Oracle Linux 8-10
- CentOS Stream 9-10
- Fedora 42-43
- openSUSE Leap、Tumbleweed
- Alpine 3.19-3.22
- Arch、Gentoo、Kali
- NixOS、openEuler
- 国产系统：Anolis、OpenCloudOS、安同 OS、飞牛 fnOS

**Windows 系统：**
- Windows Vista - 11
- Windows Server 2008 - 2025
- 支持 LTSC、评估版、Insider 预览版

### 2. 智能网络配置

- 自动识别静态/动态 IP
- 支持 `/32`、`/128` 特殊子网
- 支持网关不在子网范围内
- 支持纯 IPv6 网络
- 支持 IPv4/IPv6 在不同网卡

### 3. 硬件支持

- ✅ BIOS 和 EFI 引导
- ✅ ARM 服务器
- ✅ 自动安装各大云服务商驱动
  - VirtIO（阿里云、腾讯云、GCP）
  - XEN（AWS）
  - Intel 网卡驱动
  - Azure MANA 网卡

---

## 📦 系统要求

### 最低配置

| 目标系统 | 内存 | 硬盘 |
|----------|------|------|
| Alpine | 256 MB | 1 GB |
| Debian 9-13 | 256 MB | 1-1.5 GB |
| Ubuntu 16.04-25.10 | 512 MB | 2 GB |
| RHEL 系（Rocky/Alma/Oracle） | 512 MB | 5 GB |
| Windows Vista-8.1 | 512 MB | 25 GB |
| Windows 10-11 | 1 GB | 25 GB |

⚠️ **不支持：** OpenVZ、LXC 虚拟机

---

## 🚀 快速开始

### Step 1: 下载脚本

**Linux 系统下载：**

国外服务器：
```bash
curl -O https://raw.githubusercontent.com/bin456789/reinstall/main/reinstall.sh
```

国内服务器：
```bash
curl -O https://cnb.cool/bin456789/reinstall/-/git/raw/main/reinstall.sh
```

**Windows 系统下载：**

⚠️ 需先关闭 Windows Defender 实时保护

国外服务器：
```batch
certutil -urlcache -f -split https://raw.githubusercontent.com/bin456789/reinstall/main/reinstall.bat
```

国内服务器：
```batch
certutil -urlcache -f -split https://cnb.cool/bin456789/reinstall/-/git/raw/main/reinstall.bat
```

### Step 2: 使用方法

**Linux 下运行：**
```bash
bash reinstall.sh [参数]
```

**Windows 下运行：**
```batch
cmd
reinstall.bat [参数]
```

---

## 🐧 功能 1: 重装 Linux 系统

### 基本用法

```bash
# 安装 Debian 12
bash reinstall.sh debian 12

# 安装 Ubuntu 24.04 LTS
bash reinstall.sh ubuntu 24.04

# 安装 AlmaLinux 9
bash reinstall.sh almalinux 9

# 安装 Alpine 最新版
bash reinstall.sh alpine

# 安装 Arch Linux
bash reinstall.sh arch
```

### 支持的发行版

```bash
bash reinstall.sh anolis      7|8|23
                  rocky       8|9|10
                  oracle      8|9|10
                  almalinux   8|9|10
                  opencloudos 8|9|23
                  centos      9|10
                  fedora      42|43
                  nixos       25.05
                  debian      9|10|11|12|13
                  alpine      3.19|3.20|3.21|3.22
                  opensuse    15.6|16.0|tumbleweed
                  openeuler   20.03|22.03|24.03|25.09
                  ubuntu      16.04|18.04|20.04|22.04|24.04|25.10
                  kali
                  arch
                  gentoo
                  aosc
                  fnos
```

### 可选参数

**设置密码：**
```bash
bash reinstall.sh debian 12 --password "YourPassword123"
```

**使用 SSH 公钥：**
```bash
bash reinstall.sh ubuntu 24.04 --ssh-key "ssh-rsa AAAAB3..."
```

**从 GitHub 获取公钥：**
```bash
bash reinstall.sh alpine --ssh-key github:username
```

**修改 SSH 端口：**
```bash
bash reinstall.sh debian 12 --ssh-port 2222
```

**安装到环境但不重启：**
```bash
bash reinstall.sh ubuntu 24.04 --hold 1
```

**安装后不重启（用于修改系统）：**
```bash
bash reinstall.sh debian 12 --hold 2
```

### 实用示例

**1. 安装 Ubuntu 并设置公钥登录：**
```bash
bash reinstall.sh ubuntu 24.04 \
  --ssh-key github:yourusername \
  --ssh-port 22
```

**2. 安装 Debian 极简版：**
```bash
bash reinstall.sh debian 12 \
  --password "MyPass123" \
  --ssh-port 2222
```

**3. 安装 Alpine 到内存系统（不自动安装）：**
```bash
bash reinstall.sh alpine --hold 1
```

---

## 💾 功能 2: DD 镜像到硬盘

### 基本用法

**DD 原始镜像：**
```bash
bash reinstall.sh dd --img "https://example.com/image.raw.gz"
```

**支持的格式：**
- 未压缩：`.raw`、`.vhd`（固定大小）
- 压缩格式：`.gz`、`.xz`、`.zst`、`.tar.gz`、`.tar.xz`、`.tar.zst`

### DD Windows 镜像

```bash
bash reinstall.sh dd \
  --img "https://example.com/windows.vhd.gz" \
  --allow-ping \
  --rdp-port 3389
```

**可选参数：**
- `--allow-ping` - 允许 ICMP Ping
- `--rdp-port PORT` - 修改远程桌面端口

### DD Linux 镜像

```bash
bash reinstall.sh dd --img "https://example.com/debian.raw.xz"
```

⚠️ **注意：** DD Linux 镜像时，脚本不会修改镜像内容，需要自行配置 IP 和 SSH

---

## 🪟 功能 3: 安装 Windows ISO

### 方法 1: 自动查找 ISO

脚本会从 [massgrave.dev](https://massgrave.dev/genuine-installation-media) 自动查找官方 ISO。

**安装 Windows 11 企业版 LTSC 2024：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Enterprise LTSC 2024" \
  --lang zh-cn
```

**安装 Windows Server 2025：**
```bash
bash reinstall.sh windows \
  --image-name "Windows Server 2025 SERVERDATACENTER" \
  --lang zh-cn
```

**支持的语言：**
```
zh-cn (简体中文)
zh-tw (繁体中文)
en-us (英语)
ja-jp (日语)
ko-kr (韩语)
... 等 30+ 种语言
```

### 方法 2: 指定 ISO 链接

**使用官方下载链接：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Pro" \
  --iso "https://software.download.prss.microsoft.com/xxx.iso"
```

**使用磁力链接：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Enterprise LTSC 2024" \
  --iso "magnet:?xt=urn:btih:xxxxx"
```

### 可选参数

**设置管理员密码：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Pro" \
  --lang zh-cn \
  --password "Admin@123"
```

**允许 Ping 并修改 RDP 端口：**
```bash
bash reinstall.sh windows \
  --image-name "Windows Server 2025 SERVERDATACENTER" \
  --lang zh-cn \
  --allow-ping \
  --rdp-port 13389
```

**添加额外驱动：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Pro" \
  --lang zh-cn \
  --add-driver /path/to/driver.inf
```

### 如何查找映像名称

**常用映像名称：**
```
Windows 7 Ultimate
Windows 10 Pro
Windows 11 Pro
Windows 11 Enterprise LTSC 2024
Windows Server 2022 SERVERDATACENTER
Windows Server 2025 SERVERDATACENTER
```

**使用 DISM++ 查询：**
1. 下载 [DISM++](https://github.com/Chuyu-Team/Dism-Multi-language/releases)
2. 打开文件菜单 > 打开映像文件
3. 选择 ISO 文件
4. 查看映像名称列表

### ISO 下载站点

**官方下载：**
- <https://www.microsoft.com/software-download/windows10>
- <https://www.microsoft.com/software-download/windows11>
- <https://www.microsoft.com/evalcenter/download-windows-server-2025>

**第三方站点：**
- <https://massgrave.dev/genuine-installation-media>
- <https://next.itellyou.cn>
- <https://msdl.gravesoft.dev>

---

## 🔧 功能 4: 引导到 Alpine Live OS

临时进入 Alpine 内存系统，可用于备份、修复、手动 DD 等操作。

```bash
bash reinstall.sh alpine --hold 1
```

**可选参数：**
```bash
bash reinstall.sh alpine --hold 1 \
  --password "MyPass123" \
  --ssh-port 22 \
  --ssh-key github:username
```

**用途：**
- 💾 备份整个硬盘
- 🔧 修复分区表
- 📦 手动 DD 镜像
- 🔍 数据恢复

⚠️ **注意：** 此功能不会删除原系统，重启后可恢复

---

## 🌐 功能 5: 引导到 netboot.xyz

通过 netboot.xyz 可以安装更多系统。

```bash
bash reinstall.sh netboot.xyz
```

需要使用 VNC 或商家后台控制台手动操作。

支持的系统：
- BSD 系列（FreeBSD、OpenBSD、NetBSD）
- 其他 Linux 发行版
- 各种 Live CD

⚠️ **注意：** 此功能不会删除原系统，重启后可恢复

---

## 🎯 实用场景

### 场景 1: 低配 VPS 安装 Windows

**需求：** 512 MB 内存的 VPS 想安装 Windows 10

**解决方案：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 10 Pro" \
  --lang zh-cn \
  --password "Admin@123" \
  --allow-ping
```

### 场景 2: Linux 切换为 Windows Server

**需求：** 将 Ubuntu 服务器重装为 Windows Server 2025

**解决方案：**
```bash
bash reinstall.sh windows \
  --image-name "Windows Server 2025 SERVERDATACENTER" \
  --lang zh-cn \
  --rdp-port 3389 \
  --allow-ping
```

### 场景 3: Windows 切换为 Debian

**需求：** 将 Windows VPS 重装为 Debian 12

**解决方案：**
```batch
reinstall.bat debian 12 --password "MyPass123"
```

### 场景 4: DD 自定义镜像

**需求：** DD 预配置好的系统镜像

**解决方案：**
```bash
bash reinstall.sh dd --img "https://example.com/custom-debian.raw.gz"
```

### 场景 5: 纯 IPv6 网络安装

**需求：** 在纯 IPv6 网络环境安装系统

**解决方案：**
```bash
bash reinstall.sh ubuntu 24.04 --password "MyPass123"
```

脚本会自动检测并配置 IPv6

### 场景 6: ARM 服务器安装 Windows

**需求：** ARM 架构服务器安装 Windows 11

**解决方案：**
```bash
bash reinstall.sh windows \
  --image-name "Windows 11 Pro" \
  --lang zh-cn \
  --iso "https://software.download.prss.microsoft.com/xxx.iso"
```

**兼容性：**
- ✅ Azure ARM (B2pts_v2)
- ✅ 阿里云 ARM (g6r, c6r, g8y)
- ✅ AWS ARM (T4g)
- ✅ Scaleway ARM
- ⚠️ 甲骨文云 ARM（需手动加载显卡驱动）
- ❌ 谷歌云 ARM（缺少网卡驱动）

---

## 📊 监控安装进度

### 方法 1: SSH 连接

安装期间可以通过 SSH 连接查看进度：

```bash
ssh root@服务器IP
```

### 方法 2: Web 界面

浏览器访问：
```
http://服务器IP
```

可以看到安装日志

### 方法 3: VNC 控制台

使用商家提供的 VNC 控制台查看

### 方法 4: 串行控制台

通过商家提供的串行控制台查看

---

## 🚨 常见问题

### Q1: 安装失败如何救砖？

**解决方案：**

1. 连接 SSH（安装环境仍可用）
2. 运行救砖命令：
```bash
/trans.sh alpine
```
自动重装为 Alpine 系统

### Q2: Windows 安装后无法 RDP？

**可能原因：**
1. 防火墙阻止
2. RDP 端口错误
3. 网络配置未生效

**解决方案：**
- 等待 5-10 分钟（静态 IP 需要时间生效）
- 检查是否使用了 `--allow-ping` 和 `--rdp-port`
- 使用用户名 `.\administrator` 登录

### Q3: 如何查询 Windows 映像名称？

**解决方案：**

使用 DISM++ 工具：
1. 打开 DISM++
2. 文件 > 打开映像文件
3. 选择 ISO
4. 查看映像列表

或者先随便填写，脚本会在 SSH 中提示正确的名称

### Q4: 低内存机器安装 Windows 失败？

**解决方案：**

使用 DD 方式安装：
1. 先在本地或其他机器制作 Windows VHD 镜像
2. 压缩并上传到网络
3. 使用 DD 功能安装

### Q5: 纯 IPv6 网络能用吗？

**可以！** 脚本完全支持纯 IPv6 网络，会自动配置。

### Q6: 如何使用旧版本脚本？

**解决方案：**

从 [GitHub Commits](https://github.com/bin456789/reinstall/commits/main) 找到旧版本的 commit ID：

```bash
commit_id=xxxxxxx
curl -O https://raw.githubusercontent.com/bin456789/reinstall/$commit_id/reinstall.sh
sed -i "/^confhome.*main$/s/main/$commit_id/" reinstall.sh
bash reinstall.sh debian 12
```

---

## ⚡ 高级技巧

### 1. 使用 frpc 内网穿透

适合无公网 IP 的机器：

```bash
bash reinstall.sh debian 12 \
  --password "MyPass123" \
  --frpc-toml /path/to/frpc.toml
```

### 2. 仅重启到安装环境

验证网络连通性：

```bash
bash reinstall.sh ubuntu 24.04 --hold 1
```

### 3. 安装后不重启

修改系统内容：

```bash
bash reinstall.sh debian 12 --hold 2
```

系统挂载在 `/target`（Debian/Kali）或 `/os`（其他系统）

### 4. Ubuntu 极简安装

减少预装软件：

```bash
bash reinstall.sh ubuntu 24.04 --minimal
```

### 5. 添加多个 SSH 公钥

```bash
bash reinstall.sh debian 12 \
  --ssh-key "ssh-rsa AAAAB3..." \
  --ssh-key "ssh-ed25519 AAAAC3..."
```

---

## 🔒 安全建议

### 1. 使用强密码

```bash
bash reinstall.sh debian 12 --password "Str0ng!P@ssw0rd#2024"
```

### 2. 使用 SSH 公钥

```bash
bash reinstall.sh ubuntu 24.04 --ssh-key github:username
```

### 3. 修改 SSH 端口

```bash
bash reinstall.sh debian 12 --ssh-port 2222
```

### 4. 安装后立即更新

```bash
# Debian/Ubuntu
apt update && apt upgrade -y

# RHEL 系
dnf update -y

# Windows
# 运行 Windows Update
```

### 5. 配置防火墙

```bash
# Ubuntu/Debian
ufw enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
```

---

## 🎉 总结

**reinstall** 脚本提供了强大的 VPS 系统重装能力：

✅ **19 种 Linux 发行版** - 一键安装  
✅ **Windows 全系列** - 官方 ISO，自动驱动  
✅ **任意方向转换** - Linux ↔ Windows  
✅ **自动网络配置** - 静态/动态 IP，IPv6  
✅ **低内存友好** - 256 MB 起步  
✅ **救砖功能** - 安装失败也能恢复

### 适用场景

- 🏠 更换 VPS 操作系统
- 🔧 修复损坏的系统
- 💾 DD 自定义镜像
- 🌐 测试不同系统
- 🖥️ ARM 服务器安装 Windows

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/bin456789/reinstall)
- [问题反馈](https://github.com/bin456789/reinstall/issues)
- [Telegram 群组](https://t.me/reinstall_os)
- [Windows ISO 下载](https://massgrave.dev/genuine-installation-media)

---

## 📝 更新日志

- **2025-11-16** - 初始版本发布

---

*让 VPS 系统重装变得简单！如有问题欢迎在评论区讨论。*
