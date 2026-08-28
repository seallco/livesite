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
   * 匯出當日或全量資料至標準 Excel (.xlsx 含真正內嵌二進制照片)
   * 採用 ExcelJS OpenXML 生成原生 .xlsx，在 Microsoft Excel、WPS、金山文檔中均可直接顯示完整照片！
   * @param {string|null} dateStr
   */
  async exportToExcel(dateStr = null) {
    const items = dateStr ? this.getItemsByDate(dateStr) : this.getAllItems();
    if (items.length === 0) {
      alert('目前無可匯出的項目資料！');
      return;
    }

    if (typeof ExcelJS === 'undefined') {
      alert('Excel 匯出元件載入中，請稍候重試！');
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Livesite 產線良率統計系統';
      workbook.created = new Date();

      const sheet = workbook.addWorksheet('產線交接良率報表', {
        views: [{ showGridLines: true }]
      });

      // 設定欄位寬度與表頭
      sheet.columns = [
        { header: '項次', key: 'idx', width: 8 },
        { header: '日期', key: 'date', width: 14 },
        { header: '班別', key: 'shift', width: 10 },
        { header: '生產時間段', key: 'timeSlot', width: 16 },
        { header: '生產線體', key: 'lineName', width: 14 },
        { header: '線別', key: 'lineCode', width: 10 },
        { header: '交班人員', key: 'handoverPerson', width: 14 },
        { header: '接班工程師', key: 'receiverEngineer', width: 14 },
        { header: '生產總數', key: 'totalProduction', width: 13 },
        { header: '不良數量', key: 'count', width: 12 },
        { header: '當班良率', key: 'yieldRate', width: 12 },
        { header: 'I 欄位標記', key: 'columnI', width: 16 },
        { header: '備註說明', key: 'notes', width: 28 },
        { header: '現場照片 (內嵌預覽)', key: 'photos', width: 36 },
        { header: '最後更新時間', key: 'updatedAt', width: 22 }
      ];

      // 表頭樣式
      const headerRow = sheet.getRow(1);
      headerRow.height = 32;
      headerRow.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E293B' }
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const rowIndex = i + 2;
        const yieldRateStr = this.calculateYieldRate(item.totalProduction, item.count);
        const columnIStatus = item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '已改 I 欄位');
        const hasPhotos = Array.isArray(item.images) && item.images.length > 0;

        const row = sheet.addRow({
          idx: i + 1,
          date: item.date,
          shift: item.shift || '早班',
          timeSlot: item.timeSlot || '08:00 - 10:00',
          lineName: item.lineName || 'module',
          lineCode: (item.lineCode || '1') + ' 號線',
          handoverPerson: item.handoverPerson || '-',
          receiverEngineer: item.receiverEngineer || '-',
          totalProduction: item.totalProduction !== undefined ? item.totalProduction : 0,
          count: item.count || 0,
          yieldRate: yieldRateStr,
          columnI: columnIStatus,
          notes: item.notes || '-',
          photos: hasPhotos ? '' : '無照片',
          updatedAt: item.updatedAt || item.createdAt || ''
        });

        // 調整列高以容納圖片
        row.height = hasPhotos ? 75 : 28;
        row.font = { name: 'Microsoft JhengHei', size: 10 };
        row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        // 數字與良率顏色
        const prodCell = row.getCell('totalProduction');
        prodCell.numFmt = '#,##0';
        prodCell.font = { name: 'Microsoft JhengHei', size: 10, bold: true };

        const countCell = row.getCell('count');
        countCell.numFmt = '#,##0';
        countCell.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FFDC2626' } };

        const yieldCell = row.getCell('yieldRate');
        yieldCell.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FF059669' } };

        const notesCell = row.getCell('notes');
        notesCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        // 斑馬紋底色
        if (i % 2 === 1) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }

        // 內嵌真正的二進制圖片 (Native Drawing Objects)
        if (hasPhotos) {
          for (let imgIdx = 0; imgIdx < Math.min(item.images.length, 3); imgIdx++) {
            const base64Data = item.images[imgIdx];
            if (typeof base64Data === 'string' && base64Data.startsWith('data:image/')) {
              try {
                let ext = 'png';
                if (base64Data.includes('image/jpeg') || base64Data.includes('image/jpg')) {
                  ext = 'jpeg';
                }
                const imageId = workbook.addImage({
                  base64: base64Data,
                  extension: ext
                });

                sheet.addImage(imageId, {
                  tl: { col: 13 + imgIdx * 0.45, row: rowIndex - 1 + 0.08 },
                  ext: { width: 75, height: 60 },
                  editAs: 'oneCell'
                });
              } catch (imgErr) {
                console.warn('圖片嵌入失敗:', imgErr);
              }
            }
          }
        }
      }

      // 產出真正的 .xlsx 檔案
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `產線交接良率日報表_含照片_${dateStr || '全部'}_${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Excel 匯出失敗:', err);
      alert('匯出 Excel 失敗：' + err.message);
    }
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
