/**
 * 全站通用快捷導航系統 (Universal Portal Navigator)
 * 允許使用者在任意子資料夾與專案頁面隨時互相跳轉、返回首頁儀表板
 */
(function () {
  if (window.__portalNavInitialized) return;
  window.__portalNavInitialized = true;

  // 0. 確保 FontAwesome 圖示在庫
  if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fa);
  }

  // 1. 自動偵測 livesite 根目錄路徑
  function getRootUrl() {
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('portal-nav.js')) {
        return src.substring(0, src.lastIndexOf('portal-nav.js'));
      }
    }
    // 後備相對路徑推算
    const path = decodeURIComponent(window.location.pathname);
    if (path.includes('/Sat.work/')) return '../../';
    if (path.includes('/ChengHsin/') || path.includes('/japan/') || path.includes('/Gept/') || path.includes('/Tobacco-Control/') || path.includes('/presentation/') || path.includes('/統計工具/') || path.includes('/綜藝遊戲/') || path.includes('/wsn-quiz-system/')) {
      return '../';
    }
    return './';
  }

  const ROOT = getRootUrl();

  // 2. 全站所有資料夾與頁面完整清單
  const PORTAL_PAGES = [
    {
      category: "🏠 首頁與儀表板",
      items: [
        { title: "首頁專案目錄 Dashboard", path: "index.html", desc: "周淵凱的學習歷程首頁・全站專案入口", icon: "fa-solid fa-house", tag: "Home" }
      ]
    },
    {
      category: "💻 應用與日常專案",
      items: [
        { title: "綜藝派對遊戲大廳 (14-in-1)", path: "綜藝遊戲/index.html", desc: "14 款連線競技與闖關活動 (盲盒拆字、機智線索、靈魂畫手)", icon: "fa-solid fa-gamepad", tag: "Hot" },
        { title: "產線數量與良率統計工作台", path: "統計工具/index.html", desc: "時間段點數・當班良率計算・交接人員紀錄與 I 欄位標記", icon: "fa-solid fa-industry", tag: "New" },
        { title: "LinguaPulse 靈感英語", path: "Gept/index.html", desc: "GEPT 中高級 ✕ 多益金證 8,365 詞彙庫隨想隨練", icon: "fa-solid fa-bolt", tag: "Hot" },
        { title: "智慧精準灌溉系統", path: "presentation/index.html", desc: "氣象預報聯動之節水攔截機制 (GSAP + 3D 動畫)", icon: "fa-solid fa-droplet", tag: "Featured" },
        { title: "政昕電腦比較", path: "ChengHsin/computer.html", desc: "文書與專業電腦配置方案分析比較", icon: "fa-solid fa-laptop", tag: "" },
        { title: "政昕尾牙小遊戲", path: "ChengHsin/annual.html", desc: "互動式尾牙即時競賽小遊戲", icon: "fa-solid fa-dice", tag: "" },
        { title: "師大菸害防制問卷", path: "Tobacco-Control/Tobacco-Control.html", desc: "菸害防制新法知識站與問卷系統", icon: "fa-solid fa-ban-smoking", tag: "" },
        { title: "大阪京都自由行", path: "japan/index.html", desc: "2/21-2/25 大阪京都 5 天 4 夜精美行程", icon: "fa-solid fa-plane", tag: "" },
        { title: "大阪研究室自由行", path: "japan/osaka.html", desc: "1/23-1/27 大阪行程指南", icon: "fa-solid fa-map-location-dot", tag: "" },
        { title: "大阪自由行午餐美食", path: "japan/lunch.html", desc: "2/24 日本精選午餐清單與推薦", icon: "fa-solid fa-utensils", tag: "" }
      ]
    },
    {
      category: "🎓 課程與測驗專案",
      items: [
        { title: "無線感測網路 (WSN) 測驗系統", path: "wsn-quiz-system/index.html", desc: "IEEE 802.15.4、LEACH、物聯網感測互動刷題", icon: "fa-solid fa-tower-broadcast", tag: "New" },
        { title: "網際網路期末模考", path: "Sat.work/Internet/FinalMock.html", desc: "全隨機適配考前衝刺測驗系統", icon: "fa-solid fa-pen-nib", tag: "Quiz" },
        { title: "網際網路期中模考", path: "Sat.work/Internet/quiz.html", desc: "無限網際網路期中考模擬試題練習", icon: "fa-solid fa-file-lines", tag: "Quiz" },
        { title: "財金資料庫期中模考", path: "Sat.work/Financial DataBase/quiz.html", desc: "財金資料庫期中考模擬試卷", icon: "fa-solid fa-coins", tag: "Important" },
        { title: "財金資料庫期末報告", path: "Sat.work/Financial DataBase/report.html", desc: "房地合一稅 2.0 互動數據分析與計算機", icon: "fa-solid fa-chart-pie", tag: "Report" }
      ]
    }
  ];

  // 3. 注入 CSS 樣式
  const styleEl = document.createElement('style');
  styleEl.id = 'portal-nav-styles';
  styleEl.textContent = `
    /* 懸浮快速跳轉膠囊按鈕 */
    #portal-nav-float-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #ffffff;
      border: 1.5px solid rgba(255, 200, 59, 0.6);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 200, 59, 0.3);
      padding: 10px 18px;
      border-radius: 30px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
      outline: none;
    }
    #portal-nav-float-btn:hover {
      transform: translateY(-4px) scale(1.04);
      border-color: #ffc83b;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 200, 59, 0.5);
    }
    #portal-nav-float-btn .portal-btn-icon {
      font-size: 16px;
      color: #ffc83b;
    }
    #portal-nav-float-btn .portal-shortcut-hint {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 6px;
      color: #cbd5e1;
    }

    /* 全站跳轉彈窗背景遮罩 */
    #portal-nav-modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(10, 15, 30, 0.82);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      transition: opacity 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans TC", sans-serif;
    }
    #portal-nav-modal-backdrop.open {
      display: flex;
      opacity: 1;
    }

    /* 彈窗主體卡片 */
    #portal-nav-dialog {
      background: #141a2e;
      border: 1.5px solid rgba(255, 255, 255, 0.18);
      border-radius: 22px;
      width: 100%;
      max-width: 680px;
      max-height: 85vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      transform: scale(0.96);
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    #portal-nav-modal-backdrop.open #portal-nav-dialog {
      transform: scale(1);
    }

    /* 彈窗頭部 */
    .portal-modal-header {
      padding: 18px 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(255, 255, 255, 0.03);
    }
    .portal-modal-title {
      font-size: 16px;
      font-weight: 800;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .portal-close-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      border-radius: 8px;
      padding: 5px 12px;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .portal-close-btn:hover {
      background: rgba(255, 51, 102, 0.25);
      border-color: #ff3366;
      color: #fff;
    }

    /* 搜尋框 */
    .portal-search-box {
      padding: 14px 22px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0, 0, 0, 0.25);
    }
    .portal-search-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      font-family: inherit;
    }
    .portal-search-box input::placeholder {
      color: #64748b;
    }

    /* 列表區塊 */
    .portal-list-scroll {
      padding: 16px 22px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .portal-group-label {
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
    }
    .portal-items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 10px;
    }
    .portal-item-link {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 10px 14px;
      text-decoration: none;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: all 0.2s ease;
    }
    .portal-item-link:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-2px);
      color: #fff;
    }
    .portal-item-link.current-page {
      background: rgba(0, 245, 155, 0.12);
      border-color: rgba(0, 245, 155, 0.6);
    }
    .portal-item-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow: hidden;
    }
    .portal-item-title {
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .portal-item-desc {
      font-size: 12px;
      color: #94a3b8;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .portal-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 8px;
      background: rgba(255, 200, 59, 0.2);
      border: 1px solid rgba(255, 200, 59, 0.6);
      color: #ffc83b;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .portal-badge.current {
      background: rgba(0, 245, 155, 0.2);
      border-color: #00f59b;
      color: #00f59b;
    }

    /* 底部提示 */
    .portal-modal-footer {
      padding: 12px 22px;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 12px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @media (max-width: 640px) {
      #portal-nav-float-btn {
        bottom: 16px;
        right: 16px;
        padding: 8px 14px;
        font-size: 13px;
      }
      #portal-nav-float-btn .portal-shortcut-hint {
        display: none;
      }
      .portal-items-grid {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // 4. 建立浮動按鈕與彈窗 DOM
  function createPortalDOM() {
    // 浮動按鈕
    const floatBtn = document.createElement('button');
    floatBtn.id = 'portal-nav-float-btn';
    floatBtn.title = '點擊開啟全站快速跳轉選單 (快捷鍵: Ctrl+K / ⌘K)';
    floatBtn.innerHTML = `
      <span class="portal-btn-icon">🧭</span>
      <span>全站導航</span>
      <span class="portal-shortcut-hint">⌘K</span>
    `;

    // 彈窗背景
    const backdrop = document.createElement('div');
    backdrop.id = 'portal-nav-modal-backdrop';
    backdrop.innerHTML = `
      <div id="portal-nav-dialog" role="dialog" aria-modal="true">
        <div class="portal-modal-header">
          <div class="portal-modal-title">
            <span style="color:#ffc83b;">🌐</span>
            <span>周淵凱的學習歷程・全站快速跳轉中心</span>
          </div>
          <button class="portal-close-btn" id="portal-modal-close-btn">✕ 關閉 (Esc)</button>
        </div>

        <div class="portal-search-box">
          <span style="color:#64748b; font-size:16px;">🔍</span>
          <input type="text" id="portal-search-input" placeholder="搜尋全站 15+ 個專案與頁面 (輸入關鍵字直接過濾)..." autocomplete="off">
        </div>

        <div class="portal-list-scroll" id="portal-list-container">
          <!-- 項目由 JS 動態渲染 -->
        </div>

        <div class="portal-modal-footer">
          <span>💡 提示：點擊任意項目立即跳轉，按 <b>Esc</b> 或點擊背景關閉</span>
          <a href="${ROOT}index.html" style="color:#ffc83b; text-decoration:none; font-weight:700;">🏠 回到首頁儀表板 ➔</a>
        </div>
      </div>
    `;

    document.body.appendChild(floatBtn);
    document.body.appendChild(backdrop);

    // 渲染清單
    function renderPortalList(query = '') {
      const container = document.getElementById('portal-list-container');
      container.innerHTML = '';
      const q = query.toLowerCase().trim();
      const currentUrl = decodeURIComponent(window.location.href.split('?')[0].split('#')[0]);

      PORTAL_PAGES.forEach(group => {
        const filtered = group.items.filter(it => 
          it.title.toLowerCase().includes(q) ||
          it.desc.toLowerCase().includes(q) ||
          it.path.toLowerCase().includes(q)
        );

        if (filtered.length === 0) return;

        const groupDiv = document.createElement('div');
        groupDiv.className = 'portal-group';

        const label = document.createElement('div');
        label.className = 'portal-group-label';
        label.textContent = group.category;
        groupDiv.appendChild(label);

        const grid = document.createElement('div');
        grid.className = 'portal-items-grid';

        filtered.forEach(it => {
          const targetUrl = ROOT + it.path;
          const decodedTarget = decodeURIComponent(targetUrl);
          const isCurrent = currentUrl === decodedTarget || currentUrl.endsWith('/' + it.path) || (it.path === 'index.html' && (currentUrl.endsWith('/livesite/') || currentUrl.endsWith('/livesite') || currentUrl.endsWith(':8080/') || currentUrl.endsWith('/index.html')));

          const a = document.createElement('a');
          a.href = targetUrl;
          a.className = `portal-item-link ${isCurrent ? 'current-page' : ''}`;

          let badgeHtml = '';
          if (isCurrent) {
            badgeHtml = `<span class="portal-badge current">📍 目前頁面</span>`;
          } else if (it.tag) {
            badgeHtml = `<span class="portal-badge">${it.tag}</span>`;
          }

          a.innerHTML = `
            <div class="portal-item-info">
              <div class="portal-item-title">
                <i class="${it.icon || 'fa-solid fa-folder'}" style="color:#ffc83b; font-size:13px; width:16px; text-align:center;"></i>
                <span>${it.title}</span>
              </div>
              <div class="portal-item-desc">${it.desc}</div>
            </div>
            ${badgeHtml}
          `;
          grid.appendChild(a);
        });

        groupDiv.appendChild(grid);
        container.appendChild(groupDiv);
      });

      if (container.children.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b;">查無符合「${query}」的專案或頁面</div>`;
      }
    }

    renderPortalList();

    // 彈窗開啟與關閉控制
    function openPortal() {
      backdrop.classList.add('open');
      const input = document.getElementById('portal-search-input');
      input.value = '';
      renderPortalList('');
      setTimeout(() => input.focus(), 80);
    }

    function closePortal() {
      backdrop.classList.remove('open');
    }

    floatBtn.addEventListener('click', openPortal);
    document.getElementById('portal-modal-close-btn').addEventListener('click', closePortal);

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closePortal();
    });

    // 搜尋輸入監聽
    document.getElementById('portal-search-input').addEventListener('input', (e) => {
      renderPortalList(e.target.value);
    });

    // 鍵盤快速鍵監聽 (Ctrl+K / Cmd+K / Esc)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (backdrop.classList.contains('open')) {
          closePortal();
        } else {
          openPortal();
        }
      }
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closePortal();
      }
    });
  }

  // DOM 載入後初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createPortalDOM);
  } else {
    createPortalDOM();
  }
})();
