
//BY：weich

/*悬浮二维码*/

/**
 * 多功能二维码浮窗组件
 * 单击按钮开关，图标在上，二维码居中，文字在下，外部关闭，按 showCodes 顺序切换
 */
document.addEventListener('DOMContentLoaded', function() {
  // 可配置顺序和内容（1=本页动态码，2=微信，3=群）
  var showCodes = [1, 2, 3];

  var qrData = {
    1: {
      img: "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(location.href) + "&size=160",
      text: "↑扫码打开本页面↑",
      icon: "📄",
      label: "本页"
    },
    2: {
      img: "/img/wxzym.webp",
      text: "↑微信打赏↑",
      icon: "🍻",
      label: "赏"
    },
    3: {
      img: "/img/qqqewm.webp",
      text: "↑Gmeek群↑",
      icon: "💬",
      label: "群"
    }
  };

  // 按顺序构建列表
  var items = [];
  for (var i = 0; i < showCodes.length; i++) {
    var id = showCodes[i];
    if (qrData[id]) items.push(qrData[id]);
  }

  var currentIdx = 0;
  var isOpen = false;

  // 移除旧容器
  var old = document.querySelector('.qrcode-root');
  if (old) old.remove();

  // 注入DOM（保留原按钮样式）
  var html = `
<div class="qrcode-root" style="position:fixed; bottom:58px; right:2px; z-index:9999;">
  <div class="qrcode-btn" style="background:#f74023; border-radius:4px; box-shadow:0 2px 10px rgba(0,0,0,0.1); cursor:pointer; /*padding:10px 14px;打开按钮图标边框太大直接去除*/ color:#fff; font-weight:bold; white-space:nowrap;">扫码打开/赏/Q群</div>
  <div class="qrcode-popup" style="display:none; position:absolute; bottom:60px; right:0; background:#f74023; border-radius:10px; /*padding:8px; 打开的二维码四周太大*/width:220px; text-align:center; box-shadow:0 2px 15px rgba(0,0,0,0.1);">
    <div id="qr-switch-bar" style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-bottom:12px;"></div>
    <div><img id="qr-main-img" style="width:160px; height:160px; object-fit:cover; border-radius:8px;"><div id="qr-main-caption" style="font-size:14px; margin-top:6px; color:#fff;"></div></div>
  </div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', html);

  var root = document.querySelector('.qrcode-root');
  var btn = document.querySelector('.qrcode-btn');
  var popup = document.querySelector('.qrcode-popup');
  var mainImg = document.getElementById('qr-main-img');
  var mainCaption = document.getElementById('qr-main-caption');
  var switchBar = document.getElementById('qr-switch-bar');

  function updateMain() {
    var cur = items[currentIdx];
    if (cur.id === 1) {
      var fresh = "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(location.href) + "&size=160";
      mainImg.src = fresh;
      cur.img = fresh;
    } else {
      mainImg.src = cur.img;
    }
    mainCaption.innerText = cur.text;
  }

  function buildSwitch() {
    switchBar.innerHTML = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var tab = document.createElement('div');
      tab.style.cssText = 'cursor:pointer; text-align:center; min-width:50px; padding:6px 8px; border-radius:20px; background:' + (i === currentIdx ? 'rgba(255,255,255,0.3)' : 'transparent') + '; transition:0.2s;';
      var iconSpan = document.createElement('span');
      iconSpan.style.cssText = 'font-size:20px; display:block;';
      iconSpan.innerHTML = item.icon;
      var labelSpan = document.createElement('div');
      labelSpan.style.cssText = 'font-size:12px; color:#fff; margin-top:2px;';
      labelSpan.innerText = item.label;
      tab.appendChild(iconSpan);
      tab.appendChild(labelSpan);
      tab.addEventListener('click', (function(idx) {
        return function(e) {
          e.stopPropagation();
          if (currentIdx === idx) return;
          currentIdx = idx;
          updateMain();
          var tabs = switchBar.children;
          for (var j = 0; j < tabs.length; j++) {
            tabs[j].style.background = j === currentIdx ? 'rgba(255,255,255,0.3)' : 'transparent';
          }
        };
      })(i));
      switchBar.appendChild(tab);
    }
  }

  buildSwitch();
  updateMain();
  
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (isOpen) {
      popup.style.display = 'none';
      isOpen = false;
    } else {
      popup.style.display = 'block';
      isOpen = true;
    }
  });

  document.addEventListener('click', function(e) {
    if (isOpen && !root.contains(e.target)) {
      popup.style.display = 'none';
      isOpen = false;
    }
  });

  // SPA 路由变化时刷新本页二维码（可选）
  function refreshPage() {
    var pageItem = items.find(function(i) { return i.id === 1; });
    if (pageItem && currentIdx === items.indexOf(pageItem)) {
      pageItem.img = "https://qun.qq.com/qrcode/index?data=" + encodeURIComponent(location.href) + "&size=160";
      mainImg.src = pageItem.img;
    }
  }
  var push = history.pushState;
  history.pushState = function() { push.apply(this, arguments); refreshPage(); };
  var rep = history.replaceState;
  history.replaceState = function() { rep.apply(this, arguments); refreshPage(); };
  window.addEventListener('popstate', refreshPage);
});







// ======================================================
// 外部链接新窗口打开（文章页 post/ + 友情页 link.html）
// ======================================================
document.addEventListener('DOMContentLoaded', function () {
  const currentHost = window.location.host;
  const path = window.location.pathname;
  const needPage = path.startsWith('/post/') || path === '/link.html';

  if (needPage) {
    document.querySelectorAll('a').forEach(link => {
      if (!link.href || link.href.startsWith('javascript:')) return;
      try {
        const url = new URL(link.href);
        if (url.host !== currentHost) {
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        }
      } catch (e) {}
    });
  }
});
// ====================== 结束 ==========================

// ======================================================
// github（Gmeek）图片缓存
// 作用：给 Issues （Gmeek）写文章在文章底部上传的图片自动加版本号，让浏览器永久缓存
// 排除规则：图片链接里包含以下关键词，就不处理、不缓存
// ======================================================
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    document.querySelectorAll('img[src*="github"],img[src*="https://camo"]').forEach(img => {
      // 排除链接包含这些关键词的图片：qr、qrcode、code、api（二维码、动态API图等）
      if (img.src.includes('11qr11') || 
          img.src.includes('qrcode') || 
          img.src.includes('11code11') || 
          img.src.includes('11api11')) {
        return;
      }

      const url = new URL(img.src);
      url.searchParams.set('v', '202602'); // 缓存版本号，修改这里即可刷新所有图片
      img.src = url.toString();
    });
  }, 500);
});

/*友情链接link.html页面获取焦点显示标题*/

document.addEventListener('DOMContentLoaded', function () {
  // 只在链接页面生效
  if (window.location.pathname !== '/link.html') return;

  const postBody = document.getElementById('postBody');
  if (!postBody) return;

  // 只给 #postBody 里带 title 的链接生效
  postBody.querySelectorAll('a[title]').forEach(link => {
    link.classList.add('tooltip-link');
    link.dataset.title = link.title;
    link.removeAttribute('title');
    // 让手机 a 标签能真正获得焦点（关键！）
    link.setAttribute('tabindex', '0');
  });
});




/*代码高亮*/



// prism-init.js —— 自动识别并标记 Gmeek 的代码块（超级全语言+系统命令高亮）
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('pre.notranslate > code.notranslate').forEach((codeEl) => {
    let lang = 'plaintext';
    const pre = codeEl.parentElement;
    const text = codeEl.textContent.trimStart();

    // 优先从 title / data-lang 读取
    if (pre.title) lang = pre.title.trim().toLowerCase();
    else if (pre.dataset.lang) lang = pre.dataset.lang.trim().toLowerCase();

    // ————————————————————————————————————
    // 全语言内容识别（含系统命令、终端、配置）
    // ————————————————————————————————————
    else if (text.includes('<?php'))
      lang = 'php';
    else if (
      text.includes('document.') || text.includes('window.') ||
      text.includes('console.log') || text.includes('function') ||
      text.includes('const ') || text.includes('let ') || text.includes('=>') ||
      text.includes('var ') || text.includes('alert(') || text.includes('fetch(')
    )
      lang = 'javascript';
    else if (
      text.startsWith('def ') || text.includes('import ') ||
      text.includes('print(') || text.includes('self.')
    )
      lang = 'python';
    else if (
      text.includes('color:') || text.includes('margin:') ||
      text.includes('padding:') || text.includes('display:') ||
      text.includes('font-') || text.includes('@media')
    )
      lang = 'css';
    else if (
      text.includes('<div') || text.includes('<p>') || text.includes('<span') ||
      text.includes('<ul>') || text.includes('<!DOCTYPE') || text.includes('</')
    )
      lang = 'markup';

    // C / C++
    else if (text.includes('#include') || text.includes('int main') || text.includes('printf('))
      lang = 'c';
    else if (text.includes('std::') || text.includes('cout') || text.includes('cin'))
      lang = 'cpp';

    // Java / Go
    else if (text.includes('public class') || text.includes('static void') || text.includes('System.out.println'))
      lang = 'java';
    else if (text.includes('func ') || text.includes('package ') || text.includes('fmt.Println'))
      lang = 'go';

    // Linux / Unix Shell / 终端命令
    else if (
      text.includes('sudo ') || text.includes('apt ') || text.includes('yum ') ||
      text.includes('ls ') || text.includes('cd ') || text.includes('pwd ') ||
      text.includes('mkdir ') || text.includes('rm ') || text.includes('chmod ') ||
      text.includes('if [') || text.includes('for ') || text.includes('do ') ||
      text.includes('echo ') || text.includes('#!/bin/bash') || text.startsWith('$')
    )
      lang = 'bash';

    // Windows CMD / 批处理
    else if (
      text.includes('@echo') || text.includes('dir ') || text.includes('copy ') ||
      text.includes('del ') || text.includes('md ') || text.includes('rd ') ||
      text.includes('ipconfig') || text.includes('ping ') || text.startsWith('C:\\')
    )
      lang = 'batch';

    // Windows PowerShell
    else if (
      text.includes('Get-') || text.includes('Set-') || text.includes('New-') ||
      text.includes('Remove-') || text.includes('Write-') || text.includes('$PSVersionTable')
    )
      lang = 'powershell';

    // JSON / Markdown / YAML
    else if ((text.startsWith('{') || text.startsWith('[')) && text.includes(':') && text.includes(','))
      lang = 'json';
    else if (text.startsWith('# ') || text.startsWith('## ') || text.startsWith('- ') || text.includes('[]('))
      lang = 'markdown';
    else if (text.includes(': ') && !text.includes('{') && !text.includes(';'))
      lang = 'yaml';

    // SQL / Rust / Ruby / Kotlin / Swift / TypeScript
    else if (text.includes('SELECT ') || text.includes('FROM ') || text.includes('WHERE ') || text.includes('CREATE TABLE'))
      lang = 'sql';
    else if (text.includes('fn main') || text.includes('let mut') || text.includes('println!'))
      lang = 'rust';
    else if (text.includes('def ') && text.includes('end'))
      lang = 'ruby';
    else if (text.includes('fun ') || text.includes('class ') && text.includes('fun'))
      lang = 'kotlin';
    else if (text.includes('import ') && text.includes('struct') && text.includes('impl'))
      lang = 'swift';
    else if (text.includes('interface ') || text.includes('type ') || text.includes(': '))
      lang = 'typescript';

    // Nginx / Apache 配置
    else if (text.includes('server {') || text.includes('location ') || text.includes('listen 80') || text.includes('root '))
      lang = 'nginx';

    // 环境变量 / config / ini
    else if (text.includes('export ') || text.includes('PATH=') || (text.includes('=') && !text.includes(':') && !text.includes(';')))
      lang = 'ini';

    // Docker
    else if (text.includes('FROM ') || text.includes('RUN ') || text.includes('COPY ') || text.includes('CMD '))
      lang = 'docker';

    // Git 命令
    else if (text.includes('git ') && (text.includes('commit') || text.includes('push') || text.includes('pull') || text.includes('checkout')))
      lang = 'git';

    // 兜底
    else {
      lang = 'plaintext';
    }

    // 应用 Prism 类
    codeEl.classList.remove('notranslate');
    codeEl.classList.add(`language-${lang}`);
    pre.classList.add('line-numbers');
  });

  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
});

/*tag标签页面，用户选中标签切换效果点击哪个标签就去除它的css样式padding：4px*/

(function() {
  'use strict';

  if (!window.location.pathname.includes('tag.html')) return;

  function handleTagClick(event) {
    const button = event.target.closest('button.Label');
    if (!button) return;

    document.querySelectorAll('button.Label').forEach(btn => {
      btn.style.setProperty('padding', '4px', 'important');
    });
    button.style.setProperty('padding', '0', 'important');
  }

  const tagContainer = document.getElementById('taglabel');
  if (tagContainer) {
    tagContainer.addEventListener('click', handleTagClick);
  }

  function activateTagByHash() {
    const currentHash = decodeURIComponent(window.location.hash.substring(1));
    const allTags = document.querySelectorAll('button.Label');
    
    allTags.forEach(btn => {
      btn.style.setProperty('padding', '4px', 'important');
    });

    if (!currentHash) {
      const allBtn = Array.from(allTags).find(btn => 
        btn.textContent.trim().toLowerCase().startsWith('all')
      );
      if (allBtn) allBtn.style.setProperty('padding', '0', 'important');
      return;
    }

    const activeTag = Array.from(allTags).find(btn => 
      btn.textContent.trim().includes(currentHash.trim())
    );
    if (activeTag) activeTag.style.setProperty('padding', '0', 'important');
  }

  setTimeout(activateTagByHash, 1000);
  window.addEventListener('hashchange', activateTagByHash);
})();








/*首页和搜索标签页面和文章页面根据标签背景颜色更改标签字体颜色*/


(function() {
    // 1. 核心算法：根据背景 RGB 计算亮度，决定字体颜色
    function getAdaptiveColor(bg) {
        const rgb = bg.match(/\d+/g);
        if (!rgb || rgb.length < 3) return "#ffffff";
        const [r, g, b] = rgb.map(Number);
        // 使用亮度感知算法
        const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return l > 0.6 ? "#000000" : "#ffffff";
    }

    // 2. 执行颜色同步
    function syncLabelColors() {
        // 覆盖首页、搜索页、标签页、以及文章内注入的所有标签选择器
        const selectors = '.Label, .LabelName, .post-tag, .listLabels span, .listLabels a, #customLabels a';
        document.querySelectorAll(selectors).forEach(el => {
            // 如果已经处理过且没有被标记为需要重算，则跳过
            if (el.dataset.colorFixed === "true" && !el.dataset.dirty) return;
            
            try {
                let bg = window.getComputedStyle(el).backgroundColor;
                // 如果当前元素透明，则尝试抓取父元素的背景色
                if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                    bg = window.getComputedStyle(el.parentElement).backgroundColor;
                }
                
                if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
                    const fg = getAdaptiveColor(bg);
                    const target = (el.tagName === 'A') ? el : (el.querySelector('a') || el);
                    
                    if (target && target.style) {
                        target.style.setProperty('color', fg, 'important');
                        target.style.setProperty('text-shadow', 'none', 'important');
                        el.dataset.colorFixed = "true";
                        delete el.dataset.dirty; 
                    }
                }
            } catch (e) {}
        });
    }

    // --- 执行逻辑 ---

    // 初始执行：前 5 秒高频检测，确保内容加载出来后能第一时间变色
    syncLabelColors();
    let count = 0;
    const initTimer = setInterval(() => {
        syncLabelColors();
        if (++count > 10) clearInterval(initTimer);
    }, 500);

    // 模式切换监听：点击“太阳/月亮”切换主题时，强制所有标签重新计算
    if (document.documentElement) {
        new MutationObserver(() => {
            document.querySelectorAll('.Label, .LabelName, .post-tag, .listLabels span, #customLabels a').forEach(el => {
                el.dataset.dirty = "true";
            });
            syncLabelColors();
        }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    }

    // 兜底检查：每 3 秒检查一次（处理如翻页、评论区加载等新产生的标签）
    setInterval(syncLabelColors, 3000);
})();





/*文章里面显示标签和日期和上下一篇文章*/


(function() {
    let checkCount = 0;
    const run = () => {
        const c = document.getElementById('cmButton');
        // 等待评论按钮出现，最多尝试 10 秒
        if (!c) {
            if (checkCount++ < 20) setTimeout(run, 500); 
            return;
        }
        // 防止重复加载
        if (document.getElementById('customLabels')) return;

        const p = window.location.pathname;
        const u = window.location.href;

        // 1. 抓取 RSS：处理日期与上下篇链接
        fetch("/rss.xml").then(r => r.text()).then(x => {
            const d = new DOMParser().parseFromString(x, "text/xml");
            const items = Array.from(d.querySelectorAll("item"));
            let idx = -1;

            // 匹配当前文章在 RSS 中的索引
            for (let i = 0; i < items.length; i++) {
                const link = items[i].querySelector("link").textContent;
                if (link.indexOf(p) !== -1 || p.indexOf(link) !== -1 || link === u) {
                    idx = i;
                    break;
                }
            }

            if (idx === -1) return;

            // 格式化发布日期
            const pub = new Date(items[idx].querySelector("pubDate").textContent);
            const dt = pub.getFullYear() + '-' + (pub.getMonth() + 1) + '-' + pub.getDate();

            const box = document.createElement('div');
            box.style.cssText = "margin-top:30px;padding-top:20px;border-top:1px solid var(--color-border-default);clear:both;font-size:14px;";
            
            let h = '<div style="color:var(--color-fg-muted);margin-bottom:15px;">📅 发布日期：' + dt + '</div><div style="display:flex;flex-direction:column;gap:10px;">';
            
            // 上一篇 (索引越小越新)
            if (idx > 0) {
                h += '<div><span style="color:var(--color-fg-muted);">← 上一篇：</span><a href="' + items[idx - 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx - 1].querySelector("title").textContent + '</a></div>';
            }
            // 下一篇
            if (idx < items.length - 1) {
                h += '<div><span style="color:var(--color-fg-muted);">→ 下一篇：</span><a href="' + items[idx + 1].querySelector("link").textContent + '" style="color:var(--color-accent-fg);text-decoration:none;">' + items[idx + 1].querySelector("title").textContent + '</a></div>';
            }
            h += '</div>';
            box.innerHTML = h;
            c.before(box);

            // 2. 抓取标签：通过首页列表获取
            const s = (url) => {
                fetch(url).then(r => r.text()).then(ht => {
                    const doc = new DOMParser().parseFromString(ht, "text/html");
                    const pathName = p.split('/').pop();
                    
                    // 匹配首页中对应文章的链接
                    const exactSelector = "a[href$='/" + pathName + "']";
                    const postEntry = doc.querySelector(exactSelector);
                    const container = postEntry ? postEntry.closest('.SideNav-item') : null;
                    
                    if (container) {
                        const b = document.createElement('div');
                        b.id = "customLabels";
                        b.style.cssText = "margin-top:15px;margin-bottom:15px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;";
                        b.innerHTML = '<span style="color:var(--color-fg-muted);font-size:14px;">本文标签：</span>';

                        // 核心改进：只选择 class 为 LabelName 的 span，排除单纯的 Label(评论数) 和 LabelTime(日期)
                        container.querySelectorAll("span.LabelName").forEach(l => {
                            const t = l.innerText.trim();
                            if (t) {
                                const a = document.createElement('a');
                                a.href = "/tag.html#" + t;
                                a.innerText = t;
                                
                                // 获取首页标签的背景颜色
                                const temp = document.body.appendChild(l.cloneNode(true));
                                temp.style.display = "none";
                                const bg = window.getComputedStyle(temp).backgroundColor;
                                document.body.removeChild(temp);
                                
                                a.style.cssText = "background-color:" + bg + ";color:#fff;padding:2px 10px;border-radius:20px;font-size:12px;text-decoration:none;display:inline-block;";
                                b.appendChild(a);
                            }
                        });
                        // 只有抓取到标签时才插入
                        if (b.children.length > 1) c.before(b);
                    } else {
                        // 没找到则继续翻页寻找
                        const n = doc.querySelector('.pagination a:last-child, a[rel="next"]');
                        if (n && n.getAttribute('href') && n.getAttribute('href') !== url) s(n.getAttribute('href'));
                    }
                });
            };
            s("/index.html");
        });
    };
    run();
})();




/*友情链接link.html页面链接背景*/

/**
 * Gmeek 链接卡片化脚本（无额外容器版）
 * 作用：将 /link.html 页面中 #content 内的链接（及前面的图标）用圆角卡片框起来
 * 不影响导航栏，不添加 .card-container 容器，卡片自然换行
 */
document.addEventListener('DOMContentLoaded', function() {
    // 只在 /link.html 或 link.html 页面执行
    if (location.pathname !== '/link.html' && location.pathname !== 'link.html') return;

    try {
        // 1. 注入卡片样式（移除了 .card-container 定义）
        const style = document.createElement('style');
        style.textContent = `
            /* 卡片样式：包裹图标和链接 */
            .card-wrap {
                /*友情卡片之间太小display: inline-flex;*/
                display: inline-block;
                box-shadow: 3px 3px 5px #aaa;
                align-items: center;
                gap: 4px;
                background: #f6f8fa;
                border: 1px solid #d0d7de;
                border-radius: 40px;
                padding: 3px 6px 3px 3px;
                transition: .2s;
                margin: 0 4px 8px 0;
            }
            .card-wrap:hover {
                background: #0969da;
            }
            .card-wrap:hover a,
            .card-wrap:hover .card-icon {
                color: #fff;
            }
            /* 图标样式 */
            .card-icon {
                font-size: 1.2rem;
                line-height: 1;
            }
            /* 链接文字样式 */
            .card-wrap a {
                text-decoration: none;
                color: #0969da;
                font-size: .9rem;
                font-weight: 500;
            }
            /* 深色模式适配 */
            @media (prefers-color-scheme: dark) {
                .card-wrap {
                    background: #21262d;
                    border-color: #30363d;
                }
                .card-wrap a {
                    color: #4493f8;
                }
            }
        `;
        document.head.appendChild(style);

        // 2. 匹配常见 emoji 的正则表达式
        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

        // 3. 只处理 #content 区域内的所有链接（避免影响导航栏）
        const contentLinks = document.querySelectorAll('#content a');
        contentLinks.forEach(link => {
            // 避免重复处理已经被包裹过的链接
            if (link.parentElement?.classList?.contains('card-wrap')) return;

            let icon = null;

            // 3.1 检查链接前面的文本节点（可能包含图标）
            let prev = link.previousSibling;
            // 跳过空白的文本节点并删除它们
            while (prev && prev.nodeType === 3 && (!prev.textContent || prev.textContent.trim() === '')) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.remove();
            }

            if (prev && prev.nodeType === 3 && prev.textContent) {
                // 尝试匹配文本开头的 emoji
                const match = prev.textContent.match(new RegExp('^[\\s]*' + emojiRegex.source, 'u'));
                if (match) {
                    icon = match[0].trim(); // 提取到的图标
                    const rest = prev.textContent.replace(match[0], '').trim();
                    if (rest && !/^[\d\s\W]+$/.test(rest)) {
                        // 保留有意义的剩余文本（不是纯数字/符号）
                        prev.textContent = rest;
                    } else {
                        // 剩余内容无意义，直接删除该文本节点
                        prev.remove();
                    }
                }
            }

            // 3.2 如果前面没有文本节点图标，检查前面的元素节点（比如 <span>📖</span>）
            if (!icon) {
                const prevEl = link.previousElementSibling;
                if (prevEl && prevEl.textContent && emojiRegex.test(prevEl.textContent.trim())) {
                    icon = prevEl.textContent.trim();
                    prevEl.remove(); // 删除原来的图标元素
                }
            }

            // 3.3 创建卡片容器，将图标和链接一起框起来
            const wrapper = document.createElement('span');
            wrapper.className = 'card-wrap';

            if (icon) {
                const iconSpan = document.createElement('span');
                iconSpan.className = 'card-icon';
                iconSpan.textContent = icon;
                wrapper.appendChild(iconSpan);
            }

            // 将原链接移动到卡片容器内
            link.parentNode.insertBefore(wrapper, link);
            wrapper.appendChild(link);
        });

        // 4. 清理可能残留的空白文本节点（针对卡片父级）
        document.querySelectorAll('.card-wrap').forEach(wrapper => {
            const parent = wrapper.parentNode;
            // 如果父级内只有一个子节点（卡片本身）且没有其他文本节点，则不需要处理
            if (parent.children.length === 1 && parent.childNodes.length === 1) return;

            let prev = parent.previousSibling;
            while (prev && prev.nodeType === 3 && (!prev.textContent || prev.textContent.trim() === '')) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.remove();
            }
        });

        // 注意：不再创建 .card-container，卡片直接以 inline-flex 排列，自然换行
    } catch(e) {
        // 静默失败，不干扰页面
    }
});
