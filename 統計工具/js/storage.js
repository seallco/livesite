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
   * 匯出當日或全量資料至標準 Excel (.xlsx 含真正內嵌二進制照片 + 12 條標準線未填寫缺漏統計專屬工作表)
   * 採用 ExcelJS OpenXML 生成原生 .xlsx，在 Microsoft Excel、WPS、金山文檔中均可直接顯示完整照片與未填統計！
   * @param {string|null} dateStr
   */
  async exportToExcel(dateStr = null) {
    const targetDate = dateStr || this.getTodayDateString();
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

      // 取得 12 條標準產線交班檢核數據
      const inspection = this.getHandoverInspection(targetDate, 'ALL');
      const { totalStandard, recordedCount, missingCount, completionRate, allSlots, missingSlots } = inspection;

      // ======================================================================
      // 工作表 1：產線交接良率明細報表 (含內嵌照片)
      // ======================================================================
      const sheet1 = workbook.addWorksheet('產線交接良率明細', {
        views: [{ showGridLines: true }]
      });

      // 設定欄位寬度與表頭
      sheet1.columns = [
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
      const headerRow = sheet1.getRow(1);
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

        const row = sheet1.addRow({
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

        row.height = hasPhotos ? 75 : 28;
        row.font = { name: 'Microsoft JhengHei', size: 10 };
        row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

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

        if (i % 2 === 1) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          };
        }

        // 內嵌二進制圖片 (Native Drawing Objects)
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

                sheet1.addImage(imageId, {
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

      // 明細表底部統計與未填寫線體警示列
      sheet1.addRow({}); // 空行
      const totalProdAll = items.reduce((s, i) => s + (parseInt(i.totalProduction, 10) || 0), 0);
      const totalDefectsAll = items.reduce((s, i) => s + (parseInt(i.count, 10) || 0), 0);
      const avgYieldAll = totalProdAll > 0 ? (((totalProdAll - totalDefectsAll) / totalProdAll) * 100).toFixed(2) + '%' : '100.00%';

      const summaryRow = sheet1.addRow({
        idx: '總計',
        date: `共 ${items.length} 筆`,
        totalProduction: totalProdAll,
        count: totalDefectsAll,
        yieldRate: avgYieldAll,
        notes: `12 條標準線交班：${recordedCount}/${totalStandard} 條 (${completionRate}%)`
      });
      summaryRow.font = { name: 'Microsoft JhengHei', size: 11, bold: true };
      summaryRow.height = 30;
      summaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2E8F0' }
      };

      // 若有缺漏未填寫線體，在第一頁明細表底部加入醒目警示行
      if (missingCount > 0) {
        const missingNamesStr = missingSlots.map(s => `${s.lineName} ${s.lineCode}號線`).join('、');
        const alertRow = sheet1.addRow({
          idx: '🚨 缺漏提醒',
          date: `尚有 ${missingCount} 條線未填寫交班`,
          notes: `未填寫清單：${missingNamesStr} (請參閱第二分頁【12線未填統計】)`
        });
        alertRow.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FFE11D48' } };
        alertRow.height = 30;
        alertRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFE4E6' }
        };
      }

      // ======================================================================
      // 工作表 2：12 條標準產線交班檢核與未填寫統計專屬分頁
      // ======================================================================
      const sheet2 = workbook.addWorksheet('12線交班檢核與未填統計', {
        views: [{ showGridLines: true }]
      });

      sheet2.columns = [
        { header: '項次', key: 'idx', width: 8 },
        { header: '生產線體 (6大線體)', key: 'lineName', width: 20 },
        { header: '線別編號', key: 'lineCode', width: 14 },
        { header: '交班填寫狀態', key: 'status', width: 24 },
        { header: '交班人員', key: 'handoverPerson', width: 14 },
        { header: '接班工程師', key: 'receiverEngineer', width: 14 },
        { header: '生產總數', key: 'totalProduction', width: 12 },
        { header: '不良數量', key: 'count', width: 12 },
        { header: '當班良率', key: 'yieldRate', width: 12 },
        { header: 'I 欄位標記', key: 'columnI', width: 16 },
        { header: '檢核備註 / 填報說明', key: 'notes', width: 34 }
      ];

      // 表頭樣式
      const headerRow2 = sheet2.getRow(1);
      headerRow2.height = 32;
      headerRow2.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow2.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0F172A' }
      };
      headerRow2.alignment = { vertical: 'middle', horizontal: 'center' };

      // 填入 12 條標準線之檢核對照數據
      allSlots.forEach((slot, idx) => {
        const item = slot.item;
        const isRecorded = slot.isRecorded;

        const row = sheet2.addRow({
          idx: idx + 1,
          lineName: slot.lineName,
          lineCode: slot.lineCode + ' 號線',
          status: isRecorded ? '✅ 已完成交班填報' : '🚨 未填寫交班紀錄 (缺漏)',
          handoverPerson: item ? (item.handoverPerson || '-') : '-',
          receiverEngineer: item ? (item.receiverEngineer || '-') : '-',
          totalProduction: item ? (item.totalProduction !== undefined ? item.totalProduction : 0) : 0,
          count: item ? (item.count || 0) : 0,
          yieldRate: item ? this.calculateYieldRate(item.totalProduction, item.count) : '-',
          columnI: item ? (item.unmodifiedItems || (item.unmodifiedColumnI ? '未改 I 欄位' : '已改 I 欄位')) : '-',
          notes: isRecorded ? (item.notes || '正常交接完成') : '⚠️ 今日無此線填報紀錄，請確認現場交班'
        });

        row.height = 30;
        row.font = { name: 'Microsoft JhengHei', size: 10 };
        row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        const statusCell = row.getCell('status');
        const notesCell = row.getCell('notes');
        notesCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

        if (isRecorded) {
          // 已填寫行：淡綠色標註
          statusCell.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FF059669' } };
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF0FDF4' }
          };
        } else {
          // 缺漏未填寫行：醒目玫瑰紅底色標註
          statusCell.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: 'FFE11D48' } };
          notesCell.font = { name: 'Microsoft JhengHei', size: 10, bold: true, color: { argb: 'FFE11D48' } };
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFE4E6' }
          };
        }
      });

      // 底部總結檢核 KPI 列
      sheet2.addRow({});
      const checkSummaryRow = sheet2.addRow({
        idx: '檢核結果',
        lineName: `標準線總計: ${totalStandard} 條`,
        lineCode: `已填寫: ${recordedCount} 條`,
        status: missingCount === 0 ? '🎉 12 條標準線全數完成交班！' : `🚨 尚缺 ${missingCount} 條未填寫`,
        notes: `交班達成率：${completionRate}% ｜ 基準：6 線體 (module, cp, 測組, 測拆, 壓件, 水冷) × 2 線號 (1, 2)`
      });
      checkSummaryRow.font = { name: 'Microsoft JhengHei', size: 11, bold: true, color: { argb: missingCount === 0 ? 'FF059669' : 'FFE11D48' } };
      checkSummaryRow.height = 32;
      checkSummaryRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: missingCount === 0 ? 'FFDCFCE7' : 'FFFFE4E6' }
      };

      // 產出真正的 .xlsx 檔案
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `產線交接良率日報表_含未填統計與照片_${targetDate}_${Date.now()}.xlsx`;
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
   * 匯出當日或全量資料至 CSV (包含 UTF-8 BOM，支援 Excel 繁體中文與 12 線未填寫統計摘要)
   * @param {string|null} dateStr
   */
  exportToCSV(dateStr = null) {
    const targetDate = dateStr || this.getTodayDateString();
    const items = dateStr ? this.getItemsByDate(dateStr) : this.getAllItems();
    if (items.length === 0) {
      alert('目前無可匯出的項目資料！');
      return;
    }

    const inspection = this.getHandoverInspection(targetDate, 'ALL');

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

    // 附加上 12 條標準線交班檢核與未填統計
    const missingLineListStr = inspection.missingSlots.length > 0
      ? inspection.missingSlots.map(s => `${s.lineName} ${s.lineCode}號線`).join('; ')
      : '無 (全數完成交班)';

    const inspectionRows = [
      '',
      '# ==========================================================================',
      '# 每日 12 條標準產線交班檢核與未填寫統計摘要 (6 線體 × 2 線號 = 12 條)',
      '# ==========================================================================',
      `"# 應填標準線總數: 12 條"`,
      `"# 已填寫交班線數: ${inspection.recordedCount} 條"`,
      `"# 🚨 未填寫缺漏線數: ${inspection.missingCount} 條"`,
      `"# 交班達成率: ${inspection.completionRate}%"`,
      `"# 🚨 缺漏未填寫線體清單: ${missingLineListStr}"`
    ];

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(',')), ...inspectionRows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `產線良率報表_含未填統計_${targetDate}_${Date.now()}.csv`);
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
