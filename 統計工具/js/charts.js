/**
 * ==========================================================================
 * 統計圖表視覺化渲染引擎 (Tally Charts Engine)
 * ==========================================================================
 * 純原生 HTML5 Canvas 實現，支援 Retina 高畫質螢幕、平滑漸層與自適應主題。
 */

const TallyCharts = {
  // 配色方案
  PALETTE: [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#6366f1', '#f97316', '#14b8a6'
  ],

  /**
   * 設置 Canvas 支援高解析度 (Retina 2x/3x)
   * @param {HTMLCanvasElement} canvas
   * @returns {CanvasRenderingContext2D}
   */
  setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // 依據容器寬高調整
    const width = rect.width || canvas.width;
    const height = rect.height || canvas.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    return { ctx, width, height };
  },

  /**
   * 繪製圓餅/環形分佈圖 (Donut Distribution Chart)
   * @param {string} canvasId
   * @param {Array<Object>} items
   */
  renderPieChart(canvasId, items) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    const validItems = items.filter(i => (i.count || 0) > 0);
    const totalCount = validItems.reduce((sum, i) => sum + i.count, 0);

    if (totalCount === 0) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('目前無計數數據可繪製圓餅圖', width / 2, height / 2);
      return;
    }

    const centerX = width * 0.38;
    const centerY = height / 2;
    const outerRadius = Math.min(centerX - 20, centerY - 20);
    const innerRadius = outerRadius * 0.55;

    let startAngle = -Math.PI / 2;

    validItems.forEach((item, index) => {
      const sliceAngle = (item.count / totalCount) * 2 * Math.PI;
      const color = item.color || this.PALETTE[index % this.PALETTE.length];

      // 繪製環形切片
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // 邊界微白光
      ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--bg-card-solid').trim() || '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // 圓心中間文字
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${totalCount}`, centerX, centerY - 8);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8';
    ctx.fillText('總筆數', centerX, centerY + 12);

    // 右側圖例 (Legend)
    const legendX = width * 0.68;
    let legendY = 24;
    const lineHeight = 24;

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    validItems.slice(0, 8).forEach((item, index) => {
      const color = item.color || this.PALETTE[index % this.PALETTE.length];
      const percentage = Math.round((item.count / totalCount) * 100);

      // 色塊點
      ctx.beginPath();
      ctx.arc(legendX, legendY, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // 文字
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#0f172a';
      ctx.font = '12px sans-serif';
      const label = item.name.length > 8 ? item.name.substring(0, 7) + '…' : item.name;
      ctx.fillText(`${label} (${percentage}%)`, legendX + 12, legendY);

      legendY += lineHeight;
    });
  },

  /**
   * 繪製項目計數排行長條圖 (Bar Chart)
   * @param {string} canvasId
   * @param {Array<Object>} items
   */
  renderBarChart(canvasId, items) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    const sorted = [...items].sort((a, b) => (b.count || 0) - (a.count || 0)).slice(0, 6);
    const maxVal = Math.max(...sorted.map(i => i.count || 0), 10);

    if (sorted.length === 0 || sorted.every(i => i.count === 0)) {
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('目前無項目計數可繪製長條圖', width / 2, height / 2);
      return;
    }

    const paddingLeft = 90;
    const paddingRight = 50;
    const paddingTop = 20;
    const paddingBottom = 20;
    const chartWidth = width - paddingLeft - paddingRight;
    const barHeight = Math.min(26, (height - paddingTop - paddingBottom) / sorted.length - 12);
    const stepY = (height - paddingTop - paddingBottom) / sorted.length;

    sorted.forEach((item, index) => {
      const y = paddingTop + index * stepY + (stepY - barHeight) / 2;
      const barW = Math.max(6, ((item.count || 0) / maxVal) * chartWidth);
      const color = item.color || this.PALETTE[index % this.PALETTE.length];

      // 項目名稱 (左側)
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#0f172a';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const label = item.name.length > 7 ? item.name.substring(0, 6) + '…' : item.name;
      ctx.fillText(label, paddingLeft - 10, y + barHeight / 2);

      // 背景導引條
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-hover').trim() || '#f1f5f9';
      this.drawRoundedRect(ctx, paddingLeft, y, chartWidth, barHeight, 6);
      ctx.fill();

      // 主進度長條
      const grad = ctx.createLinearGradient(paddingLeft, 0, paddingLeft + barW, 0);
      grad.addColorStop(0, color);
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      this.drawRoundedRect(ctx, paddingLeft, y, barW, barHeight, 6);
      ctx.fill();

      // 右側數值文字
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${item.count || 0} 筆`, paddingLeft + barW + 8, y + barHeight / 2);
    });
  },

  /**
   * 繪製 7 天歷史走勢圖 (Trend Line Chart)
   * @param {string} canvasId
   * @param {Array<Object>} trendData [{ date, count, label }]
   */
  renderTrendChart(canvasId, trendData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const { ctx, width, height } = this.setupCanvas(canvas);

    ctx.clearRect(0, 0, width, height);

    if (!trendData || trendData.length === 0) return;

    const paddingX = 40;
    const paddingTop = 30;
    const paddingBottom = 40;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...trendData.map(d => d.count), 15);
    const stepX = chartW / (trendData.length - 1);

    const points = trendData.map((d, i) => ({
      x: paddingX + i * stepX,
      y: paddingTop + chartH - (d.count / maxVal) * chartH,
      data: d
    }));

    // 繪製背景水平參考網格
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color').trim() || '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let i = 0; i <= 3; i++) {
      const gridY = paddingTop + (chartH / 3) * i;
      ctx.beginPath();
      ctx.moveTo(paddingX, gridY);
      ctx.lineTo(paddingX + chartW, gridY);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 繪製漸層面積區域
    const areaGrad = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartH);
    areaGrad.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
    areaGrad.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, paddingTop + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, paddingTop + chartH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // 繪製折線
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 繪製節點與數值標籤
    points.forEach(p => {
      // 外白圈
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 數值
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary').trim() || '#0f172a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${p.data.count}`, p.x, p.y - 8);

      // 底部日期標籤
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-muted').trim() || '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(p.data.label, p.x, paddingTop + chartH + 10);
    });
  },

  /**
   * 輔助函式：繪製圓角矩形
   */
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
};

window.TallyCharts = TallyCharts;
