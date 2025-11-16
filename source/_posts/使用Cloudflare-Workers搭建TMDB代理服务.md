---
title: 使用 Cloudflare Workers 搭建 TMDB API 代理服务
date: 2025-11-16 14:20:00
categories:
  - 教程
  - 云服务
tags:
  - Cloudflare
  - Workers
  - TMDB
  - 代理
  - API
description: 详细讲解如何使用 Cloudflare Workers 搭建一个高性能的 TMDB API 代理服务，解决跨域问题，实现图片缓存优化。
cover: https://vip.123pan.cn/1821322860/yk6baz03t0l000d7w33fwcoggy45pw9oDIYvDIDvDqYzDcxPAda0DY==.png
---

## 📖 前言

TMDB (The Movie Database) 是一个免费的电影数据库 API，但在使用时经常遇到：

- 🌍 国内访问不稳定
- 🔒 CORS 跨域限制
- 🔑 API Key 暴露风险
- 🖼️ 图片加载缓慢

本文介绍如何用 **Cloudflare Workers** 搭建高性能代理，完美解决这些问题。

<!-- more -->

---

## 💡 方案特性

✅ 智能代理 - 自动区分 API 和图片请求  
✅ CORS 支持 - 完美解决跨域  
✅ Key 隐藏 - 后端自动注入  
✅ 图片缓存 - CDN 加速访问  
✅ 错误重试 - 自动重试失败请求  
✅ 全球加速 - Cloudflare 全球节点

---

## 🚀 快速部署

### Step 1: 获取 TMDB API Key

