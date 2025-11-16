# 📚 Twikoo 评论系统完整使用教程

## 🎯 你的站点信息

- **云函数地址**: `https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo`
- **管理后台**: https://app.netlify.com/sites/my-twikoo-blog
- **MongoDB**: https://cloud.mongodb.com/
- **管理员密码**: `Twikoo`

---

## 📱 第一部分：在不同网站中集成

### 1. 纯 HTML 网站

在你的 HTML 文件中添加：

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>我的博客</title>
</head>
<body>
  <h1>文章标题</h1>
  <p>文章内容...</p>
  
  <!-- =================== 评论区开始 =================== -->
  <div id="twikoo"></div>
  
  <!-- 引入 Twikoo -->
  <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
  
  <!-- 初始化 Twikoo -->
  <script>
    twikoo.init({
      envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
      el: '#twikoo',
      lang: 'zh-CN'
    });
  </script>
  <!-- =================== 评论区结束 =================== -->
</body>
</html>
```

---

### 2. Hexo 博客

#### 方法 A：使用主题自带的 Twikoo 配置

在 **主题配置文件** `_config.yml` 中：

```yaml
# Twikoo 评论系统
twikoo:
  enable: true
  envId: https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo
  region: 
  path: window.location.pathname
  lang: zh-CN
```

#### 方法 B：手动添加

在主题的评论模板文件中（通常是 `layout/_partial/comments.ejs`）：

```html
<% if (theme.twikoo.enable) { %>
  <div id="twikoo"></div>
  <script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
  <script>
    twikoo.init({
      envId: '<%= theme.twikoo.envId %>',
      el: '#twikoo',
      lang: 'zh-CN'
    });
  </script>
<% } %>
```

---

### 3. Hugo 博客

在主题配置文件 `config.toml` 中：

```toml
[params]
  [params.twikoo]
    enable = true
    envId = "https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo"
    lang = "zh-CN"
```

在评论模板 `layouts/partials/comments.html` 中：

```html
{{ if .Site.Params.twikoo.enable }}
<div id="twikoo"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
<script>
  twikoo.init({
    envId: '{{ .Site.Params.twikoo.envId }}',
    el: '#twikoo',
    lang: '{{ .Site.Params.twikoo.lang }}'
  });
</script>
{{ end }}
```

---

### 4. VuePress / VitePress

在 `.vitepress/theme/index.js` 或 `.vuepress/config.js` 中：

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

export default {
  ...DefaultTheme,
  setup() {
    onMounted(() => {
      // 动态加载 Twikoo
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js'
      script.onload = () => {
        twikoo.init({
          envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
          el: '#twikoo',
          lang: 'zh-CN'
        })
      }
      document.head.appendChild(script)
    })
  }
}
```

---

### 5. WordPress

安装插件或在主题的 `single.php` 中添加：

```php
<?php if ( is_single() ) : ?>
<div id="twikoo"></div>
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
<script>
  twikoo.init({
    envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
    el: '#twikoo',
    lang: 'zh-CN'
  });
</script>
<?php endif; ?>
```

---

## ⚙️ 第二部分：高级配置

### 完整配置选项

```javascript
twikoo.init({
  // 必填：环境 ID
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  
  // 必填：容器元素
  el: '#twikoo',
  
  // 可选：语言
  lang: 'zh-CN', // zh-CN, zh-TW, en, ja
  
  // 可选：评论所在页面的路径（用于区分不同文章）
  path: location.pathname,
  
  // 可选：头像类型
  // 选项：identicon, monsterid, wavatar, retro, robohash, hide
  avatar: 'identicon',
  
  // 可选：评论框提示文字
  placeholder: '欢迎评论',
  
  // 可选：服务端配置
  region: '', // Netlify 部署留空即可
  
  // 可选：回调函数
  onCommentLoaded: function () {
    console.log('评论加载完成');
  }
});
```

---

### 不同页面显示不同评论

Twikoo 使用 `path` 参数区分不同页面的评论：

```javascript
// 方式 1：自动使用当前页面路径（推荐）
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  path: location.pathname  // 自动获取当前页面路径
});

// 方式 2：手动指定文章 ID
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  path: '/post/my-article-123'  // 手动指定
});

// 方式 3：使用文章标题或 ID
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  path: document.querySelector('meta[property="og:url"]').content
});
```

---

### 自定义样式

```html
<style>
/* 自定义评论框样式 */
#twikoo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* 修改主题色 */
#twikoo .tk-submit button {
  background-color: #667eea !important;
}

/* 修改字体 */
#twikoo {
  font-family: "Source Han Sans CN", sans-serif;
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  #twikoo {
    background: #1a1a1a;
    color: #fff;
  }
}
</style>
```

