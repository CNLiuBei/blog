#!/usr/bin/env node

/**
 * IndexNow 自动提交脚本
 * 用于向 Bing 等搜索引擎提交网站更新
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 配置
const config = {
  host: 'liubei.org',
  key: '7e5afd939f078fb8fbc6aa5b1751d3ae',
  keyLocation: 'https://liubei.org/7e5afd939f078fb8fbc6aa5b1751d3ae.txt'
};

// 读取 sitemap.xml 获取所有 URL
function getUrlsFromSitemap() {
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ sitemap.xml 不存在，请先运行 hexo generate');
    process.exit(1);
  }
  
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
  
  if (!urlMatches) {
    console.error('❌ sitemap.xml 中没有找到 URL');
    process.exit(1);
  }
  
  return urlMatches.map(match => match.replace(/<\/?loc>/g, ''));
}

// 提交到 IndexNow
function submitToIndexNow(urls) {
  const data = JSON.stringify({
    host: config.host,
    key: config.key,
    keyLocation: config.keyLocation,
    urlList: urls
  });
  
  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  
  console.log(`📤 正在提交 ${urls.length} 个 URL 到 IndexNow...`);
  
  const req = https.request(options, (res) => {
    console.log(`✅ 状态码: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ 提交成功！搜索引擎将在几分钟内收到更新通知。');
    } else if (res.statusCode === 202) {
      console.log('✅ 提交已接受！');
    } else {
      console.log('⚠️  提交可能失败，请检查配置。');
    }
    
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ 提交失败:', error.message);
  });
  
  req.write(data);
  req.end();
}

// 主函数
function main() {
  console.log('🚀 IndexNow 自动提交工具\n');
  
  const urls = getUrlsFromSitemap();
  console.log(`📋 找到 ${urls.length} 个 URL\n`);
  
  // 显示前 5 个 URL
  console.log('示例 URL:');
  urls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
  if (urls.length > 5) {
    console.log(`  ... 还有 ${urls.length - 5} 个\n`);
  }
  
  submitToIndexNow(urls);
}

main();
