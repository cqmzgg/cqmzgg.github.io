(function () {
  // 严格的重复执行保护
  if (window.__TiengmingModernized) {
    return;
  }
  
  console.log("🍏 TiengmingModern 插件启动中... https://code.buxiantang.top/");

  const themeColors = {
    light: {
      bgGradient: "linear-gradient(135deg, #f4f4f4, #fef2f2, #f4f0ff)",
      cardBg: "rgba(255,255,255,0.25)",
      cardBorder: "1px solid rgba(255,255,255,0.2)",
      title: "#1c1c1e",
      meta: "#888"
    },
    dark: {
      bgGradient: "linear-gradient(135deg, #1a1a2b, #222c3a, #2e3950)",
      cardBg: "rgba(32,32,32,0.3)",
      cardBorder: "1px solid rgba(255,255,255,0.08)",
      title: "#eee",
      meta: "#bbb"
    }
  };

  function getEffectiveMode() {
    const raw = document.documentElement.getAttribute("data-color-mode");
    if (raw === "light" || raw === "dark") return raw;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function getTextColor(bg) {
    const rgb = bg.match(/\d+/g);
    if (!rgb) return "#fff";
    const [r, g, b] = rgb.map(Number);
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return l > 0.6 ? "#000" : "#fff";
  }

  // 标签点击处理函数
  window.handleTagClick = function(event, tagName) {
    event.preventDefault();
    event.stopPropagation();
    const tagUrl = `tag.html#${encodeURIComponent(tagName)}`;
    window.location.href = tagUrl;
  };

  // 初始化背景和样式
  function initializeBackground() {
    const existingBg = document.querySelector('.herobgcolor');
    if (existingBg) existingBg.remove();

    const bg = document.createElement("div");
    bg.className = "herobgcolor";
    document.body.appendChild(bg);

    const existingStyle = document.querySelector('#tiengming-modern-styles');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement("style");
    style.id = 'tiengming-modern-styles';
    style.textContent = `
      .herobgcolor {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -1;
        background-size: 600% 600%;
        animation: hueflow 30s ease infinite;
        transition: background 0.6s ease;
      }
      @keyframes hueflow {
        0% { filter: hue-rotate(0deg); background-position: 0% 50%; }
        50% { filter: hue-rotate(180deg); background-position: 100% 50%; }
        100% { filter: hue-rotate(360deg); background-position: 0% 50%; }
      }
      .post-tag {
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 4px;
        padding: 2px 6px;
        margin-right: 4px;
        font-size: 0.8em;
        display: inline-block;
      }
      .post-tag:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
    return bg;
  }

  const bg = initializeBackground();

  function applyTheme() {
    const mode = getEffectiveMode();
    const theme = themeColors[mode];

    if (bg) bg.style.background = theme.bgGradient;

    document.querySelectorAll(".post-card").forEach(card => {
      card.style.background = theme.cardBg;
      card.style.border = theme.cardBorder;
      card.style.backdropFilter = "blur(16px)";
      card.style.webkitBackdropFilter = "blur(16px)";
      card.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";

      const title = card.querySelector(".post-title");
      const meta = card.querySelector(".post-meta");

      if (title) title.style.color = theme.title;
      if (meta) meta.style.color = theme.meta;
    });

    ["#header", "#footer"].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.color = mode === "dark" ? "#ddd" : "";
    });
  }

  // 主题监听器
  if (document.documentElement.getAttribute("data-color-mode") === "auto") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
  }

  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-color-mode"]
  });



  function rebuildCards() {
    // 查找所有可能的文章容器
    const possibleSelectors = [
      '.SideNav-item',