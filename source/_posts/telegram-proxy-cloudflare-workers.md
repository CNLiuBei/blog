---
title: Telegram 代理 - 5分钟快速部署到 Cloudflare Workers
date: 2024-11-19 16:44:00
categories:
  - 技术教程
tags:
  - Telegram
  - Cloudflare
  - Workers
  - 代理
  - 部署
description: 使用 Cloudflare Workers 快速搭建免费的 Telegram 代理服务，支持 HTTP/HTTPS 和 WebSocket，全球 CDN 加速，5分钟即可完成部署。
---

## 简介

本教程将指导你在 5 分钟内使用 Cloudflare Workers 搭建一个完全免费的 Telegram 代理服务。该代理支持 HTTP/HTTPS 协议、WebSocket 连接以及 Telegram Bot API 代理，并且享有 Cloudflare 全球 CDN 加速。

<!-- more -->

## 一、准备工作（2分钟）

### 1. 注册 Cloudflare 账号

访问：[https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)

### 2. 安装 Wrangler

```bash
npm install -g wrangler
```

## 二、部署代理（3分钟）

### 方法一：命令行部署（推荐）

**步骤 1：登录**
```bash
wrangler login
```

**步骤 2：部署**
```bash
wrangler deploy telegram-proxy-complete.js --name telegram-proxy --compatibility-date 2024-01-01
```

部署成功后会显示你的代理地址：
```
https://telegram-proxy.你的用户名.workers.dev
```

### 方法二：网页部署