---

## 🛠️ 第三部分：管理评论

### 方法 1：通过网页管理（推荐）

1. 访问你的网站（如 https://my-twikoo-blog.netlify.app）
2. 在评论区点击 **"管理"** 按钮（需要先发表一条评论才能看到）
3. 输入管理员密码：`Twikoo`
4. 进入管理面板，可以：
   - 查看所有评论
   - 删除不当评论
   - 标记垃圾评论
   - 隐藏评论
   - 置顶评论

### 方法 2：通过 MongoDB 直接管理

1. 登录 MongoDB Atlas：https://cloud.mongodb.com/
2. 进入你的 Cluster
3. 点击 **"Browse Collections"**
4. 选择 `twikoo` 数据库
5. 查看以下集合：
   - `comment` - 所有评论数据
   - `counter` - 评论计数
   - `config` - 系统配置

---

## 📧 第四部分：邮件通知配置

### 配置邮件通知（可选）

在 MongoDB 的 `config` 集合中添加配置：

```javascript
{
  "_id": "mail",
  "SMTP_SERVICE": "QQ",        // 邮件服务商
  "SMTP_HOST": "smtp.qq.com",  // SMTP 地址
  "SMTP_PORT": 465,             // SMTP 端口
  "SMTP_SECURE": true,          // 使用 SSL
  "SMTP_USER": "your@qq.com",   // 发件邮箱
  "SMTP_PASS": "授权码",         // QQ邮箱授权码
  "SENDER_NAME": "我的博客",     // 发件人名称
  "SENDER_EMAIL": "your@qq.com",// 发件邮箱
  "ADMIN_EMAIL": "admin@example.com" // 管理员邮箱
}
```

### 常用邮件服务配置

#### QQ 邮箱
```javascript
{
  "SMTP_SERVICE": "QQ",
  "SMTP_HOST": "smtp.qq.com",
  "SMTP_PORT": 465,
  "SMTP_USER": "your@qq.com",
  "SMTP_PASS": "授权码"  // 在 QQ邮箱设置→账户→POP3/SMTP 服务获取
}
```

#### 163 邮箱
```javascript
{
  "SMTP_SERVICE": "163",
  "SMTP_HOST": "smtp.163.com",
  "SMTP_PORT": 465,
  "SMTP_USER": "your@163.com",
  "SMTP_PASS": "授权码"
}
```

#### Gmail
```javascript
{
  "SMTP_SERVICE": "Gmail",
  "SMTP_HOST": "smtp.gmail.com",
  "SMTP_PORT": 587,
  "SMTP_USER": "your@gmail.com",
  "SMTP_PASS": "应用专用密码"
}
```

---

## 🔒 第五部分：安全和隐私

### 1. 反垃圾评论

配置 Akismet（可选）：

在 MongoDB 的 `config` 集合中：

```javascript
{
  "_id": "akismet",
  "AKISMET_KEY": "你的Akismet密钥"
}
```

获取密钥：https://akismet.com/

### 2. 评论审核

在 MongoDB 的 `config` 集合中：

```javascript
{
  "_id": "system",
  "COMMENT_AUDIT": true  // 开启评论审核（评论需管理员审核后才显示）
}
```

### 3. 隐私保护

评论数据包含的信息：
- 昵称
- 邮箱（不公开显示）
- 网址（可选）
- IP 地址（管理员可见）
- User Agent（管理员可见）

可以在 MongoDB 中定期清理敏感信息。

---

## 📊 第六部分：数据管理

### 备份评论数据

```bash
# 方法 1：通过 MongoDB Atlas 导出
# 在 MongoDB Atlas → Collections → Export Collection

# 方法 2：使用 mongodump（需要安装 MongoDB 工具）
mongodump --uri="mongodb+srv://Twikoo:Twikoo@cluster0.wdvzud9.mongodb.net/twikoo" --out=./backup
```

### 导入评论数据

在 Twikoo 管理面板中：
1. 点击 "导入"
2. 选择 JSON 格式的评论数据
3. 上传并确认导入

### 批量删除评论

在 MongoDB Atlas 中：
```javascript
// 删除特定 URL 的所有评论
db.comment.deleteMany({ url: "/specific-page" })

// 删除垃圾评论
db.comment.deleteMany({ isSpam: true })

// 删除某个时间之前的评论
db.comment.deleteMany({ created: { $lt: 1609459200000 } })
```

---

## 🎨 第七部分：自定义功能

### 1. 显示评论数

