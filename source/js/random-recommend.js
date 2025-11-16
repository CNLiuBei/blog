/**
 * 随机推荐文章功能
 * 在首页推荐卡片中随机显示一篇文章
 */

(function() {
  'use strict';

  // 所有文章列表（需要手动维护或通过 Hexo 生成）
  const allPosts = [
    {
      title: "Hexo博客部署到Cloudflare完整教程",
      url: "/2025/11/16/Hexo博客部署到Cloudflare完整教程/",
      cover: "https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhd7o8sxxxyi3DIYvDIDvDqYzDcxPAda0DY==.png",
      excerpt: "详细讲解如何将 Hexo 博客免费部署到 Cloudflare Pages"
    },
    {
      title: "Twikoo 评论系统部署教程",
      url: "/2025/11/16/twikoo-deployment-tutorial/",
      cover: "https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhd7o8sxxxyi3DIYvDIDvDqYzDcxPAda0DY==.png",
      excerpt: "使用 Vercel 部署 Twikoo 评论系统完整指南"
    },
    {
      title: "使用Cloudflare Workers搭建TMDB代理服务",
      url: "/2025/11/16/使用Cloudflare-Workers搭建TMDB代理服务/",
      cover: "https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhd7o8sxxxyi3DIYvDIDvDqYzDcxPAda0DY==.png",
      excerpt: "详细讲解如何使用 Cloudflare Workers 搭建高性能 TMDB API 代理"
    },
    {
      title: "Hello World",
      url: "/2025/11/16/hello-world/",
      cover: "https://vip.123pan.cn/1821322860/yk6baz03t0n000d7w33hhd7o8sxxxyi3DIYvDIDvDqYzDcxPAda0DY==.png",
      excerpt: "欢迎来到我的博客！"
    }
  ];

  // 获取随机文章
  function getRandomPost() {
    const randomIndex = Math.floor(Math.random() * allPosts.length);
    return allPosts[randomIndex];
  }

  // 更新推荐卡片
  function updateRecommendCard() {
    // 尝试多种选择器查找推荐卡片
    const recommendCard = document.querySelector('.home-recommend-list') || 
                          document.querySelector('.recommend-list') ||
                          document.querySelector('[class*="recommend"]');
    
    if (!recommendCard) {
      console.log('未找到推荐卡片元素');
      return;
    }

    const randomPost = getRandomPost();
    console.log('随机推荐文章:', randomPost.title);
    
    // 更新链接 - 尝试多种选择器
    const link = recommendCard.querySelector('a') || 
                 recommendCard.closest('a') ||
                 recommendCard;
    if (link && link.tagName === 'A') {
      link.href = randomPost.url;
    }

    // 更新标题 - 尝试多种选择器
    const title = recommendCard.querySelector('.home-recommend-title') ||
                  recommendCard.querySelector('.recommend-title') ||
                  recommendCard.querySelector('[class*="title"]') ||
                  recommendCard.querySelector('h3') ||
                  recommendCard.querySelector('h2');
    
    if (title) {
      title.textContent = randomPost.title;
    }

    // 更新封面图片
    const cover = recommendCard.querySelector('.home-recommend-cover') ||
                  recommendCard.querySelector('[class*="cover"]');
    if (cover) {
      cover.style.backgroundImage = `url('${randomPost.cover}')`;
    }

    // 更新卡片背景
    if (recommendCard.style) {
      recommendCard.style.backgroundImage = `url('${randomPost.cover}')`;
    }
  }

  // 添加刷新按钮功能
  function addRefreshButton() {
    const recommendCard = document.querySelector('.home-recommend-list');
    if (!recommendCard) return;

    // 检查是否已存在刷新按钮
    if (recommendCard.querySelector('.recommend-refresh-btn')) return;

    // 创建刷新按钮
    const refreshBtn = document.createElement('div');
    refreshBtn.className = 'recommend-refresh-btn';
    refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
    refreshBtn.title = '换一篇';
    
    // 添加点击事件
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // 添加旋转动画
      refreshBtn.classList.add('rotating');
      
      // 延迟更新，让动画更自然
      setTimeout(() => {
        updateRecommendCard();
        refreshBtn.classList.remove('rotating');
      }, 300);
    });

    recommendCard.appendChild(refreshBtn);
  }

  // 添加样式
  function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .recommend-refresh-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .recommend-refresh-btn:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .recommend-refresh-btn i {
        color: #667eea;
        font-size: 14px;
      }

      .recommend-refresh-btn.rotating i {
        animation: rotate360 0.6s ease;
      }

      @keyframes rotate360 {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .home-recommend-list {
        position: relative;
      }

      /* 暗黑模式适配 */
      [data-theme="dark"] .recommend-refresh-btn {
        background: rgba(30, 30, 30, 0.9);
      }

      [data-theme="dark"] .recommend-refresh-btn:hover {
        background: rgba(30, 30, 30, 1);
      }

      [data-theme="dark"] .recommend-refresh-btn i {
        color: #8b9eff;
      }
    `;
    document.head.appendChild(style);
  }

  // 初始化
  function init() {
    // 等待 DOM 加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // 检查是否在首页
    const isHomePage = window.location.pathname === '/' || 
                       window.location.pathname === '/index.html';
    
    if (!isHomePage) {
      console.log('不在首页，跳过随机推荐功能');
      return;
    }

    console.log('随机推荐功能初始化...');

    // 添加样式
    addStyles();

    // 等待推荐卡片渲染
    let checkCount = 0;
    const checkCard = setInterval(() => {
      checkCount++;
      const recommendCard = document.querySelector('.home-recommend-list') ||
                           document.querySelector('[class*="recommend"]');
      
      if (recommendCard) {
        console.log('找到推荐卡片，开始更新');
        clearInterval(checkCard);
        
        // 延迟更新，确保卡片完全渲染
        setTimeout(() => {
          updateRecommendCard();
          addRefreshButton();
        }, 500);
      } else if (checkCount > 30) {
        console.log('未找到推荐卡片，停止检查');
        clearInterval(checkCard);
      }
    }, 200);

    // 10秒后停止检查
    setTimeout(() => clearInterval(checkCard), 10000);
  }

  // 启动
  init();

  // 暴露全局方法（可选）
  window.randomRecommend = {
    refresh: updateRecommendCard,
    posts: allPosts
  };

})();
