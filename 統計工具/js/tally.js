/**
 * ==========================================================================
 * 正字筆畫渲染引擎 (Chinese Tally Marks Engine)
 * ==========================================================================
 * 依據標準正字五筆筆畫順序進行向量繪製與動態生成：
 * 1. 上橫 (Top Horizontal)
 * 2. 中豎 (Middle Vertical)
 * 3. 中橫 (Middle Right Horizontal)
 * 4. 左豎 (Left Down Vertical)
 * 5. 底橫 (Bottom Base Horizontal)
 */

const TallyEngine = {
  // SVG 座標定義 (基於 60x60 畫布)
  STROKE_DEFINITIONS: [
    { id: 1, name: '一 (上橫)', x1: 13, y1: 13, x2: 47, y2: 13 },
    { id: 2, name: '丨 (中豎)', x1: 30, y1: 13, x2: 30, y2: 47 },
    { id: 3, name: '一 (中橫)', x1: 30, y1: 30, x2: 47, y2: 30 },
    { id: 4, name: '丨 (左豎)', x1: 16, y1: 30, x2: 16, y2: 47 },
    { id: 5, name: '一 (底橫)', x1: 10, y1: 47, x2: 50, y2: 47 }
  ],

  /**
   * 計算正字數與餘筆
   * @param {number} count 總計數
   * @returns {{ fullZheng: number, remainder: number, total: number }}
   */
  breakdown(count) {
    const safeCount = Math.max(0, parseInt(count, 10) || 0);
    return {
      fullZheng: Math.floor(safeCount / 5),
      remainder: safeCount % 5,
      total: safeCount
    };
  },

  /**
   * 格式化正字字串摘要
   * @param {number} count
   * @returns {string} 例: "4 正 + 2 筆" 或 "0 筆"
   */
  formatSummary(count) {
    const { fullZheng, remainder, total } = this.breakdown(count);
    if (total === 0) return '0 筆 (未開始)';
    if (fullZheng === 0) return `${remainder} 筆`;
    if (remainder === 0) return `${fullZheng} 個「正」字`;
    return `${fullZheng} 個「正」字 + ${remainder} 筆`;
  },

  /**
   * 產生單個正字方塊的 SVG 內容
   * @param {number} strokeCount 當前方塊包含筆畫數 (0 ~ 5)
   * @param {boolean} isNewest 是否為最新增加的一筆（添加描繪動畫）
   * @param {string} strokeColor 自訂筆畫顏色 (可選)
   * @returns {string} SVG HTML String
   */
  renderSingleSVG(strokeCount = 5, isNewest = false, strokeColor = null) {
    const activeCount = Math.min(5, Math.max(0, strokeCount));
    const isFull = activeCount === 5;
    
    // 構造五條筆畫線條
    const lines = this.STROKE_DEFINITIONS.map((stroke, index) => {
      const isActive = index < activeCount;
      const isLatestStroke = isNewest && index === activeCount - 1;

      if (!isActive) {
        // 未畫筆畫：作為極淡的參考線 (在部分高精確模式或保留空間)
        return '';
      }

      const lineClass = isLatestStroke ? 'stroke-line stroke-animated' : 'stroke-line';
      const colorStyle = strokeColor ? `stroke: ${strokeColor};` : '';

      return `<line 
        x1="${stroke.x1}" 
        y1="${stroke.y1}" 
        x2="${stroke.x2}" 
        y2="${stroke.y2}" 
        class="${lineClass}"
        style="${colorStyle}"
        stroke-width="4.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />`;
    }).join('\n');

    return `
      <svg viewBox="0 0 60 60" class="zheng-svg ${isFull ? 'is-full' : ''}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="stroke-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="0.8" flood-opacity="0.15"/>
          </filter>
        </defs>
        <g filter="url(#stroke-shadow)" stroke="currentColor">
          ${lines}
        </g>
      </svg>
    `;
  },

  /**
   * 渲染一個項目整組正字方塊集合
   * @param {number} count 項目總筆數
   * @param {string} itemColor 項目代表色
   * @param {boolean} animateLast 是否動畫最後一筆
   * @returns {string} 包含多個 .zheng-tile 的 HTML
   */
  renderTallyTiles(count, itemColor = null, animateLast = false) {
    const { fullZheng, remainder, total } = this.breakdown(count);
    
    if (total === 0) {
      return `
        <div class="tally-empty-hint">
          <i class="fa-solid fa-hand-pointer"></i> 點擊此處立即畫上第 1 筆
        </div>
      `;
    }

    const tiles = [];

    // 渲染滿筆的「正」字
    for (let i = 0; i < fullZheng; i++) {
      const isLastBlock = i === fullZheng - 1 && remainder === 0;
      tiles.push(`
        <div class="zheng-tile full" title="滿 5 筆 (完整「正」字)">
          ${this.renderSingleSVG(5, animateLast && isLastBlock, itemColor)}
        </div>
      `);
    }

    // 渲染餘筆的正字方塊 (1 ~ 4 筆)
    if (remainder > 0) {
      tiles.push(`
        <div class="zheng-tile partial" title="進行中 (${remainder}/5 筆)">
          ${this.renderSingleSVG(remainder, animateLast, itemColor)}
        </div>
      `);
    }

    return tiles.join('');
  },

  /**
   * 渲染表格專用的迷你正字預覽
   * @param {number} count
   * @param {string} color
   * @returns {string}
   */
  renderMiniTableSummary(count, color = null) {
    const { fullZheng, remainder, total } = this.breakdown(count);
    if (total === 0) return '<span class="text-muted">0 筆</span>';
    
    let html = '';
    // 最多顯示 4 個小圖，超過以數字表示
    const displayZheng = Math.min(fullZheng, 4);
    for (let i = 0; i < displayZheng; i++) {
      html += `<span class="table-zheng-mini" style="color: ${color || 'var(--color-primary)'}">${this.renderSingleSVG(5, false, color)}</span>`;
    }
    if (fullZheng > 4) {
      html += `<span class="badge">+${fullZheng - 4}正</span>`;
    }
    if (remainder > 0) {
      html += `<span class="table-zheng-mini" style="color: ${color || 'var(--color-primary)'}">${this.renderSingleSVG(remainder, false, color)}</span>`;
    }
    return `<div class="table-zheng-preview">${html}</div>`;
  }
};

window.TallyEngine = TallyEngine;