```html
<div id="comment-count">
  评论数：<span class="tk-count" data-path="/article-1"></span>
</div>

<script>
// Twikoo 会自动统计并显示评论数
</script>
```

### 2. 最近评论列表

```javascript
// 获取最近评论
fetch('https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'COMMENT_GET_RECENT',
    includeReply: false,
    pageSize: 10
  })
})
.then(res => res.json())
.then(data => {
  console.log('最近评论:', data);
});
```

### 3. 访客统计

```javascript
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  // 开启访客统计
  visitor: true
});
```

---

## 🔄 第八部分：更新和维护

### 更新 Twikoo

#### 更新前端

直接修改 HTML 中的版本号：

```html
<!-- 从 -->
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>

<!-- 改为最新版或指定版本 -->
<script src="https://cdn.jsdelivr.net/npm/twikoo@latest/dist/twikoo.all.min.js"></script>
```

#### 更新云函数

```bash
cd /Users/liubei/Desktop/twikoo-official

# 更新到最新版本
npm update twikoo-netlify

# 重新部署
npx netlify deploy --prod --functions=netlify/functions
```

### 查看版本

访问云函数地址：
```
https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo
```

返回当前版本信息。

---

## ❓ 第九部分：常见问题

### Q1: 评论无法加载？

**检查**：
1. 浏览器控制台是否有错误（F12 → Console）
2. `envId` 地址是否正确
3. 网络是否正常

**解决**：
```javascript
// 添加错误处理
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  onError: function(err) {
    console.error('Twikoo 错误:', err);
  }
});
```

### Q2: 不同文章显示相同评论？

**原因**：未正确设置 `path` 参数

**解决**：
```javascript
twikoo.init({
  envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
  el: '#twikoo',
  path: location.pathname  // 添加这一行
});
```

### Q3: 如何批量导入评论？

使用 Twikoo 管理面板的导入功能，支持：
- Disqus
- Artalk
- Valine
- Waline

JSON 格式示例：
```json
[
  {
    "nick": "用户名",
    "mail": "email@example.com",
    "comment": "评论内容",
    "created": 1609459200000,
    "url": "/article-1"
  }
]
```

### Q4: 评论被标记为垃圾评论？

在管理面板中：
1. 进入管理界面
2. 找到该评论
3. 点击 "非垃圾评论"

或直接在 MongoDB 中修改：
```javascript
db.comment.updateOne(
  { _id: "评论ID" },
  { $set: { isSpam: false } }
)
```

---

## 📱 第十部分：移动端优化

### 响应式设计

Twikoo 默认支持响应式，但可以进一步优化：

```css
/* 移动端优化 */
@media (max-width: 768px) {
  #twikoo {
    padding: 10px;
  }
  
  #twikoo .tk-submit {
    width: 100%;
  }
  
  #twikoo .tk-input {
    font-size: 16px; /* 防止 iOS 自动缩放 */
  }
}
```

---

## 🎯 第十一部分：性能优化

### 1. 延迟加载

```javascript
// 当用户滚动到评论区域时再加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // 加载 Twikoo
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js';
      script.onload = () => {
        twikoo.init({
          envId: 'https://my-twikoo-blog.netlify.app/.netlify/functions/twikoo',
          el: '#twikoo'
        });
      };
      document.head.appendChild(script);
      observer.disconnect();
    }
  });
});

observer.observe(document.getElementById('twikoo'));
```

### 2. CDN 加速

使用国内 CDN：

```html
<!-- jsDelivr（推荐） -->
<script src="https://cdn.jsdelivr.net/npm/twikoo@1.6.44/dist/twikoo.all.min.js"></script>

<!-- Staticfile CDN -->
<script src="https://cdn.staticfile.org/twikoo/1.6.44/twikoo.all.min.js"></script>

<!-- unpkg -->
<script src="https://unpkg.com/twikoo@1.6.44/dist/twikoo.all.min.js"></script>
```

---

## 💡 提示和技巧

1. **定期备份** MongoDB 数据
2. **监控** Netlify 函数使用量（每月 125,000 次免费）
3. **配置邮件通知** 及时收到新评论提醒
4. **开启反垃圾** 保持评论区干净
5. **使用强密码** 保护管理员账号

---

## 📞 获取帮助

- **Twikoo 官方文档**: https://twikoo.js.org/
- **GitHub Issues**: https://github.com/twikoojs/twikoo/issues
- **Netlify 文档**: https://docs.netlify.com/
- **MongoDB Atlas 文档**: https://docs.atlas.mongodb.com/

---

## 🎉 完成

现在你已经掌握了 Twikoo 评论系统的所有功能！

祝使用愉快！💬
