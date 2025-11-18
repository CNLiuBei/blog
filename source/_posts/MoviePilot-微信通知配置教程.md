---


title: MoviePilot 微信通知配置完整教程（含内网穿透）
date: 2025-11-18 17:46:00
categories:
  - 教程
  - 影音管理
tags:
  - MoviePilot
  - 微信通知
  - 企业微信
  - frp
  - 内网穿透
description: 详细讲解如何为 MoviePilot 配置微信通知功能，包括在内网环境下使用 frp 穿透，实现订阅、下载、入库等消息的实时推送到微信。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0m000d7w33gn1e2tfjqia4lDIYvDIDvDqYzDcxPAda0DY==.png

---

## 📖 前言

MoviePilot 支持多种消息通知渠道，其中**微信通知**是最便捷、最实用的方式之一。通过企业微信应用，你可以实时接收：

- 🎬 **订阅通知** - 新剧集订阅成功提醒
- 📥 **下载通知** - 资源下载开始/完成通知
- 📂 **入库通知** - 媒体整理入库提醒
- ⚠️ **错误告警** - 系统异常及时推送
- 📊 **站点签到** - 每日签到结果通知

本文将详细介绍如何配置 MoviePilot 的微信通知功能，无论你的服务是部署在公网服务器还是本地家庭网络，都能轻松完成配置。

<!-- more -->

---

## 💡 核心流程

微信通知（特别是接收指令，如手动搜刮）依赖于企业微信服务器能主动访问到你的 MoviePilot 服务。 