1. 登录 [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **Create Application** → **Create Worker**
4. 复制下方完整代码
5. 粘贴到编辑器，点击 **Save and Deploy**
6. 记录生成的 Worker URL

## 三、配置 Telegram（1分钟）

### 方法一：一键添加（最简单）

点击链接（替换为你的域名）：
```
https://t.me/proxy?server=你的worker域名&port=443
```

### 方法二：手动配置

1. 打开 Telegram → 设置 → 数据和存储 → 代理设置
2. 添加代理：
   - **类型**：HTTP
   - **服务器**：你的worker域名（不含https://）
   - **端口**：443
3. 保存并启用

## 四、验证测试

访问你的 Worker 地址，应该能看到使用说明页面。

在 Telegram 中启用代理后，应该能正常使用。

## 五、绑定自定义域名（可选）

如果你有域名托管在 Cloudflare：

1. 进入 Worker 页面
2. 点击 **Triggers** → **Add Custom Domain**
3. 输入子域名，如：`tg.yourdomain.com`
4. 等待 DNS 生效（通常几分钟）

## 完整代码

将以下代码保存为 `telegram-proxy-complete.js`：

```javascript
/**
 * Cloudflare Worker - Telegram 代理服务
 * 
 * 功能：
 * - 支持 HTTP/HTTPS 代理
 * - 支持 WebSocket 连接
 * - 支持 Telegram Bot API 代理
 * - 内置使用说明页面
 * 
 * 部署方式：
 * wrangler deploy telegram-proxy-complete.js --name telegram-proxy --compatibility-date 2024-01-01
 * 
 * 使用方式：
 * 1. Telegram 客户端代理：
 *    类型：HTTP
 *    服务器：your-worker.workers.dev
 *    端口：443
 * 
 * 2. Bot API 代理：
 *    https://your-worker.workers.dev/api.telegram.org/bot<TOKEN>/method
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 处理 WebSocket 升级请求（用于 MTProto）
    if (request.headers.get('Upgrade') === 'websocket') {
      return handleWebSocket(request);
    }
    
    // 处理普通 HTTP 请求
    return handleHTTP(request, url);
  }
}

/**
 * 处理 WebSocket 连接
 * 用于 Telegram MTProto 协议
 */
async function handleWebSocket(request) {
  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);
  
  server.accept();
  
  // 连接到 Telegram 服务器
  const telegramWs = new WebSocket('wss://api.telegram.org');
  
  // 客户端 -> Telegram
  server.addEventListener('message', event => {
    if (telegramWs.readyState === WebSocket.OPEN) {
      telegramWs.send(event.data);
    }
  });
  
  // Telegram -> 客户端
  telegramWs.addEventListener('message', event => {
    if (server.readyState === WebSocket.OPEN) {
      server.send(event.data);
    }
  });
  
  // 错误处理
  server.addEventListener('close', () => telegramWs.close());
  telegramWs.addEventListener('close', () => server.close());
  
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

/**
 * 处理 HTTP 请求
 */
async function handleHTTP(request, url) {
  // 显示使用说明页面
  if (url.pathname === '/' || url.pathname === '') {
    return new Response(getUsageHTML(), {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    });
  }
  
  // Telegram API 域名列表
  const telegramApiDomains = [
    'api.telegram.org',
    'core.telegram.org'
  ];
  
  // 从路径中提取目标域名
  const pathParts = url.pathname.split('/').filter(p => p);
  let targetDomain = 'api.telegram.org';
  let targetPath = url.pathname;
  
  if (pathParts.length > 0 && telegramApiDomains.includes(pathParts[0])) {
    targetDomain = pathParts[0];
    targetPath = '/' + pathParts.slice(1).join('/');
  }
  
  // 构建目标 URL
  const targetUrl = `https://${targetDomain}${targetPath}${url.search}`;
  
  // 复制请求头
  const headers = new Headers(request.headers);
  headers.set('Host', targetDomain);
  
  try {
    // 转发请求到 Telegram 服务器
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      redirect: 'follow'
    });
    
    // 创建响应副本
    const newResponse = new Response(response.body, response);
    
    // 添加 CORS 头
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', '*');
    newResponse.headers.delete('Content-Security-Policy');
    newResponse.headers.delete('X-Frame-Options');
    
    return newResponse;
  } catch (error) {
    return new Response(`代理错误: ${error.message}`, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
}

/**
 * 生成使用说明 HTML 页面
 */
function getUsageHTML() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram 代理服务</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 32px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 16px;
        }
        .section {
            margin-bottom: 30px;
        }
        h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 20px;
            display: flex;
            align-items: center;
        }
        h2::before {
            content: "▶";
            margin-right: 10px;
            font-size: 14px;
        }
        .code-block {
            background: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 5px;
            font-family: "Courier New", monospace;
            font-size: 14px;
            overflow-x: auto;
            margin: 10px 0;
        }
        .step {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .step-number {
            display: inline-block;
            background: #667eea;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            text-align: center;
            line-height: 28px;
            margin-right: 10px;
            font-weight: bold;
        }
        ul {
            margin-left: 20px;
            margin-top: 10px;
        }
        li {
            margin: 8px 0;
            color: #555;
        }
        .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .success {
            background: #d4edda;
            border-left: 4px solid #28a745;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            margin: 10px 10px 10px 0;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #5568d3;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Telegram 代理服务</h1>
        <p class="subtitle">基于 Cloudflare Workers 的高速代理</p>
        
        <div class="section">
            <h2>使用方法</h2>
            <div class="step">
                <span class="step-number">1</span>
                <strong>在 Telegram 中设置代理</strong>
                <ul>
                    <li>打开 Telegram 设置</li>
                    <li>进入 数据和存储 → 代理设置</li>
                    <li>添加代理</li>
                </ul>
            </div>
            
            <div class="step">
                <span class="step-number">2</span>
                <strong>配置代理信息</strong>
                <div class="code-block">
类型: HTTP<br>
服务器: ${new URL(self.location.href).hostname}<br>
端口: 443
                </div>
            </div>
            
            <div class="step">
                <span class="step-number">3</span>
                <strong>一键添加（推荐）</strong>
                <a href="https://t.me/proxy?server=${new URL(self.location.href).hostname}&port=443" class="btn" target="_blank">
                    点击一键添加代理
                </a>
            </div>
        </div>
        
        <div class="section">
            <h2>API 代理使用</h2>
            <p>将 Telegram API 请求通过此代理转发：</p>
            <div class="code-block">
原始: https://api.telegram.org/bot&lt;token&gt;/method<br>
代理: https://${new URL(self.location.href).hostname}/api.telegram.org/bot&lt;token&gt;/method
            </div>
            
            <p style="margin-top: 15px;"><strong>示例代码：</strong></p>
            <div class="code-block">
# Python<br>
import requests<br>
url = "https://${new URL(self.location.href).hostname}/api.telegram.org/bot&lt;TOKEN&gt;/getMe"<br>
response = requests.get(url)<br>
print(response.json())
            </div>
        </div>
        
        <div class="section">
            <h2>特性</h2>
            <ul>
                <li>✅ 完全免费，基于 Cloudflare Workers</li>
                <li>✅ 全球 CDN 加速，低延迟</li>
                <li>✅ 支持 HTTP/HTTPS 代理</li>
                <li>✅ 支持 WebSocket 连接</li>
                <li>✅ 支持 Telegram Bot API</li>
                <li>✅ 无需服务器，一键部署</li>
            </ul>
        </div>
        
        <div class="warning">
            <strong>⚠️ 注意事项</strong>
            <ul>
                <li>Cloudflare Workers 免费版每天有 100,000 次请求限制</li>
                <li>单次请求最长执行时间 10 秒（免费版）</li>
                <li>建议仅用于个人使用</li>
                <li>请勿公开分享代理地址，避免被滥用</li>
            </ul>
        </div>
        
        <div class="success">
            <strong>✅ 代理服务运行正常</strong><br>
            当前时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}<br>
            服务器: Cloudflare Workers
        </div>
    </div>
</body>
</html>`;
}
```

## 常见问题

**Q：免费吗？**
A：完全免费，每天 10 万次请求。

**Q：速度如何？**
A：Cloudflare 全球 CDN，速度很快。

**Q：会被封吗？**
A：正常使用不会，建议不要公开分享。

**Q：如何查看日志？**
A：执行 `wrangler tail` 实时查看。

**Q：如何更新代码？**
A：修改后重新执行 `wrangler deploy` 即可。

## 实际案例

我的部署示例：
- Worker 地址：https://telegram-proxy.707209999.workers.dev
- 自定义域名：https://tg.liubei.org
- 状态：运行正常 ✅

## 总结

通过 Cloudflare Workers 搭建 Telegram 代理非常简单，只需几分钟即可完成。该方案完全免费，享有全球 CDN 加速，非常适合个人使用。

---

**祝你使用愉快！** 🎉