1. 访问 [TMDB 官网](https://www.themoviedb.org/) 注册
2. 进入 **设置 > API** 申请 API Key
3. 选择 **Developer** 类型（免费）

### Step 2: 创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择 **Workers & Pages** > **Create Application**
3. 选择 **Create Worker**，命名为 `tmdb-proxy`

### Step 3: 粘贴代码

将以下代码粘贴到编辑器：

```javascript
export default {
  async fetch(request, env, ctx) {
    const TMDB_KEY = env.TMDB_KEY;


    // 验证 API Key 是否配置
    if (!TMDB_KEY) {
      return new Response(JSON.stringify({
        error: "Configuration Error",
        message: "TMDB_KEY is not configured. Please set it in Worker environment variables.",
        docs: "https://developers.cloudflare.com/workers/configuration/secrets/"
      }), {
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }


    // 处理 CORS 预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }


    const url = new URL(request.url);
    const isImage = url.pathname.startsWith("/t/p/");
    const targetHost = isImage ? "image.tmdb.org" : "api.themoviedb.org";


    const targetUrl = new URL(request.url);
    targetUrl.hostname = targetHost;
    targetUrl.protocol = "https:";


    // 自动添加 TMDB Key（API 请求）
    if (!isImage && !targetUrl.searchParams.has("api_key")) {
      targetUrl.searchParams.set("api_key", TMDB_KEY);
    }


    const headers = new Headers(request.headers);
    headers.set("User-Agent", "Cloudflare-TMDB-Proxy/1.0");
    headers.set("Accept-Encoding", "identity");


    const newRequest = new Request(targetUrl.toString(), {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? request.clone().body : null,
      redirect: "follow",
    });


    // 优化的重试机制：只重试可恢复的错误
    async function fetchWithRetry(req, retries = 2) {
      try {
        const response = await fetch(req);
        // 只对 5xx 服务器错误和 429 限流进行重试
        if ((response.status >= 500 || response.status === 429) && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await fetchWithRetry(req, retries - 1);
        }
        return response;
      } catch (e) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return await fetchWithRetry(req, retries - 1);
        }
        return new Response("TMDB Proxy Error: " + e.message, { status: 502 });
      }
    }


    if (isImage) {
      // 创建规范化的缓存键（忽略不同的请求头，提高命中率）
      const cacheUrl = new URL(request.url);
      const cacheKey = new Request(cacheUrl.toString(), {
        method: "GET",
        headers: new Headers({
          "Accept": "image/*"
        })
      });


      // 查 Workers Cache
      let cached = await caches.default.match(cacheKey);
      if (cached) {
        // 缓存命中，添加标记
        const headers = new Headers(cached.headers);
        headers.set("X-Cache", "HIT");
        headers.set("X-Cache-Source", "Cloudflare-Workers");
        return new Response(cached.body, {
          status: cached.status,
          headers: headers
        });
      }


      // 从 TMDB 获取图片
      const resp = await fetchWithRetry(newRequest);


      // 如果响应不成功，直接返回错误，不缓存
      if (!resp.ok) {
        const errorHeaders = new Headers(resp.headers);
        errorHeaders.set("Access-Control-Allow-Origin", "*");
        return new Response(resp.body, { 
          status: resp.status, 
          headers: errorHeaders 
        });
      }


      const respBuffer = await resp.arrayBuffer();
      const contentType = resp.headers.get("Content-Type") || "image/jpeg";


      const respHeaders = new Headers({
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=604800, immutable",
        "X-Content-Type-Options": "nosniff",
        "X-Cache": "MISS",
        "X-Cache-Source": "TMDB-Origin",
      });


      const finalResp = new Response(respBuffer, { 
        status: resp.status, 
        headers: respHeaders 
      });


      // 异步缓存到 Worker Cache（使用规范化的缓存键）
      ctx.waitUntil(caches.default.put(cacheKey, finalResp.clone()));


      return finalResp;
    }


    // API 请求直接走代理
    const apiResp = await fetchWithRetry(newRequest);


    const apiHeaders = new Headers(apiResp.headers);
    apiHeaders.set("Access-Control-Allow-Origin", "*");
    apiHeaders.set("Access-Control-Allow-Headers", "*");
    apiHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    apiHeaders.set("X-Cache", "BYPASS");
    apiHeaders.set("X-Cache-Source", "TMDB-API");
    
    // 根据状态码设置不同的缓存策略
    if (apiResp.ok) {
      apiHeaders.set("Cache-Control", "public, max-age=3600");
    } else {
      apiHeaders.set("Cache-Control", "no-cache");
    }


    return new Response(apiResp.body, { 
      status: apiResp.status, 
      headers: apiHeaders 
    });
  },
};
```

### Step 4: 配置环境变量

1. 点击 **Settings** > **Variables**
2. 添加变量：
   - Name: `TMDB_KEY`
   - Value: 你的 API Key
   - Type: **Secret**
3. 点击 **Deploy** 部署

---

## 🎯 使用示例

### JavaScript

```javascript
const PROXY = 'https://tmdb-proxy.你的用户名.workers.dev';

// 搜索电影
async function searchMovies(query) {
  const res = await fetch(`${PROXY}/3/search/movie?query=${query}&language=zh-CN`);
  return await res.json();
}

// 获取海报
function getPoster(path, size = 'w500') {
  return `${PROXY}/t/p/${size}${path}`;
}

// 使用
searchMovies('盗梦空间').then(data => {
  console.log(data.results);
});
```

### React

```jsx
import { useState, useEffect } from 'react';

function MovieSearch() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const PROXY = 'https://tmdb-proxy.你的用户名.workers.dev';

  useEffect(() => {
    if (!query) return;
    
    const timer = setTimeout(async () => {
      const res = await fetch(
        `${PROXY}/3/search/movie?query=${query}&language=zh-CN`
      );
      const data = await res.json();
      setMovies(data.results || []);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {movies.map(m => (
        <div key={m.id}>
          <img src={`${PROXY}/t/p/w200${m.poster_path}`} alt={m.title} />
          <h3>{m.title}</h3>
        </div>
      ))}
    </>
  );
}
```

---

## 📖 核心功能解析

### 1. 智能路由

```javascript
const isImage = url.pathname.startsWith("/t/p/");
const targetHost = isImage ? "image.tmdb.org" : "api.themoviedb.org";
```

自动识别请求类型，路由到正确的服务器。

### 2. API Key 注入

```javascript
if (!isImage && !targetUrl.searchParams.has("api_key")) {
  targetUrl.searchParams.set("api_key", TMDB_KEY);
}
```

前端无需传递 Key，后端自动注入，保证安全。

### 3. 图片缓存

```javascript
let cached = await caches.default.match(cacheKey);
if (cached) {
  return new Response(cached.body, { headers: { "X-Cache": "HIT" } });
}
```

Worker Cache 缓存图片，7天有效期，大幅提升速度。

### 4. 错误重试

```javascript
async function fetchWithRetry(req, retries = 2) {
  if ((response.status >= 500 || response.status === 429) && retries > 0) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await fetchWithRetry(req, retries - 1);
  }
}
```

仅对 5xx 和 429 错误重试，避免无效重试。

---

## 🔍 调试技巧

### 查看缓存状态

```javascript
fetch('https://your-worker.workers.dev/t/p/w500/xxx.jpg')
  .then(res => console.log('Cache:', res.headers.get('X-Cache')));
// HIT = 缓存命中, MISS = 缓存未命中
```

### 测试 API

```bash
# 热门电影
curl "https://your-worker.workers.dev/3/movie/popular?language=zh-CN"

# 搜索
curl "https://your-worker.workers.dev/3/search/movie?query=test"
```

---

## ⚡ 优化建议

### 1. 自定义域名

Workers 域名可能被墙，建议绑定自己的域名：

```
Worker > Triggers > Custom Domains > 添加域名
```

### 2. 调整缓存时间

```javascript
// 大图缓存更久
const cacheTime = pathname.includes('original') ? 2592000 : 604800;
respHeaders.set("Cache-Control", `public, max-age=${cacheTime}, immutable`);
```

### 3. 添加限流

```javascript
// 简单 IP 限流
const ip = request.headers.get('CF-Connecting-IP');
// 实现限流逻辑
```

---

## 🚨 常见问题

**Q: 图片加载失败？**  
A: 检查路径是否以 `/t/p/` 开头，尺寸参数是否正确（w200, w500, original）

**Q: API 返回 401？**  
A: 确认 TMDB_KEY 环境变量已设置且类型为 Secret

**Q: 缓存未生效？**  
A: 第一次请求是 MISS，后续应该是 HIT，查看 X-Cache 响应头

**Q: 超过免费额度？**  
A: 免费版每天 10万次，付费版 $5/月 1000万次

---

## 📊 使用限制

### TMDB API
- 免费使用
- 每秒最多 40 次请求

### Cloudflare Workers
- **免费版**: 10万次/天
- **付费版**: $5/月，1000万次/月

---

## 🎉 总结

通过 Cloudflare Workers，我们实现了：

✅ 解决国内访问 TMDB 问题  
✅ 隐藏 API Key 保证安全  
✅ CDN 缓存加速图片加载  
✅ 完美支持 CORS 跨域  
✅ 零成本高性能代理

适用于个人影视网站、电影推荐应用等项目。

---

## 🔗 相关链接

- [TMDB API 文档](https://developers.themoviedb.org/3)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Workers Examples](https://developers.cloudflare.com/workers/examples/)
- [本文示例代码](https://github.com)

---

*如有问题欢迎在评论区讨论！*