- **如果你的 MoviePilot 部署在有公网 IP 的服务器上**：可以直接配置，跳到 [**步骤二**](#-步骤二-注册与配置企业微信)。
- **如果你的 MoviePilot 部署在本地网络（如NAS、个人电脑）**：你需要一个内网穿透方案，让企业微信能通过公网访问到你的本地服务。**本文将重点介绍使用 FRP 的方案**。

--- 

## 🚀 步骤一：搭建内网穿透与消息代理（本地部署用户必看）

本步骤旨在通过一台有公网 IP 的服务器，将企业微信的消息转发到你本地的 MoviePilot。

### 1. 环境准备

- 一台拥有公网 IPv4 地址的服务器。
- 服务器上已安装 Docker 环境。
- 本地运行 MoviePilot 的设备。

### 2. 在服务器上部署 frps (服务端)

在你的公网服务器上，创建 `frps.toml` 配置文件：

```toml
# frps.toml
bindPort = 10010
transport.tls.force = true
auth.token = "123456" # 自定义一个复杂的token

# Server Dashboard，可以查看frp服务状态以及统计信息
webServer.addr = "0.0.0.0"
webServer.port = 10011
webServer.user = "admin"
webServer.password = "admin" # 建议修改为复杂的密码
```

使用 Docker 运行 frps：

```bash
docker run --restart=always --network host -d -v /path/to/your/frps.toml:/etc/frp/frps.toml --name frps fatedier/frps:latest
```
> 注意替换 `/path/to/your/frps.toml` 为你实际的配置文件路径。

### 3. 在服务器上部署微信消息代理服务

为了处理企业微信的消息格式，我们需要一个代理服务。这里使用 `ddsderek/wxchat` 镜像。

创建 `docker-compose.yml` 文件：

```yaml
services:
  wxchat:
    container_name: wxchat
    restart: always
    ports:
      - '6080:80' # 6080 为示例公网端口，请确保服务器防火墙已放行
    image: 'ddsderek/wxchat:latest'
```

在 `docker-compose.yml` 所在目录执行 `docker-compose up -d` 启动服务。

启动后，访问 `http://<你的服务器IP>:6080`，如果看到以下页面，则表示代理服务搭建成功。

![微信消息代理服务](https://vip.123pan.cn/1821322860/ymjew503t0l000d7w32xinpk3faubdl4DIYvDIDvDqYzDcxPAda0DY==.png)

### 4. 在本地部署 frpc (客户端)

在运行 MoviePilot 的本地设备上，创建 `frpc.toml` 配置文件：

```toml
# frpc.toml
serverAddr = "<你的服务器IP>"
serverPort = 10010
transport.tls.enable = true
auth.token = "123456" # 与frps的token保持一致
loginFailExit = false

[[proxies]]
name = "MoviePilot-wechat"
type = "tcp"
localIP = "127.0.0.1" # 指向本地MoviePilot服务
localPort = 3000 # MoviePilot的默认端口
remotePort = 13000 # 穿透到公网服务器的端口，确保不被占用
```
> 注意将 `<你的服务器IP>` 替换为你的公网服务器 IP。

使用 Docker 运行 frpc：

```bash
docker run --restart=always --network host -d -v /path/to/your/frpc.toml:/etc/frp/frpc.toml --name frpc fatedier/frpc:latest
```
> 同样，注意替换配置文件路径。

至此，内网穿透和代理已配置完成。现在，访问 `http://<你的服务器IP>:13000` 应该能看到你的 MoviePilot 界面。

---

## 🚀 步骤二：注册与配置企业微信

### 1. 注册企业微信

访问 [企业微信官网](https://work.weixin.qq.com/) 注册一个企业。个人也可以注册，企业名称随意填写，行业类型和人员规模选择“其他”和“1-50人”即可。

注册完成后，记录下 **我的企业 -> 企业信息** 最下方的 **企业ID**。

![企业ID位置](https://vip.123pan.cn/1821322860/ymjew503t0n000d7w32yeau7ku68r9hiDIYvDIDvDqYzDcxPAda0DY==.png)

### 2. 创建自建应用

1. 登录企业微信管理后台，进入 **应用管理 -> 应用 -> 自建 -> 创建应用**。
2. 上传一个应用logo，填写应用名称（如 `MoviePilot`），可见范围选择根部门。
3. 创建成功后，进入应用详情页，记录 **`AgentId`** 和 **`Secret`**。

![AgentId和Secret](https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhrcewy7nhrx6DIYvDIDvDqYzDcxPAda0DY==.png)

### 3. 设置应用API接收消息

这是最关键的一步，让企业微信能将消息发送给你的代理服务。

1. 在应用管理页面，找到 **功能 -> 接收消息 -> 设置API接收**。
2. **URL** 填写格式：`http://<你的服务器IP>:<wxchat代理端口>/api/v1/message/?token=<回调Token>`
   - `<你的服务器IP>`: 你的公网服务器 IP。
   - `<wxchat代理端口>`: 前面部署 `wxchat` 容器时映射的公网端口，示例中是 `6080`。
   - `<回调Token>`: 这是一个自定义的 `Token`，**需要与后续在 MoviePilot 中填写的 `回调Token` 保持一致**。可以随机生成，例如 `a1b2c3d4`。
   - **示例**: `http://123.45.67.89:6080/api/v1/message/?token=a1b2c3d4`
3. **Token** 和 **EncodingAESKey**：点击 **随机获取**，生成后复制保存这两项。它们也需要在 MoviePilot 中填写。

> **⚠️ 注意**：此时不要点击“保存”。你需要先完成下面的 MoviePilot 配置，否则企业微信服务器无法验证URL，会导致保存失败。

---

## 🚀 步骤三：配置 MoviePilot

1. 登录 MoviePilot，进入 **设置 -> 通知 -> 企业微信**。
2. 填写所有配置信息：

| 配置项 | 来源说明 | 示例值 |
| :--- | :--- | :--- |
| **企业 ID** | 企业微信后台 -> 我的企业 | `ww1234567890abcdef` |
| **应用 Secret** | 自建应用的 Secret | `xxxxxxxxxxxxxxxxxxxxx` |
| **应用 AgentId** | 自建应用的 AgentId | `1000001` |
| **接收用户** | 成员的 UserID（通讯录里查看，`@all`代表所有人） | `@all` |
| **回调Token** | **上一步在API接收URL中自定义的Token** | `a1b2c3d4` |
| **回调EncodingAESKey** | **上一步API接收设置里随机生成的EncodingAESKey** | `xxxxxxxxxxxxxxxxxxxxx` |

填写完成如下图所示：

![MoviePilot企业微信配置](https://vip.123pan.cn/1821322860/yk6baz03t0l000d7w33fwl4s7sch5uduDIYvDIDvDqYzDcxPAda0DY==.png)

3. 填写完毕后，点击 **保存**。

---

## 🚀 步骤四：完成验证并测试

1. 在 MoviePilot 中保存配置后，回到企业微信的 **设置API接收** 页面，点击 **保存**。由于 MoviePilot 已经启动并配置好，此时应该能顺利通过验证。
2. 回到 MoviePilot 的通知设置页面，点击 **测试** 按钮。
3. 检查你的企业微信手机端是否收到了测试消息。如果收到，恭喜你，大功告成！🎉

---

## 🚨 常见问题

### Q1: 企业微信API接收URL保存失败？

**A:** 这是最常见的问题。请按顺序检查：
1. 确保 MoviePilot 已经填写完所有企业微信配置并已保存。
2. 检查服务器防火墙/安全组是否放行了 `frps` 的端口 (`10010`)、`frpc` 的远程端口 (`13000`) 以及 `wxchat` 的代理端口 (`6080`)。
3. 确认 `frps` 和 `frpc` 服务都正常运行，并且连接成功（可以在 frps 的后台面板 `http://<服务器IP>:10011` 查看）。
4. 确认 `wxchat` 代理服务正常，访问 `http://<服务器IP>:6080` 能看到 `{"msg":"ok"}`。
5. 检查回调 URL 格式是否完全正确，特别是 `token` 参数。

### Q2: MoviePilot 测试成功，但收不到自动通知？

**A:** 
1. 检查是否在手机端企业微信APP的 **工作台** 中关注了你创建的应用。
2. 检查 MoviePilot 的日志，看是否有发送通知的记录和错误信息。
3. 确认应用可见范围包含了接收消息的成员。

### Q3: Secret 或 Token 忘记了怎么办？

**A:** 
- **应用 Secret**: 可以在企业微信后台应用详情页重新查看。
- **回调Token/EncodingAESKey**: 可以在API接收设置页面查看。如果忘记，可以重新生成，但 MoviePilot 中也必须同步修改。

--- 

*如有其他问题欢迎在评论区讨论！*
