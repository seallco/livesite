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
  /**
   * 依 ID 取得單一項目
   * @param {string} id
   * @returns {Object|null}
   */
  getItemById(id) {
    if (!id) return null;
    const all = this.getAllItems();
    return all.find(item => String(item.id).trim() === String(id).trim()) || null;
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
    if (total === 0) {
      return def === 0 ? '100.00%' : '0.00%';
    }
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
      const targetId = String(itemData.id).trim();
      // 更新現有項目
      const index = all.findIndex(i => String(i.id).trim() === targetId);
      if (index !== -1) {
        all[index] = {
          ...all[index],
          date: itemData.date ? itemData.date.trim() : all[index].date,
          timeSlot: itemData.timeSlot !== undefined ? itemData.timeSlot.trim() : (all[index].timeSlot || '08:00 - 10:00'),
          shift: itemData.shift !== undefined ? itemData.shift.trim() : (all[index].shift || '早班'),
          lineName: itemData.lineName !== undefined ? itemData.lineName.trim() : (all[index].lineName || 'module'),
          lineCode: itemData.lineCode !== undefined ? String(itemData.lineCode).trim() : (all[index].lineCode || '1'),
          handoverPerson: itemData.handoverPerson !== undefined ? itemData.handoverPerson.trim() : (all[index].handoverPerson || ''),
          receiverEngineer: itemData.receiverEngineer !== undefined ? itemData.receiverEngineer.trim() : (all[index].receiverEngineer || ''),
          totalProduction: itemData.totalProduction !== undefined ? Math.max(0, parseInt(itemData.totalProduction, 10) || 0) : (all[index].totalProduction !== undefined ? all[index].totalProduction : 0),
          count: itemData.count !== undefined ? Math.max(0, parseInt(itemData.count, 10) || 0) : (all[index].count || 0),
          unmodifiedItems: unmodifiedText,
          unmodifiedColumnI: hasUnmodified,
          images: Array.isArray(itemData.images) ? itemData.images : (all[index].images || []),
          color: itemData.color || all[index].color || '#3b82f6',
          notes: itemData.notes !== undefined ? itemData.notes.trim() : (all[index].notes || ''),
          updatedAt: now
        };
        this.saveAllItems(all);
        return all[index];
      }
    }

    // 新增產線紀錄
    const newItem = {
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      date: itemData.date ? itemData.date.trim() : this.getTodayDateString(),
      timeSlot: (itemData.timeSlot || '08:00 - 10:00').trim(),
      shift: (itemData.shift || '早班').trim(),
      lineName: (itemData.lineName || 'module').trim(),
      lineCode: String(itemData.lineCode || '1').trim(),
      handoverPerson: (itemData.handoverPerson || '').trim(),
      receiverEngineer: (itemData.receiverEngineer || '').trim(),
      totalProduction: itemData.totalProduction !== undefined ? Math.max(0, parseInt(itemData.totalProduction, 10) || 0) : 0,
      count: itemData.count !== undefined ? Math.max(0, parseInt(itemData.count, 10) || 0) : 0, // 代表不良數量
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
    if (!id) return null;
    const all = this.getAllItems();
    const index = all.findIndex(i => String(i.id).trim() === String(id).trim());
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
    if (!id) return null;
    const all = this.getAllItems();
    const index = all.findIndex(i => String(i.id).trim() === String(id).trim());
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
    if (!id) return;
    const all = this.getAllItems();
    const filtered = all.filter(i => String(i.id).trim() !== String(id).trim());
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
   * 檢核 6 線體 × 2 線別 = 12 條標準產線交班紀錄狀況
   * @param {string} dateStr 'YYYY-MM-DD'
   * @param {string} shift 'ALL' | '早班' | '夜班'
   * @returns {Object}
   */
  getHandoverInspection(dateStr, shift = 'ALL') {
    const recordedItems = this.getItemsByDate(dateStr).filter(i => {
      if (shift !== 'ALL') return (i.shift || '早班') === shift;
      return true;
    });

    const standardLines = ['module', 'cp', '測組', '測拆', '壓件', '水冷'];
    const standardCodes = ['1', '2'];

    const allSlots = [];
    const missingSlots = [];
    const completedSlots = [];

    standardLines.forEach(lineName => {
      standardCodes.forEach(lineCode => {
        const slotKey = `${lineName}_${lineCode}`;
        const match = recordedItems.find(i => (i.lineName || 'module') === lineName && String(i.lineCode || '1') === lineCode);
        const slotData = {
          lineName,
          lineCode,
          slotKey,
          isRecorded: Boolean(match),
          item: match || null
        };
        allSlots.push(slotData);
        if (match) {
          completedSlots.push(slotData);
        } else {
          missingSlots.push(slotData);
        }
      });
    });

    return {
      totalStandard: 12,
      recordedCount: completedSlots.length,
      missingCount: missingSlots.length,
      completionRate: Math.round((completedSlots.length / 12) * 100),
      allSlots,
      missingSlots,
      completedSlots
    };
  },

  /**
   * 匯出當日或全量資料至 Excel (.xls 含內嵌縮圖照片)
   * @param {string|null} dateStr
   */
  exportToExcel(dateStr = null) {
    const items = dateStr ? this.getItemsByDate(dateStr) : this.getAllItems();
    if (items.length === 0) {
      alert('目前無可匯出的項目資料！');
      return;
    }

    let rowsHtml = '';
    items.forEach((item, idx) => {
      const yieldRateStr = this.calculateYieldRate(item.totalProduction, item.count);
      const columnIStatus = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '已改 I 欄位');
      
      let photosHtml = '<span style="color: #94a3b8;">無照片</span>';
      if (item.images && item.images.length > 0) {
        photosHtml = item.images.map((img, i) => `
          <div style="display:inline-block; margin:2px; text-align:center;">
            <img src="${img}" width="90" height="70" style="object-fit:cover; border:1px solid #e2e8f0; border-radius:4px;" />
            <div style="font-size:10px; color:#64748b;">照片 ${i + 1}</div>
          </div>
        `).join('');
      }

      rowsHtml += `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; text-align: center; vertical-align: middle;">
          <td style="padding: 10px; border: 1px solid #cbd5e1; mso-number-format:'\\@';">${item.date}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.shift || '早班'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.timeSlot || '08:00 - 10:00'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; color: #1e293b;">${item.lineName || 'module'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold;">${item.lineCode || '1'} 號線</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.handoverPerson || '-'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${item.receiverEngineer || '-'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-weight: bold; mso-number-format:'\\#\\,\\#\\#0';">${item.totalProduction !== undefined ? item.totalProduction : 0}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; color: #ef4444; font-weight: bold;">${item.count || 0}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; color: #10b981; font-weight: bold;">${yieldRateStr}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1;">${columnIStatus}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: left;">${item.notes || '-'}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; text-align: center;">${photosHtml}</td>
          <td style="padding: 10px; border: 1px solid #cbd5e1; font-size: 11px; color: #64748b;">${item.updatedAt || item.createdAt || ''}</td>
        </tr>
      `;
    });

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>產線交接良率報表</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', 'Microsoft JhengHei', Arial, sans-serif; }
          th { background-color: #1e293b; color: #ffffff; padding: 12px; border: 1px solid #94a3b8; font-size: 13px; font-weight: bold; }
          td { border: 1px solid #cbd5e1; font-size: 12px; }
        </style>
      </head>
      <body>
        <h2 style="font-family: 'Microsoft JhengHei', sans-serif; color: #1e293b; margin-bottom: 12px;">產線數量與良率統計交接日報表（含照片檢視）</h2>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">匯出日期範圍：${dateStr || '全部歷史紀錄'} ｜ 總筆數：${items.length} 筆</p>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>班別</th>
              <th>生產時間段</th>
              <th>生產線體</th>
              <th>線別編號</th>
              <th>交班人員</th>
              <th>接班工程師</th>
              <th>生產總數</th>
              <th>不良數量</th>
              <th>當班良率</th>
              <th>I 欄位標記</th>
              <th>備註說明</th>
              <th>現場照片 (縮圖)</th>
              <th>更新時間</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `產線良率交接報表_含照片_${dateStr || '全部'}_${Date.now()}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

    const headers = ['日期', '班別', '生產時間段', '生產線體', '線別編號', '交班人員', '接班工程師', '生產總數', '不良數量', '當班良率(%)', '未改I欄位細項', '照片數量', '照片資料預覽', '備註說明', '更新時間'];
    const rows = items.map(item => {
      const yieldRateStr = this.calculateYieldRate(item.totalProduction, item.count);
      const columnIStatus = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '已改 I 欄位');
      const photoCountStr = item.images && item.images.length > 0 ? `${item.images.length} 張照片` : '無照片';
      const photosDataStr = item.images && item.images.length > 0 ? item.images.join(' | ') : '無';

      return [
        `"${item.date}"`,
        `"${item.shift || '早班'}"`,
        `"${item.timeSlot || '08:00 - 10:00'}"`,
        `"${item.lineName || 'module'}"`,
        `"${item.lineCode ? item.lineCode + '線' : '1線'}"`,
        `"${(item.handoverPerson || '').replace(/"/g, '""')}"`,
        `"${(item.receiverEngineer || '').replace(/"/g, '""')}"`,
        item.totalProduction !== undefined ? item.totalProduction : 0,
        item.count || 0,
        `"${yieldRateStr}"`,
        `"${columnIStatus}"`,
        `"${photoCountStr}"`,
        `"${photosDataStr.replace(/"/g, '""')}"`,
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
