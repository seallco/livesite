/**
 * ==========================================================================
 * 產線數量與良率統計工作台 - 主應用邏輯 (Factory Production & Yield Rate Controller)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 應用狀態
  const AppState = {
    currentDate: TallyStorage.getTodayDateString(),
    selectedShift: 'ALL',
    selectedLine: 'ALL',
    selectedCode: 'ALL',
    selectedColumnI: 'ALL', // 'ALL' | 'UNMODIFIED' | 'MODIFIED'
    searchQuery: '',
    currentView: 'cards', // 'cards' | 'table' | 'analytics'
    soundEnabled: true,
    theme: localStorage.getItem('tally_theme') || 'light'
  };

  // 當前編輯 Modal 暫存照片庫
  let currentModalPhotos = [];

  // 音效引擎 (Web Audio API)
  const AudioEffects = {
    ctx: null,

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    },

    playTapSound() {
      if (!AppState.soundEnabled) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  };

  // DOM 元素快取
  const DOM = {
    currentDateInput: document.getElementById('current-date-input'),
    dateWeekdayBadge: document.getElementById('date-weekday-badge'),
    btnPrevDay: document.getElementById('btn-prev-day'),
    btnNextDay: document.getElementById('btn-next-day'),
    btnToday: document.getElementById('btn-today'),
    searchInput: document.getElementById('search-input'),

    // 篩選選單
    filterShiftSelect: document.getElementById('filter-shift-select'),
    filterLineSelect: document.getElementById('filter-line-select'),
    filterCodeSelect: document.getElementById('filter-code-select'),
    filterColumnISelect: document.getElementById('filter-column-i-select'),

    // KPI
    kpiTotalProduction: document.getElementById('kpi-total-production'),
    kpiTotalDefectsSub: document.getElementById('kpi-total-defects-sub'),
    kpiAvgYield: document.getElementById('kpi-avg-yield'),
    kpiItemCount: document.getElementById('kpi-item-count'),
    kpiUnmodifiedICount: document.getElementById('kpi-unmodified-i-count'),

    // Views
    btnViewCards: document.getElementById('btn-view-cards'),
    btnViewTable: document.getElementById('btn-view-table'),
    btnViewAnalytics: document.getElementById('btn-view-analytics'),
    viewCardsContainer: document.getElementById('view-cards-container'),
    viewTableContainer: document.getElementById('view-table-container'),
    viewAnalyticsContainer: document.getElementById('view-analytics-container'),

    // Containers
    itemsGridContainer: document.getElementById('items-grid-container'),
    emptyState: document.getElementById('empty-state'),
    tableBodyContainer: document.getElementById('table-body-container'),
    tableRecordCount: document.getElementById('table-record-count'),

    // Actions & Tools
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    btnExportCsv: document.getElementById('btn-export-csv'),
    btnExportImage: document.getElementById('btn-export-image'),
    btnPrintReport: document.getElementById('btn-print-report'),
    btnOpenAddModal: document.getElementById('btn-open-add-modal'),

    // Item Modal
    itemModal: document.getElementById('item-modal'),
    modalTitle: document.getElementById('modal-title'),
    itemForm: document.getElementById('item-form'),
    modalItemId: document.getElementById('modal-item-id'),
    inputItemDate: document.getElementById('input-item-date'),
    inputItemTimeSlot: document.getElementById('input-item-time-slot'),
    inputItemShift: document.getElementById('input-item-shift'),
    inputItemLineName: document.getElementById('input-item-line-name'),
    inputCustomLineName: document.getElementById('input-custom-line-name'),
    inputItemLineCode: document.getElementById('input-item-line-code'),
    inputItemHandoverPerson: document.getElementById('input-item-handover-person'),
    inputItemReceiverEngineer: document.getElementById('input-item-receiver-engineer'),
    staffPersonDatalist: document.getElementById('staff-person-datalist'),
    inputItemTotalProduction: document.getElementById('input-item-total-production'),
    inputItemDefectCount: document.getElementById('input-item-defect-count'),
    modalYieldPreview: document.getElementById('modal-yield-preview'),
    inputUnmodifiedItems: document.getElementById('input-unmodified-items'),
    unmodifiedChipsContainer: document.getElementById('unmodified-chips-container'),
    
    // 照片上傳元件
    photoUploadDropzone: document.getElementById('photo-upload-dropzone'),
    inputItemPhotos: document.getElementById('input-item-photos'),
    modalPhotoPreviewGrid: document.getElementById('modal-photo-preview-grid'),

    inputItemNotes: document.getElementById('input-item-notes'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnCancelModal: document.getElementById('btn-cancel-modal'),
    btnDeleteFromModal: document.getElementById('btn-delete-from-modal'),

    // Delete Confirm Modal
    deleteConfirmModal: document.getElementById('delete-confirm-modal'),
    deleteConfirmMsg: document.getElementById('delete-confirm-msg'),
    btnCloseDeleteModal: document.getElementById('btn-close-delete-modal'),
    btnCancelDelete: document.getElementById('btn-cancel-delete'),
    btnConfirmDelete: document.getElementById('btn-confirm-delete'),

    // Count Edit Modal
    countEditModal: document.getElementById('count-edit-modal'),
    countEditItemName: document.getElementById('count-edit-item-name'),
    directCountInput: document.getElementById('direct-count-input'),
    countEditPreview: document.getElementById('count-edit-preview'),
    btnCloseCountModal: document.getElementById('btn-close-count-modal'),
    btnCancelCountModal: document.getElementById('btn-cancel-count-modal'),
    btnSaveCount: document.getElementById('btn-save-count'),

    // Lightbox Photo Viewer
    imageLightboxModal: document.getElementById('image-lightbox-modal'),
    lightboxImg: document.getElementById('lightbox-img'),
    lightboxTitle: document.getElementById('lightbox-title'),
    btnDownloadLightboxImg: document.getElementById('btn-download-lightbox-img'),
    btnCloseLightbox: document.getElementById('btn-close-lightbox')
  };

  let activeEditingCountItemId = null;
  let activeDeletingItemId = null;

  // ==========================================================================
  // 初始化程序
  // ==========================================================================
  function init() {
    TallyStorage.initSampleDataIfEmpty();
    applyTheme(AppState.theme);
    DOM.currentDateInput.value = AppState.currentDate;
    updateDateDisplay();
    bindEvents();
    refreshAll();
  }

  // ==========================================================================
  // 核心渲染邏輯 (Renderers)
  // ==========================================================================

  function refreshAll() {
    updateDatalists();
    renderKPIs();
    renderMainContent();
  }

  /**
   * 取得當前過濾條件下的項目清單
   */
  function getFilteredItems() {
    let items = TallyStorage.getItemsByDate(AppState.currentDate);

    // 班別篩選 (早班 / 夜班)
    if (AppState.selectedShift !== 'ALL') {
      items = items.filter(i => (i.shift || '早班') === AppState.selectedShift);
    }

    // 生產線體篩選
    if (AppState.selectedLine !== 'ALL') {
      items = items.filter(i => (i.lineName || 'module') === AppState.selectedLine);
    }

    // 線別編號篩選 (1 / 2 / 3)
    if (AppState.selectedCode !== 'ALL') {
      items = items.filter(i => String(i.lineCode || '1') === AppState.selectedCode);
    }

    // 未改 I 欄位標記過濾
    if (AppState.selectedColumnI === 'UNMODIFIED') {
      items = items.filter(i => Boolean(i.unmodifiedColumnI || (i.unmodifiedItems && i.unmodifiedItems.trim())));
    } else if (AppState.selectedColumnI === 'MODIFIED') {
      items = items.filter(i => !i.unmodifiedColumnI && (!i.unmodifiedItems || !i.unmodifiedItems.trim()));
    }

    // 搜尋關鍵字過濾
    if (AppState.searchQuery.trim() !== '') {
      const q = AppState.searchQuery.trim().toLowerCase();
      items = items.filter(i => 
        (i.timeSlot && i.timeSlot.toLowerCase().includes(q)) ||
        (i.unmodifiedItems && i.unmodifiedItems.toLowerCase().includes(q)) ||
        (i.handoverPerson && i.handoverPerson.toLowerCase().includes(q)) || 
        (i.receiverEngineer && i.receiverEngineer.toLowerCase().includes(q)) ||
        (i.lineName && i.lineName.toLowerCase().includes(q)) ||
        (i.shift && i.shift.toLowerCase().includes(q)) ||
        (i.notes && i.notes.toLowerCase().includes(q))
      );
    }

    return items;
  }

  /**
   * 更新線體下拉選單與人員常用名單
   */
  function updateDatalists() {
    const lineNames = TallyStorage.getLineNames();

    if (DOM.inputItemLineName) {
      const currentModalVal = DOM.inputItemLineName.value;
      let modalHtml = '';
      lineNames.forEach(l => {
        const isSelected = l === currentModalVal ? 'selected' : '';
        modalHtml += `<option value="${escapeHtml(l)}" ${isSelected}>${escapeHtml(l)}</option>`;
      });
      modalHtml += `<option value="__NEW__">➕ 新增自訂線體...</option>`;
      DOM.inputItemLineName.innerHTML = modalHtml;
    }

    if (DOM.filterLineSelect) {
      const currentFilterVal = AppState.selectedLine;
      let filterHtml = `<option value="ALL" ${currentFilterVal === 'ALL' ? 'selected' : ''}>全部線體</option>`;
      lineNames.forEach(l => {
        const isSelected = l === currentFilterVal ? 'selected' : '';
        filterHtml += `<option value="${escapeHtml(l)}" ${isSelected}>${escapeHtml(l)}</option>`;
      });
      DOM.filterLineSelect.innerHTML = filterHtml;
    }

    const staffNames = TallyStorage.getAllStaffNames();
    if (DOM.staffPersonDatalist && staffNames.length > 0) {
      let html = '';
      staffNames.forEach(name => {
        html += `<option value="${escapeHtml(name)}">`;
      });
      DOM.staffPersonDatalist.innerHTML = html;
    }
  }

  /**
   * 渲染 KPI 指標數據
   */
  function renderKPIs() {
    const dayItems = TallyStorage.getItemsByDate(AppState.currentDate);
    const totalProd = dayItems.reduce((sum, i) => sum + (parseInt(i.totalProduction, 10) || 0), 0);
    const totalDefects = dayItems.reduce((sum, i) => sum + (parseInt(i.count, 10) || 0), 0);

    DOM.kpiTotalProduction.textContent = totalProd.toLocaleString();
    DOM.kpiTotalDefectsSub.textContent = `不良數總計：${totalDefects.toLocaleString()} 件`;
    DOM.kpiItemCount.textContent = dayItems.length;

    if (totalProd > 0) {
      const avgRate = Math.max(0, ((totalProd - totalDefects) / totalProd) * 100).toFixed(2);
      DOM.kpiAvgYield.textContent = avgRate;
    } else {
      DOM.kpiAvgYield.textContent = '100.00';
    }

    const unmodifiedICount = dayItems.filter(i => Boolean(i.unmodifiedColumnI || (i.unmodifiedItems && i.unmodifiedItems.trim()))).length;
    DOM.kpiUnmodifiedICount.textContent = unmodifiedICount;
  }

  /**
   * 渲染主區域（同步刷新所有視圖）
   */
  function renderMainContent() {
    const items = getFilteredItems();

    // 同步渲染卡片與表格檢視，確保切換時已是最新狀態，並能即時看到增刪結果
    renderCardsView(items);
    renderTableView(items);

    if (AppState.currentView === 'analytics') {
      renderAnalyticsView(items);
    }
  }

  /**
   * 渲染卡片式檢視 (大數字顯示 + 良率 + 照片縮圖列)
   */
  function renderCardsView(items) {
    if (items.length === 0) {
      DOM.itemsGridContainer.innerHTML = '';
      DOM.emptyState.classList.remove('hidden');
      return;
    }

    DOM.emptyState.classList.add('hidden');
    let html = '';

    items.forEach(item => {
      const itemColor = item.color || '#3b82f6';
      const yieldStr = TallyStorage.calculateYieldRate(item.totalProduction, item.count);
      const yieldNum = parseFloat(yieldStr);
      
      let yieldColorClass = 'text-emerald';
      if (yieldNum < 95.0) yieldColorClass = 'text-danger';
      else if (yieldNum < 98.0) yieldColorClass = 'text-warning';

      const metaTags = [];
      
      // 班別
      if (item.shift) {
        const isNight = item.shift === '夜班';
        metaTags.push(`
          <span class="meta-tag tag-shift" title="所屬班別">
            <i class="fa-solid ${isNight ? 'fa-moon' : 'fa-sun'}"></i> ${escapeHtml(item.shift)}
          </span>
        `);
      }

      // 生產時間段
      if (item.timeSlot) {
        metaTags.push(`
          <span class="meta-tag tag-time-slot" title="生產時間段">
            <i class="fa-regular fa-clock"></i> ${escapeHtml(item.timeSlot)}
          </span>
        `);
      }

      // 照片數量標籤
      if (item.images && item.images.length > 0) {
        metaTags.push(`
          <span class="meta-tag tag-photo" style="background: rgba(14, 165, 233, 0.15); color: #0284c7; border-color: rgba(14, 165, 233, 0.3);" title="附帶現場照片">
            <i class="fa-solid fa-camera"></i> ${item.images.length} 張照片
          </span>
        `);
      }

      // 未改 I 欄位項目細項標記
      const unmodifiedText = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '');
      if (unmodifiedText) {
        metaTags.push(`
          <span class="meta-tag tag-unmodified-i" title="⚠️ 未改細項：${escapeHtml(unmodifiedText)}">
            <i class="fa-solid fa-triangle-exclamation"></i> 未改: ${escapeHtml(unmodifiedText)}
          </span>
        `);
      }

      // 交班人員
      if (item.handoverPerson) {
        metaTags.push(`
          <span class="meta-tag tag-person" title="交班人員">
            <i class="fa-solid fa-user-tag"></i> 交班: ${escapeHtml(item.handoverPerson)}
          </span>
        `);
      }

      // 接班工程師
      if (item.receiverEngineer) {
        metaTags.push(`
          <span class="meta-tag tag-engineer" title="接班工程師">
            <i class="fa-solid fa-user-gear"></i> 接班: ${escapeHtml(item.receiverEngineer)}
          </span>
        `);
      }

      const metaTagsHtml = metaTags.length > 0 ? `<div class="item-meta-tags">${metaTags.join('')}</div>` : '';
      const notesHtml = item.notes ? `<div class="item-notes"><i class="fa-regular fa-note-sticky"></i> ${escapeHtml(item.notes)}</div>` : '';
      const cardTitle = `${item.lineName} - ${item.lineCode} 號線`;

      // 照片展示列
      let photoStripHtml = '';
      if (item.images && item.images.length > 0) {
        photoStripHtml = `
          <div class="card-photo-strip">
            ${item.images.map((src, i) => `
              <div class="card-photo-item btn-view-photo" data-src="${escapeHtml(src)}" data-title="${escapeHtml(cardTitle)} - 照片 ${i + 1}" title="點擊放大檢視照片">
                <img src="${src}" alt="產線照片">
              </div>
            `).join('')}
          </div>
        `;
      }

      html += `
        <div class="item-card" data-id="${item.id}">
          <div class="item-tag-strip" style="background-color: ${itemColor};"></div>
          
          <div class="item-card-header">
            <div class="item-title-area">
              <h3 class="item-title" title="${escapeHtml(cardTitle)}">
                <span class="meta-tag tag-line" style="font-size: 15px; padding: 4px 10px;">
                  <i class="fa-solid fa-industry"></i> ${escapeHtml(item.lineName)}
                </span>
                <span class="meta-tag tag-code" style="font-size: 15px; padding: 4px 10px;">
                  <i class="fa-solid fa-hashtag"></i> ${escapeHtml(item.lineCode)} 號線
                </span>
              </h3>
              ${metaTagsHtml}
            </div>
            <div class="item-actions-menu">
              <button type="button" class="btn-card-action btn-edit-item" data-id="${item.id}" title="編輯紀錄">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="btn-card-action btn-reset-item" data-id="${item.id}" title="歸零不良數">
                <i class="fa-solid fa-rotate-left"></i>
              </button>
              <button type="button" class="btn-card-action btn-delete-item" data-id="${item.id}" title="刪除紀錄">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>

          <!-- 生產與良率數據網格 -->
          <div class="card-metrics-grid">
            <div class="metric-box">
              <span class="metric-label">生產總數</span>
              <span class="metric-val">${(item.totalProduction || 1000).toLocaleString()}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">不良數量</span>
              <span class="metric-val" style="color: var(--color-danger);">${item.count || 0}</span>
            </div>
            <div class="metric-box">
              <span class="metric-label">當班良率</span>
              <span class="metric-val ${yieldColorClass}">${yieldStr}</span>
            </div>
          </div>

          <!-- 大字體數字計數顯示區 (點擊不良數 +1) -->
          <div class="tally-display-container" data-id="${item.id}" title="點擊此區不良數 +1">
            <div class="numeric-counter-display">
              <span class="numeric-count-value" style="color: ${itemColor};">${item.count || 0}</span>
              <span class="numeric-count-unit">不良件</span>
            </div>
            <div class="tally-add-hint">
              <i class="fa-solid fa-circle-plus"></i> 點擊不良件 +1
            </div>
          </div>

          ${photoStripHtml}
          ${notesHtml}

          <!-- 控制按鈕列 -->
          <div class="item-controls-bar">
            <button type="button" class="btn-stroke-add" data-id="${item.id}" title="不良件 +1">
              <i class="fa-solid fa-plus"></i> +1 不良
            </button>
            <button type="button" class="btn-sub-action btn-add-five" data-id="${item.id}" title="不良件 +5">
              <i class="fa-solid fa-square-plus"></i> +5
            </button>
            <button type="button" class="btn-icon-sub btn-minus-one" data-id="${item.id}" title="不良件 -1">
              <i class="fa-solid fa-minus"></i>
            </button>
            <button type="button" class="btn-icon-sub btn-custom-count" data-id="${item.id}" title="修改精確不良數量">
              <i class="fa-solid fa-hashtag"></i>
            </button>
          </div>
        </div>
      `;
    });

    DOM.itemsGridContainer.innerHTML = html;
  }

  /**
   * 渲染表格檢視
   */
  function renderTableView(items) {
    DOM.tableRecordCount.textContent = `共 ${items.length} 筆紀錄`;
    if (items.length === 0) {
      DOM.tableBodyContainer.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 40px; color: var(--text-muted);">
            目前無符合條件的產線紀錄
          </td>
        </tr>
      `;
      return;
    }

    let html = '';
    items.forEach((item, index) => {
      const itemColor = item.color || '#3b82f6';
      const yieldStr = TallyStorage.calculateYieldRate(item.totalProduction, item.count);
      const yieldNum = parseFloat(yieldStr);
      let yieldColorStyle = 'color: var(--color-emerald);';
      if (yieldNum < 95.0) yieldColorStyle = 'color: var(--color-danger);';
      else if (yieldNum < 98.0) yieldColorStyle = 'color: var(--color-warning);';

      const unmodifiedText = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '');
      const columnIBadge = unmodifiedText 
        ? `<span class="meta-tag tag-unmodified-i"><i class="fa-solid fa-triangle-exclamation"></i> 未改: ${escapeHtml(unmodifiedText)}</span>`
        : '<span class="meta-tag tag-modified-i"><i class="fa-solid fa-check"></i> 已全改</span>';

      let notesAndPhotosHtml = '';
      if (item.notes) {
        notesAndPhotosHtml += `<div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;"><i class="fa-regular fa-note-sticky"></i> ${escapeHtml(item.notes)}</div>`;
      }
      if (item.images && item.images.length > 0) {
        notesAndPhotosHtml += `<button type="button" class="btn-chip btn-view-photo" data-src="${escapeHtml(item.images[0])}" data-title="${escapeHtml(item.lineName)} 產線照片" style="color: #0284c7; border-color: rgba(14,165,233,0.4);"><i class="fa-solid fa-camera"></i> ${item.images.length} 張照片</button>`;
      }
      if (!notesAndPhotosHtml) {
        notesAndPhotosHtml = '<span class="text-muted" style="font-size: 12px;">-</span>';
      }

      html += `
        <tr data-id="${item.id}">
          <td><span class="badge">${index + 1}</span></td>
          <td><span class="meta-tag tag-shift">${escapeHtml(item.shift || '早班')}</span></td>
          <td><span class="meta-tag tag-time-slot">${escapeHtml(item.timeSlot || '08:00 - 10:00')}</span></td>
          <td><span class="meta-tag tag-line">${escapeHtml(item.lineName || 'module')}</span></td>
          <td><span class="meta-tag tag-code">${escapeHtml(item.lineCode || '1')} 號線</span></td>
          <td><strong>${escapeHtml(item.handoverPerson || '-')}</strong></td>
          <td><span class="meta-tag tag-engineer">${escapeHtml(item.receiverEngineer || '-')}</span></td>
          <td><strong>${(item.totalProduction || 1000).toLocaleString()}</strong></td>
          <td><strong style="color: var(--color-danger); font-size: 16px;">${item.count || 0}</strong></td>
          <td><strong style="${yieldColorStyle} font-size: 16px;">${yieldStr}</strong></td>
          <td>${columnIBadge}</td>
          <td>${notesAndPhotosHtml}</td>
          <td>
            <div class="table-actions-cell">
              <button type="button" class="btn-primary btn-table-stroke" data-id="${item.id}" style="padding: 5px 10px; font-size: 12px;">
                <i class="fa-solid fa-plus"></i> +1 不良
              </button>
              <button type="button" class="btn-secondary btn-table-minus" data-id="${item.id}" style="padding: 5px 8px; font-size: 12px;">
                <i class="fa-solid fa-minus"></i>
              </button>
              <button type="button" class="btn-icon btn-card-action btn-edit-item" data-id="${item.id}" title="編輯紀錄">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button type="button" class="btn-icon btn-card-action btn-delete-item" data-id="${item.id}" title="刪除紀錄">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    DOM.tableBodyContainer.innerHTML = html;
  }

  /**
   * 渲染統計圖表儀表板
   */
  function renderAnalyticsView(items) {
    const chartItems = items.map(item => ({
      name: `${item.lineName} ${item.lineCode}號線 (${item.timeSlot || '當班'})`,
      count: item.count,
      color: item.color
    }));

    TallyCharts.renderPieChart('chart-pie-canvas', chartItems);
    TallyCharts.renderBarChart('chart-bar-canvas', chartItems);
    const trendData = TallyStorage.getHistoryTrend(7);
    TallyCharts.renderTrendChart('chart-trend-canvas', trendData);
  }

  // ==========================================================================
  // 照片壓縮與上傳處理
  // ==========================================================================

  function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFilesUpload(fileList) {
    if (!fileList || fileList.length === 0) return;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type && file.type.startsWith('image/')) {
        try {
          const compressedBase64 = await compressImageFile(file);
          currentModalPhotos.push(compressedBase64);
        } catch (err) {
          console.error('照片壓縮處理失敗:', err);
        }
      }
    }
    renderModalPhotoPreviews();
  }

  function renderModalPhotoPreviews() {
    if (!DOM.modalPhotoPreviewGrid) return;
    let html = '';
    currentModalPhotos.forEach((src, idx) => {
      html += `
        <div class="photo-thumb-item" data-index="${idx}">
          <img src="${src}" class="photo-thumb-img" alt="現場照片縮圖" data-src="${escapeHtml(src)}">
          <button type="button" class="btn-remove-thumb" data-index="${idx}" title="移除照片">✕</button>
        </div>
      `;
    });
    DOM.modalPhotoPreviewGrid.innerHTML = html;
  }

  function openLightbox(src, title = '產線現場照片檢視') {
    if (!src || !DOM.imageLightboxModal) return;
    DOM.lightboxImg.src = src;
    DOM.lightboxTitle.textContent = title;
    DOM.btnDownloadLightboxImg.href = src;
    DOM.imageLightboxModal.classList.add('active');
  }

  function closeLightbox() {
    if (!DOM.imageLightboxModal) return;
    DOM.imageLightboxModal.classList.remove('active');
    DOM.lightboxImg.src = '';
  }

  // ==========================================================================
  // 事件綁定 (Event Handlers)
  // ==========================================================================

  function bindEvents() {
    // 日期選擇變更
    DOM.currentDateInput.addEventListener('change', (e) => {
      if (e.target.value) {
        AppState.currentDate = e.target.value;
        updateDateDisplay();
        refreshAll();
      }
    });

    // 前一天 / 後一天 / 今天按鈕
    DOM.btnPrevDay.addEventListener('click', () => changeDay(-1));
    DOM.btnNextDay.addEventListener('click', () => changeDay(1));
    DOM.btnToday.addEventListener('click', () => {
      AppState.currentDate = TallyStorage.getTodayDateString();
      DOM.currentDateInput.value = AppState.currentDate;
      updateDateDisplay();
      refreshAll();
    });

    // 搜尋輸入監聽
    DOM.searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      renderMainContent();
    });

    // 班別下拉選單篩選
    DOM.filterShiftSelect.addEventListener('change', (e) => {
      AppState.selectedShift = e.target.value;
      renderMainContent();
    });

    // 生產線體下拉選單篩選
    DOM.filterLineSelect.addEventListener('change', (e) => {
      AppState.selectedLine = e.target.value;
      renderMainContent();
    });

    // 線別編號下拉選單篩選
    DOM.filterCodeSelect.addEventListener('change', (e) => {
      AppState.selectedCode = e.target.value;
      renderMainContent();
    });

    // I 欄位標記篩選
    DOM.filterColumnISelect.addEventListener('change', (e) => {
      AppState.selectedColumnI = e.target.value;
      renderMainContent();
    });

    // 彈窗生產線體選單切換
    DOM.inputItemLineName.addEventListener('change', (e) => {
      if (e.target.value === '__NEW__') {
        DOM.inputCustomLineName.classList.remove('hidden');
        DOM.inputCustomLineName.focus();
      } else {
        DOM.inputCustomLineName.classList.add('hidden');
      }
    });

    // 未改 I 欄位標籤按鈕點擊事件
    if (DOM.unmodifiedChipsContainer) {
      DOM.unmodifiedChipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.btn-chip');
        if (!chip) return;
        const val = chip.dataset.val;
        if (!val) return;

        const currentInput = DOM.inputUnmodifiedItems.value.trim();
        if (!currentInput) {
          DOM.inputUnmodifiedItems.value = val;
        } else if (!currentInput.includes(val)) {
          DOM.inputUnmodifiedItems.value = currentInput + ', ' + val;
        }
      });
    }

    // Modal 生產總數與不良數即時計算良率
    DOM.inputItemTotalProduction.addEventListener('input', updateModalYieldPreview);
    DOM.inputItemDefectCount.addEventListener('input', updateModalYieldPreview);

    // ========================================================================
    // 照片上傳事件 (點選、拖曳、Ctrl+V 貼上剪貼簿)
    // ========================================================================
    if (DOM.photoUploadDropzone) {
      DOM.photoUploadDropzone.addEventListener('click', () => {
        DOM.inputItemPhotos.click();
      });

      DOM.inputItemPhotos.addEventListener('change', (e) => {
        handleFilesUpload(e.target.files);
        DOM.inputItemPhotos.value = '';
      });

      DOM.photoUploadDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        DOM.photoUploadDropzone.classList.add('drag-over');
      });

      DOM.photoUploadDropzone.addEventListener('dragleave', () => {
        DOM.photoUploadDropzone.classList.remove('drag-over');
      });

      DOM.photoUploadDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        DOM.photoUploadDropzone.classList.remove('drag-over');
        if (e.dataTransfer && e.dataTransfer.files) {
          handleFilesUpload(e.dataTransfer.files);
        }
      });
    }

    // 剪貼簿截圖直接貼上
    window.addEventListener('paste', (e) => {
      if (DOM.itemModal.classList.contains('active')) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
          const item = items[index];
          if (item.kind === 'file' && item.type.startsWith('image/')) {
            const blob = item.getAsFile();
            handleFilesUpload([blob]);
          }
        }
      }
    });

    // 縮圖刪除按鈕與縮圖點擊放大
    if (DOM.modalPhotoPreviewGrid) {
      DOM.modalPhotoPreviewGrid.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-thumb');
        if (removeBtn) {
          e.stopPropagation();
          const idx = parseInt(removeBtn.dataset.index, 10);
          if (!isNaN(idx)) {
            currentModalPhotos.splice(idx, 1);
            renderModalPhotoPreviews();
          }
          return;
        }

        const thumbImg = e.target.closest('.photo-thumb-img');
        if (thumbImg) {
          openLightbox(thumbImg.dataset.src, '現場照片預覽');
        }
      });
    }

    // Lightbox 關閉控制
    if (DOM.btnCloseLightbox) {
      DOM.btnCloseLightbox.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeLightbox();
      });
    }
    if (DOM.imageLightboxModal) {
      DOM.imageLightboxModal.addEventListener('click', (e) => {
        if (e.target === DOM.imageLightboxModal) closeLightbox();
      });
    }

    // 視圖切換按鈕
    DOM.btnViewCards.addEventListener('click', () => switchView('cards'));
    DOM.btnViewTable.addEventListener('click', () => switchView('table'));
    DOM.btnViewAnalytics.addEventListener('click', () => switchView('analytics'));

    // 主題切換
    DOM.btnThemeToggle.addEventListener('click', () => {
      const nextTheme = AppState.theme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      if (AppState.currentView === 'analytics') {
        renderAnalyticsView(getFilteredItems());
      }
    });

    // 音效切換
    DOM.btnSoundToggle.addEventListener('click', () => {
      AppState.soundEnabled = !AppState.soundEnabled;
      DOM.btnSoundToggle.innerHTML = AppState.soundEnabled ? 
        '<i class="fa-solid fa-volume-high"></i>' : 
        '<i class="fa-solid fa-volume-xmark" style="color: var(--color-danger);"></i>';
      DOM.btnSoundToggle.title = AppState.soundEnabled ? '音效已開啟' : '音效已靜音';
    });

    // 匯出 CSV / 圖片 / 列印
    DOM.btnExportCsv.addEventListener('click', () => TallyStorage.exportToCSV(AppState.currentDate));
    DOM.btnExportImage.addEventListener('click', generateImageReport);
    DOM.btnPrintReport.addEventListener('click', () => window.print());

    // 新增項目 Modal 打開
    DOM.btnOpenAddModal.addEventListener('click', () => openItemModal(null));

    // Modal 關閉按鈕
    DOM.btnCloseModal.addEventListener('click', closeItemModal);
    DOM.btnCancelModal.addEventListener('click', closeItemModal);
    DOM.itemModal.addEventListener('click', (e) => {
      if (e.target === DOM.itemModal) closeItemModal();
    });

    // Modal 表單提交 (form submit 事件 + 外部確認儲存按鈕)
    DOM.itemForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveItemFromModal();
    });

    // 外部確認儲存按鈕 (footer 已移至 form 外，改為直接呼叫)
    const btnSaveItem = document.getElementById('btn-save-item');
    if (btnSaveItem) {
      btnSaveItem.addEventListener('click', (e) => {
        e.preventDefault();
        saveItemFromModal();
      });
    }

    // 編輯 Modal 內的刪除按鈕
    DOM.btnDeleteFromModal.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const itemId = DOM.modalItemId.value;
      if (itemId) openDeleteConfirmModal(itemId, e);
    });

    // 刪除確認 Modal 控制
    DOM.btnCloseDeleteModal.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDeleteConfirmModal();
    });
    DOM.btnCancelDelete.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDeleteConfirmModal();
    });
    DOM.btnConfirmDelete.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      confirmDeleteAction();
    });

    // Count Edit Modal 控制
    DOM.btnCloseCountModal.addEventListener('click', closeCountEditModal);
    DOM.btnCancelCountModal.addEventListener('click', closeCountEditModal);
    DOM.countEditModal.addEventListener('click', (e) => {
      if (e.target === DOM.countEditModal) closeCountEditModal();
    });
    DOM.btnSaveCount.addEventListener('click', saveCountFromModal);
    DOM.directCountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10) || 0;
      DOM.countEditPreview.innerHTML = `
        <div style="font-size: 18px; font-weight: 700; color: var(--color-danger);">
          不良總計：${val} 件
        </div>
      `;
    });

    // ========================================================================
    // 卡片區域點擊事件委派 (單一全域綁定)
    // ========================================================================
    if (DOM.itemsGridContainer) {
      DOM.itemsGridContainer.addEventListener('click', (e) => {
        // 照片縮圖點擊放大
        const photoItem = e.target.closest('.btn-view-photo');
        if (photoItem) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(photoItem.dataset.src, photoItem.dataset.title || '產線照片');
          return;
        }

        // 1. 刪除按鈕
        const deleteBtn = e.target.closest('.btn-delete-item');
        if (deleteBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = deleteBtn.dataset.id;
          if (id) openDeleteConfirmModal(id, e);
          return;
        }

        // 2. 編輯按鈕
        const editBtn = e.target.closest('.btn-edit-item');
        if (editBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = editBtn.dataset.id;
          if (id) openItemModal(id);
          return;
        }

        // 3. 歸零按鈕
        const resetBtn = e.target.closest('.btn-reset-item');
        if (resetBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = resetBtn.dataset.id;
          if (id) {
            const item = TallyStorage.getItemById(id);
            if (item && confirm(`確定要將「${item.lineName} ${item.lineCode}號線」的不良件數歸零嗎？`)) {
              TallyStorage.resetItemCount(id);
              refreshAll();
            }
          }
          return;
        }

        // 4. 不良數 +1 按鈕
        const addBtn = e.target.closest('.btn-stroke-add');
        if (addBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = addBtn.dataset.id;
          if (id) handleAddStroke(id, 1);
          return;
        }

        // 5. 不良數 +5 按鈕
        const addFiveBtn = e.target.closest('.btn-add-five');
        if (addFiveBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = addFiveBtn.dataset.id;
          if (id) handleAddStroke(id, 5);
          return;
        }

        // 6. 不良數 -1 按鈕
        const minusBtn = e.target.closest('.btn-minus-one');
        if (minusBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = minusBtn.dataset.id;
          if (id) handleMinusStroke(id, 1);
          return;
        }

        // 7. 自訂精確數字按鈕
        const customCountBtn = e.target.closest('.btn-custom-count');
        if (customCountBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = customCountBtn.dataset.id;
          if (id) openCountEditModal(id);
          return;
        }

        // 8. 點擊大數字區點數 +1
        const tallyArea = e.target.closest('.tally-display-container');
        if (tallyArea) {
          e.preventDefault();
          e.stopPropagation();
          const id = tallyArea.dataset.id;
          if (id) handleAddStroke(id, 1);
          return;
        }
      });
    }

    // ========================================================================
    // 表格區域點擊事件委派
    // ========================================================================
    if (DOM.tableBodyContainer) {
      DOM.tableBodyContainer.addEventListener('click', (e) => {
        const photoBtn = e.target.closest('.btn-view-photo');
        if (photoBtn) {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(photoBtn.dataset.src, photoBtn.dataset.title || '產線照片');
          return;
        }

        const deleteBtn = e.target.closest('.btn-delete-item');
        if (deleteBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = deleteBtn.dataset.id;
          if (id) openDeleteConfirmModal(id, e);
          return;
        }

        const editBtn = e.target.closest('.btn-edit-item');
        if (editBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = editBtn.dataset.id;
          if (id) openItemModal(id);
          return;
        }

        const strokeBtn = e.target.closest('.btn-table-stroke');
        if (strokeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = strokeBtn.dataset.id;
          if (id) handleAddStroke(id, 1);
          return;
        }

        const minusBtn = e.target.closest('.btn-table-minus');
        if (minusBtn) {
          e.preventDefault();
          e.stopPropagation();
          const id = minusBtn.dataset.id;
          if (id) handleMinusStroke(id, 1);
          return;
        }
      });
    }

    // 鍵盤快捷鍵
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        closeDeleteConfirmModal();
        closeItemModal();
        closeCountEditModal();
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (e.key === '+' || e.key === '=') {
        const firstItem = getFilteredItems()[0];
        if (firstItem) handleAddStroke(firstItem.id, 1);
      }
    });

    window.addEventListener('resize', () => {
      if (AppState.currentView === 'analytics') {
        renderAnalyticsView(getFilteredItems());
      }
    });
  }

  function updateModalYieldPreview() {
    const total = parseInt(DOM.inputItemTotalProduction.value, 10) || 0;
    const def = parseInt(DOM.inputItemDefectCount.value, 10) || 0;
    const yieldRateStr = TallyStorage.calculateYieldRate(total, def);
    DOM.modalYieldPreview.textContent = yieldRateStr;
  }

  function openDeleteConfirmModal(itemId, e = null) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const item = TallyStorage.getItemById(itemId);
    if (!item) return;

    activeDeletingItemId = itemId;
    DOM.deleteConfirmMsg.innerHTML = `確定要刪除「<strong>${escapeHtml(item.lineName)} ${escapeHtml(item.lineCode)} 號線 (${escapeHtml(item.shift)})</strong>」的產線紀錄嗎？`;
    DOM.deleteConfirmModal.classList.add('active');
  }

  function closeDeleteConfirmModal() {
    DOM.deleteConfirmModal.classList.remove('active');
    activeDeletingItemId = null;
  }

  function confirmDeleteAction() {
    if (!activeDeletingItemId) return;
    const deletedId = activeDeletingItemId;
    TallyStorage.deleteItem(deletedId);
    closeDeleteConfirmModal();
    closeItemModal();
    
    // 即時重新計算並渲染全部視圖
    refreshAll();
    showToast('🗑️ 產線紀錄已成功刪除！', 'danger');
  }

  /**
   * 即時 Toast 浮動通知元件
   */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'danger') icon = 'fa-trash-can';
    if (type === 'info') icon = 'fa-circle-info';

    toast.innerHTML = `
      <i class="fa-solid ${icon} toast-icon"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  function handleAddStroke(itemId, delta = 1) {
    const updated = TallyStorage.adjustCount(itemId, delta);
    if (!updated) return;
    AudioEffects.playTapSound();
    refreshAll();
  }

  function handleMinusStroke(itemId, delta = 1) {
    const updated = TallyStorage.adjustCount(itemId, -delta);
    if (!updated) return;
    AudioEffects.playTapSound();
    refreshAll();
  }

  function switchView(viewName) {
    AppState.currentView = viewName;
    DOM.btnViewCards.classList.toggle('active', viewName === 'cards');
    DOM.btnViewTable.classList.toggle('active', viewName === 'table');
    DOM.btnViewAnalytics.classList.toggle('active', viewName === 'analytics');

    DOM.viewCardsContainer.classList.toggle('hidden', viewName !== 'cards');
    DOM.viewTableContainer.classList.toggle('hidden', viewName !== 'table');
    DOM.viewAnalyticsContainer.classList.toggle('hidden', viewName !== 'analytics');

    renderMainContent();
  }

  function applyTheme(themeName) {
    AppState.theme = themeName;
    localStorage.setItem('tally_theme', themeName);
    document.body.className = `theme-${themeName}`;
    DOM.btnThemeToggle.innerHTML = themeName === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }

  function changeDay(deltaDays) {
    const parts = AppState.currentDate.split('-');
    const cur = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    cur.setDate(cur.getDate() + deltaDays);

    const year = cur.getFullYear();
    const month = String(cur.getMonth() + 1).padStart(2, '0');
    const day = String(cur.getDate()).padStart(2, '0');

    AppState.currentDate = `${year}-${month}-${day}`;
    DOM.currentDateInput.value = AppState.currentDate;
    updateDateDisplay();
    refreshAll();
  }

  function updateDateDisplay() {
    DOM.dateWeekdayBadge.textContent = TallyStorage.getWeekdayString(AppState.currentDate);
  }

  // ==========================================================================
  // Modal 彈窗表單處理
  // ==========================================================================

  function openItemModal(itemId = null) {
    updateDatalists();
    DOM.inputCustomLineName.classList.add('hidden');
    DOM.inputCustomLineName.value = '';

    if (itemId) {
      // 編輯模式
      const item = TallyStorage.getItemById(itemId);
      if (!item) return;

      DOM.modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 編輯產線紀錄';
      DOM.modalItemId.value = item.id;
      DOM.inputItemDate.value = item.date;
      DOM.inputItemTimeSlot.value = item.timeSlot || '08:00 - 10:00';
      DOM.inputItemShift.value = item.shift || '早班';

      const lineNames = TallyStorage.getLineNames();
      if (!lineNames.includes(item.lineName)) {
        TallyStorage.addCustomLine(item.lineName);
        updateDatalists();
      }
      DOM.inputItemLineName.value = item.lineName || 'module';

      DOM.inputItemLineCode.value = item.lineCode || '1';
      DOM.inputItemHandoverPerson.value = item.handoverPerson || '';
      DOM.inputItemReceiverEngineer.value = item.receiverEngineer || '';
      DOM.inputItemTotalProduction.value = item.totalProduction || 1000;
      DOM.inputItemDefectCount.value = item.count || 0;
      DOM.inputUnmodifiedItems.value = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '');
      DOM.inputItemNotes.value = item.notes || '';

      // 載入該紀錄之照片
      currentModalPhotos = Array.isArray(item.images) ? [...item.images] : [];
      renderModalPhotoPreviews();

      DOM.btnDeleteFromModal.classList.remove('hidden');

      const colorRadio = DOM.itemForm.querySelector(`input[name="item-color"][value="${item.color}"]`);
      if (colorRadio) colorRadio.checked = true;
    } else {
      // 新增模式
      DOM.modalTitle.innerHTML = '<i class="fa-solid fa-circle-plus"></i> 新增產線紀錄';
      DOM.modalItemId.value = '';
      DOM.inputItemDate.value = AppState.currentDate;
      DOM.inputItemTimeSlot.value = '08:00 - 10:00';
      DOM.inputItemShift.value = '早班';
      DOM.inputItemLineName.value = 'module';
      DOM.inputItemLineCode.value = '1';
      DOM.inputItemHandoverPerson.value = '';
      DOM.inputItemReceiverEngineer.value = '';
      DOM.inputItemTotalProduction.value = 1000;
      DOM.inputItemDefectCount.value = 0;
      DOM.inputUnmodifiedItems.value = '';
      DOM.inputItemNotes.value = '';

      // 清空照片
      currentModalPhotos = [];
      renderModalPhotoPreviews();

      DOM.btnDeleteFromModal.classList.add('hidden');

      const firstRadio = DOM.itemForm.querySelector('input[name="item-color"]');
      if (firstRadio) firstRadio.checked = true;
    }

    updateModalYieldPreview();
    DOM.itemModal.classList.add('active');
  }

  function closeItemModal() {
    DOM.itemModal.classList.remove('active');
    currentModalPhotos = [];
  }

  function saveItemFromModal() {
    let rawLineName = DOM.inputItemLineName.value;

    if (rawLineName === '__NEW__') {
      const customName = DOM.inputCustomLineName.value.trim();
      if (!customName) {
        alert('請輸入新線體名稱！');
        DOM.inputCustomLineName.focus();
        return;
      }
      TallyStorage.addCustomLine(customName);
      rawLineName = customName;
    } else if (!rawLineName) {
      alert('請選擇生產線體！');
      return;
    }

    const isEditMode = Boolean(DOM.modalItemId.value);
    const selectedColor = (DOM.itemForm.querySelector('input[name="item-color"]:checked') || {}).value || '#3b82f6';
    const unmodifiedText = DOM.inputUnmodifiedItems.value.trim();

    const itemData = {
      id: DOM.modalItemId.value || null,
      date: DOM.inputItemDate.value || AppState.currentDate,
      timeSlot: DOM.inputItemTimeSlot.value.trim() || '08:00 - 10:00',
      shift: DOM.inputItemShift.value || '早班',
      lineName: rawLineName,
      lineCode: DOM.inputItemLineCode.value || '1',
      handoverPerson: DOM.inputItemHandoverPerson.value.trim(),
      receiverEngineer: DOM.inputItemReceiverEngineer.value.trim(),
      totalProduction: parseInt(DOM.inputItemTotalProduction.value, 10) || 0,
      count: parseInt(DOM.inputItemDefectCount.value, 10) || 0,
      unmodifiedItems: unmodifiedText,
      unmodifiedColumnI: unmodifiedText !== '',
      images: [...currentModalPhotos], // 儲存照片
      color: selectedColor,
      notes: DOM.inputItemNotes.value.trim()
    };

    const savedItem = TallyStorage.upsertItem(itemData);
    closeItemModal();
    
    // 同步當前日期
    AppState.currentDate = itemData.date;
    DOM.currentDateInput.value = AppState.currentDate;
    updateDateDisplay();

    // 重置篩選條件，確保新增或修改後的紀錄能 100% 即時顯示在下方！
    AppState.selectedShift = 'ALL';
    AppState.selectedLine = 'ALL';
    AppState.selectedCode = 'ALL';
    AppState.selectedColumnI = 'ALL';
    AppState.searchQuery = '';

    if (DOM.filterShiftSelect) DOM.filterShiftSelect.value = 'ALL';
    if (DOM.filterLineSelect) DOM.filterLineSelect.value = 'ALL';
    if (DOM.filterCodeSelect) DOM.filterCodeSelect.value = 'ALL';
    if (DOM.filterColumnISelect) DOM.filterColumnISelect.value = 'ALL';
    if (DOM.searchInput) DOM.searchInput.value = '';

    // 即時刷新所有視圖與指標
    refreshAll();

    // 捲動至該筆紀錄並觸發高亮提示動畫
    setTimeout(() => {
      const targetElement = document.querySelector(`.item-card[data-id="${savedItem.id}"], tr[data-id="${savedItem.id}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.classList.add('item-highlight-pulse');
        setTimeout(() => targetElement.classList.remove('item-highlight-pulse'), 1500);
      }
    }, 100);

    showToast(isEditMode ? '✅ 產線紀錄已成功更新！' : '✅ 產線紀錄已成功新增並顯示於下方！', 'success');
  }

  // Direct Count Modal
  function openCountEditModal(itemId) {
    const item = TallyStorage.getItemById(itemId);
    if (!item) return;

    activeEditingCountItemId = itemId;
    DOM.countEditItemName.textContent = `產線：${item.lineName} ${item.lineCode}號線 (${item.timeSlot || '當班'})`;
    DOM.directCountInput.value = item.count || 0;
    DOM.countEditPreview.innerHTML = `
      <div style="font-size: 18px; font-weight: 700; color: var(--color-danger);">
        不良總計：${item.count || 0} 件
      </div>
    `;

    DOM.countEditModal.classList.add('active');
    DOM.directCountInput.focus();
    DOM.directCountInput.select();
  }

  function closeCountEditModal() {
    DOM.countEditModal.classList.remove('active');
    activeEditingCountItemId = null;
  }

  function saveCountFromModal() {
    if (!activeEditingCountItemId) return;
    const exactCount = parseInt(DOM.directCountInput.value, 10) || 0;
    TallyStorage.setExactCount(activeEditingCountItemId, exactCount);
    closeCountEditModal();
    refreshAll();
  }

  // ==========================================================================
  // 圖片報表生成 (Image Report Generator)
  // ==========================================================================

  function generateImageReport() {
    const items = getFilteredItems();
    if (items.length === 0) {
      alert('當前條件下無資料可產生統計圖卡！');
      return;
    }

    const totalProd = items.reduce((s, i) => s + (i.totalProduction || 0), 0);
    const totalDefects = items.reduce((s, i) => s + (i.count || 0), 0);
    const avgYield = totalProd > 0 ? (((totalProd - totalDefects) / totalProd) * 100).toFixed(2) + '%' : '100.00%';

    const canvas = document.createElement('canvas');
    canvas.width = 1040;
    canvas.height = 370 + items.length * 60;
    const ctx = canvas.getContext('2d');

    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const brandGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    brandGrad.addColorStop(0, '#3b82f6');
    brandGrad.addColorStop(0.5, '#10b981');
    brandGrad.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = brandGrad;
    ctx.fillRect(0, 0, canvas.width, 8);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('產線數量與良率統計交接日報表', 40, 56);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.fillText(`日期：${AppState.currentDate} (${TallyStorage.getWeekdayString(AppState.currentDate)})  |  共 ${items.length} 項產線紀錄`, 40, 90);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(40, 115, canvas.width - 80, 80);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${totalProd.toLocaleString()} 件`, 60, 168);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${avgYield}`, 360, 168);

    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${totalDefects.toLocaleString()} 件`, 660, 168);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px sans-serif';
    ctx.fillText('當日生產總數', 60, 138);
    ctx.fillText('當班平均良率', 360, 138);
    ctx.fillText('不良數量總計', 660, 138);

    let y = 230;
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('時間段 / 線體 / 線別', 50, y);
    ctx.fillText('交班人 / 接班工程師', 300, y);
    ctx.fillText('生產總數', 540, y);
    ctx.fillText('不良件數', 660, y);
    ctx.fillText('當班良率', 770, y);
    ctx.fillText('未改 I 欄位細項', 890, y);

    y += 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(canvas.width - 40, y);
    ctx.stroke();

    y += 32;
    items.forEach((item, idx) => {
      const yieldStr = TallyStorage.calculateYieldRate(item.totalProduction, item.count);
      const unmodifiedText = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '');

      ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.03)' : 'transparent';
      ctx.fillRect(40, y - 22, canvas.width - 80, 50);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`${item.timeSlot || '當班'}  |  ${item.lineName} (${item.lineCode}線)`, 50, y);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      const handoverStr = item.handoverPerson ? `交: ${item.handoverPerson}` : '';
      const receiverStr = item.receiverEngineer ? `接: ${item.receiverEngineer}` : '';
      const personDisplay = [handoverStr, receiverStr].filter(Boolean).join(' | ') || '-';
      ctx.fillText(personDisplay, 300, y);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '15px sans-serif';
      ctx.fillText(`${(item.totalProduction || 1000).toLocaleString()}`, 540, y);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${item.count || 0}`, 660, y);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${yieldStr}`, 770, y);

      ctx.fillStyle = unmodifiedText ? '#fbbf24' : '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText(unmodifiedText ? `⚠️ 未改: ${unmodifiedText}` : '已全改', 890, y);

      y += 54;
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '12px sans-serif';
    ctx.fillText(`產生時間：${new Date().toLocaleString()}  ・  產線數量與良率統計工作台`, 40, canvas.height - 20);

    const link = document.createElement('a');
    link.download = `產線數量與良率統計圖卡_${AppState.currentDate}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  init();
});
