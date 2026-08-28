/**
 * ==========================================================================
 * 產線數量與良率統計工作台 - 資料儲存與管理模組 (LocalStorage Data Access Layer)
 * ==========================================================================
 */

const STORAGE_KEY = 'tally_factory_items_v3';

const TallyStorage = {
  /**
   * 取得所有儲存的項目
   * @returns {Array<Object>}
   */
  getAllItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('讀取 LocalStorage 失敗:', e);
      return [];
    }
  },

  /**
   * 儲存所有項目至 LocalStorage
   * @param {Array<Object>} items
   */
  saveAllItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('寫入 LocalStorage 失敗:', e);
    }
  },

  /**
   * 依日期取得項目清單
   * @param {string} dateStr 'YYYY-MM-DD'
   * @returns {Array<Object>}
   */
  getItemsByDate(dateStr) {
    const all = this.getAllItems();
    return all.filter(item => item.date === dateStr);
  },

  /**
   * 依 ID 取得單一項目
   * @param {string} id
   * @returns {Object|null}
   */
  getItemById(id) {
    const all = this.getAllItems();
    return all.find(item => item.id === id) || null;
  },

  /**
   * 計算當班良率 (%)
   * @param {number} totalProd 產能總數
   * @param {number} defectCount 不良數量
   * @returns {string} 例如 "99.5%"
   */
  calculateYieldRate(totalProd, defectCount) {
    const total = Math.max(0, parseInt(totalProd, 10) || 0);
    const def = Math.max(0, parseInt(defectCount, 10) || 0);
    if (total === 0) return '100.00%';
    const rate = Math.max(0, ((total - def) / total) * 100);
    return rate.toFixed(2) + '%';
  },

  /**
   * 新增或更新項目
   * @param {Object} itemData
   * @returns {Object} 儲存後的項目物件
   */
  upsertItem(itemData) {
    const all = this.getAllItems();
    const now = new Date().toISOString();

    const unmodifiedText = (itemData.unmodifiedItems !== undefined ? itemData.unmodifiedItems : (itemData.unmodifiedColumnI ? '未改 I 欄位' : '')).trim();
    const hasUnmodified = unmodifiedText !== '';

    if (itemData.id) {
      // 更新現有項目
      const index = all.findIndex(i => i.id === itemData.id);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          date: itemData.date || all[index].date,
          timeSlot: (itemData.timeSlot || all[index].timeSlot || '08:00 - 10:00').trim(),
          shift: (itemData.shift || all[index].shift || '早班').trim(),
          lineName: (itemData.lineName || all[index].lineName || 'module').trim(),
          lineCode: (itemData.lineCode || all[index].lineCode || '1').trim(),
          handoverPerson: (itemData.handoverPerson !== undefined ? itemData.handoverPerson : all[index].handoverPerson || '').trim(),
          receiverEngineer: (itemData.receiverEngineer !== undefined ? itemData.receiverEngineer : all[index].receiverEngineer || '').trim(),
          totalProduction: itemData.totalProduction !== undefined ? Math.max(0, parseInt(itemData.totalProduction, 10) || 0) : (all[index].totalProduction || 0),
          count: itemData.count !== undefined ? Math.max(0, parseInt(itemData.count, 10) || 0) : (all[index].count || 0),
          unmodifiedItems: unmodifiedText,
          unmodifiedColumnI: hasUnmodified,
          images: Array.isArray(itemData.images) ? itemData.images : (all[index].images || []),
          color: itemData.color || all[index].color || '#3b82f6',
          notes: (itemData.notes !== undefined ? itemData.notes : all[index].notes || '').trim(),
          updatedAt: now
        };
        this.saveAllItems(all);
        return all[index];
      }
    }

    // 新增產線紀錄
    const newItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      date: itemData.date || this.getTodayDateString(),
      timeSlot: (itemData.timeSlot || '08:00 - 10:00').trim(),
      shift: (itemData.shift || '早班').trim(),
      lineName: (itemData.lineName || 'module').trim(),
      lineCode: (itemData.lineCode || '1').trim(),
      handoverPerson: (itemData.handoverPerson || '').trim(),
      receiverEngineer: (itemData.receiverEngineer || '').trim(),
      totalProduction: Math.max(0, parseInt(itemData.totalProduction, 10) || 0),
      count: Math.max(0, parseInt(itemData.count, 10) || 0), // 代表不良數量
      unmodifiedItems: unmodifiedText,
      unmodifiedColumnI: hasUnmodified,
      images: Array.isArray(itemData.images) ? itemData.images : [],
      color: itemData.color || '#3b82f6',
      notes: (itemData.notes || '').trim(),
      createdAt: now,
      updatedAt: now
    };

    all.unshift(newItem);
    this.saveAllItems(all);
    return newItem;
  },

  /**
   * 增減項目的計數（不良數量）
   * @param {string} id
   * @param {number} delta +1, -1, +5, etc.
   * @returns {Object|null} 更新後的項目
   */
  adjustCount(id, delta) {
    const all = this.getAllItems();
    const index = all.findIndex(i => i.id === id);
    if (index === -1) return null;

    const current = all[index].count || 0;
    const nextCount = Math.max(0, current + delta);
    all[index].count = nextCount;
    all[index].updatedAt = new Date().toISOString();

    this.saveAllItems(all);
    return all[index];
  },

  /**
   * 直接設定項目計數
   * @param {string} id
   * @param {number} exactCount
   * @returns {Object|null}
   */
  setExactCount(id, exactCount) {
    const all = this.getAllItems();
    const index = all.findIndex(i => i.id === id);
    if (index === -1) return null;

    all[index].count = Math.max(0, parseInt(exactCount, 10) || 0);
    all[index].updatedAt = new Date().toISOString();

    this.saveAllItems(all);
    return all[index];
  },

  /**
   * 刪除項目
   * @param {string} id
   */
  deleteItem(id) {
    const all = this.getAllItems();
    const filtered = all.filter(i => i.id !== id);
    this.saveAllItems(filtered);
  },

  /**
   * 重置指定項目的計數為 0
   * @param {string} id
   */
  resetItemCount(id) {
    return this.setExactCount(id, 0);
  },

  /**
   * 取得所有生產線體清單 (包含預設 6 種線體與使用者自訂新線體)
   * @returns {Array<string>}
   */
  getLineNames() {
    const defaultLines = ['module', '測組', 'cp', '測拆', '壓件', '水冷'];
    let customLines = [];
    try {
      const stored = localStorage.getItem('tally_custom_lines_v1');
      if (stored) customLines = JSON.parse(stored);
    } catch (e) {
      console.error('讀取自訂線體失敗:', e);
    }

    const items = this.getAllItems();
    const itemLines = items.map(i => i.lineName).filter(Boolean);

    const set = new Set([...defaultLines, ...customLines, ...itemLines]);
    return Array.from(set);
  },

  /**
   * 新增自訂生產線體
   * @param {string} lineName
   */
  addCustomLine(lineName) {
    if (!lineName || !lineName.trim()) return;
    const name = lineName.trim();
    const lines = this.getLineNames();
    if (!lines.includes(name)) {
      try {
        const stored = localStorage.getItem('tally_custom_lines_v1');
        const custom = stored ? JSON.parse(stored) : [];
        if (!custom.includes(name)) {
          custom.push(name);
          localStorage.setItem('tally_custom_lines_v1', JSON.stringify(custom));
        }
      } catch (e) {
        console.error('儲存自訂線體失敗:', e);
      }
    }
  },

  /**
   * 取得所有人員共用歷史名單 (包含交班人員與接班工程師)
   * @returns {Array<string>}
   */
  getAllStaffNames() {
    const items = this.getAllItems();
    const names = new Set();
    items.forEach(i => {
      if (i.handoverPerson && i.handoverPerson.trim()) names.add(i.handoverPerson.trim());
      if (i.receiverEngineer && i.receiverEngineer.trim()) names.add(i.receiverEngineer.trim());
    });
    return Array.from(names);
  },

  /**
   * 取得過去 N 天的每日總計數走勢
   * @param {number} days
   * @returns {Array<{ date: string, count: number, label: string }>}
   */
  getHistoryTrend(days = 7) {
    const all = this.getAllItems();
    const result = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const monthDayLabel = `${d.getMonth() + 1}/${d.getDate()}`;

      const dayTotal = all
        .filter(item => item.date === dateStr)
        .reduce((sum, item) => sum + (item.count || 0), 0);

      result.push({
        date: dateStr,
        count: dayTotal,
        label: monthDayLabel
      });
    }

    return result;
  },

  /**
   * 取得今天日期的標準字串 'YYYY-MM-DD'
   * @returns {string}
   */
  getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 格式化中文星期
   * @param {string} dateStr 'YYYY-MM-DD'
   * @returns {string}
   */
  getWeekdayString(dateStr) {
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '';
    const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return weekdays[date.getDay()];
  },

  /**
   * 匯出當日或全量資料至 CSV (包含 UTF-8 BOM，支援 Excel 繁體中文)
   * @param {string|null} dateStr
   */
  exportToCSV(dateStr = null) {
    const items = dateStr ? this.getItemsByDate(dateStr) : this.getAllItems();
    if (items.length === 0) {
      alert('目前無可匯出的項目資料！');
      return;
    }

    const headers = ['日期', '班別', '生產時間段', '生產線體', '線別編號', '交班人員', '接班工程師', '生產總數', '不良數量', '當班良率(%)', '未改I欄位細項', '備註說明', '更新時間'];
    const rows = items.map(item => {
      const yieldRateStr = this.calculateYieldRate(item.totalProduction, item.count);
      const columnIStatus = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '已改 I 欄位');
      return [
        `"${item.date}"`,
        `"${item.shift || '早班'}"`,
        `"${item.timeSlot || '08:00 - 10:00'}"`,
        `"${item.lineName || 'module'}"`,
        `"${item.lineCode ? item.lineCode + '線' : '1線'}"`,
        `"${(item.handoverPerson || '').replace(/"/g, '""')}"`,
        `"${(item.receiverEngineer || '').replace(/"/g, '""')}"`,
        item.totalProduction || 0,
        item.count || 0,
        `"${yieldRateStr}"`,
        `"${columnIStatus}"`,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
        `"${item.updatedAt || item.createdAt || ''}"`
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `產線數量與良率報表_${dateStr || '全部'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * 初始化預設範例資料（僅在使用者首次使用時執行）
   */
  initSampleDataIfEmpty() {
    const isInitialized = localStorage.getItem('tally_factory_v3_initialized');
    if (isInitialized) return;

    const today = this.getTodayDateString();
    const now = new Date().toISOString();
    const sampleItems = [
      {
        id: 'sample_1_' + Date.now(),
        date: today,
        timeSlot: '08:00 - 10:00',
        shift: '早班',
        lineName: 'module',
        lineCode: '1',
        handoverPerson: '張小明',
        receiverEngineer: '林工程師',
        totalProduction: 1200,
        count: 5, // 不良數
        unmodifiedColumnI: true, // 未改 I 欄位標記
        color: '#3b82f6',
        notes: '模組沉頭螺絲扭力抽檢，I 欄位待工程師確認修正',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sample_2_' + Date.now(),
        date: today,
        timeSlot: '10:00 - 12:00',
        shift: '早班',
        lineName: '測組',
        lineCode: '2',
        handoverPerson: '李大華',
        receiverEngineer: '黃工程師',
        totalProduction: 800,
        count: 8,
        unmodifiedColumnI: false,
        color: '#10b981',
        notes: '測組治具針腳已完成清潔與 I 欄位修改',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sample_3_' + Date.now(),
        date: today,
        timeSlot: '13:00 - 15:00',
        shift: '早班',
        lineName: 'cp',
        lineCode: '1',
        handoverPerson: '陳志遠',
        receiverEngineer: '郭工程師',
        totalProduction: 1500,
        count: 12,
        unmodifiedItems: '未改工單號',
        unmodifiedColumnI: true,
        images: [],
        color: '#f59e0b',
        notes: '顯微鏡 50X 抽驗，未改 I 欄位標記確認中',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 'sample_4_' + Date.now(),
        date: today,
        timeSlot: '20:00 - 22:00',
        shift: '夜班',
        lineName: '水冷',
        lineCode: '3',
        handoverPerson: '林美玲',
        receiverEngineer: '林工程師',
        totalProduction: 1000,
        count: 3,
        unmodifiedColumnI: false,
        color: '#ec4899',
        notes: 'O-ring 密合度抽檢正常',
        createdAt: now,
        updatedAt: now
      }
    ];

    this.saveAllItems(sampleItems);
    localStorage.setItem('tally_factory_v3_initialized', 'true');
  }
};

window.TallyStorage = TallyStorage;
