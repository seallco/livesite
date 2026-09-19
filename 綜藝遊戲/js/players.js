/**
 * 綜藝派對遊戲大廳 - 高度自由玩家與分隊管理系統 (partyHub)
 * 支援自訂任意玩家數量、姓名、頭像 Emoji、戰隊數量、自訂隊名、隨機洗牌分隊與接力連動
 */
(function (window) {
  'use strict';

  const STORAGE_KEY = 'variety_party_hub_config_v2';

  // 內建隊伍預設庫 (支援 2 ~ 6 隊自由擴充)
  const TEAM_PRESETS = [
    { id: 'red', name: '紅隊', color: '#ff2a6d', emoji: '🔴', key: 'A', pitch: 523.25 },
    { id: 'blue', name: '藍隊', color: '#05d9e8', emoji: '🔵', key: 'L', pitch: 659.25 },
    { id: 'yellow', name: '黃隊', color: '#ffc83b', emoji: '🟡', key: 'S', pitch: 783.99 },
    { id: 'green', name: '綠隊', color: '#00f59b', emoji: '🟢', key: 'K', pitch: 987.77 },
    { id: 'purple', name: '紫隊', color: '#b5179e', emoji: '🟣', key: 'D', pitch: 440.00 },
    { id: 'orange', name: '橘隊', color: '#ff7b00', emoji: '🟠', key: 'J', pitch: 392.00 }
  ];

  // 趣味頭像 Emoji 庫
  const AVATAR_EMOJIS = [
    '😎', '🤠', '🐱', '🦊', '🦁', '🐼', '🐨', '🐯', '🦄', '🚀', 
    '👑', '⚡', '🔥', '🍕', '🎨', '🎸', '🎮', '🏀', '🍦', '💎', '🍿', '🎯'
  ];

  // 拍燈預設鍵位 (依照鍵盤兩側分散配置便於現場拍燈)
  const DEFAULT_KEYS = ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';', '1', '2', '3', '4'];

  // 快速範本預設名單
  const TEMPLATES = {
    variety: ['憲哥', '浩子', '阿翔', '乃哥', '小美', '阿凱', '志玲', '城哥'],
    heroes: ['鋼鐵人', '美國隊長', '雷神索爾', '綠巨人浩克', '蜘蛛人', '黑寡婦', '奇異博士', '鷹眼'],
    anime: ['魯夫', '索隆', '娜美', '騙人布', '香吉士', '喬巴', '羅賓', '佛朗基'],
    fruits: ['大西瓜', '小香蕉', '水蜜桃', '青蘋果', '愛文芒果', '奇異果', '紅草莓', '大芭樂']
  };

  // 預設狀態
  function getDefaultState() {
    return {
      mode: 'teams', // 'teams' (戰隊對抗) 或 'solo' (個人競爭)
      activeTeamCount: 2, // 啟用 2 ~ 6 隊
      teams: [
        { id: 'red', name: '紅隊', color: '#ff2a6d', emoji: '🔴', key: 'A', score: 0, pitch: 523.25 },
        { id: 'blue', name: '藍隊', color: '#05d9e8', emoji: '🔵', key: 'L', score: 0, pitch: 659.25 }
      ],
      players: [
        { id: 'p1', name: '周董', emoji: '😎', teamId: 'red', score: 0, key: 'A', color: '#ff2a6d' },
        { id: 'p2', name: '阿信', emoji: '🎸', teamId: 'red', score: 0, key: 'S', color: '#ff7b00' },
        { id: 'p3', name: '蔡依林', emoji: '👑', teamId: 'blue', score: 0, key: 'K', color: '#05d9e8' },
        { id: 'p4', name: '林俊傑', emoji: '🎤', teamId: 'blue', score: 0, key: 'L', color: '#00f59b' }
      ]
    };
  }

  // 狀態管理物件
  const partyHub = {
    state: getDefaultState(),
    buzzerLocked: false,

    // 初始化與讀取持久化
    init() {
      this.loadState();
      this.ensureConsistency();
      this.render();
      this.bindEvents();
    },

    loadState() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && Array.isArray(parsed.players) && parsed.players.length > 0) {
            this.state = parsed;
          }
        }
      } catch (e) {
        console.warn('載入玩家資料失敗，恢復預設值:', e);
        this.state = getDefaultState();
      }
    },

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('儲存玩家設定失敗:', e);
      }
    },

    // 確保隊伍與玩家資料關聯完整
    ensureConsistency() {
      if (!this.state.teams || this.state.teams.length === 0) {
        this.setTeamCount(2);
      }
      const validTeamIds = this.state.teams.map(t => t.id);
      this.state.players.forEach((p, idx) => {
        if (!p.id) p.id = 'p_' + Date.now() + '_' + idx;
        if (!validTeamIds.includes(p.teamId)) {
          p.teamId = validTeamIds[idx % validTeamIds.length];
        }
        if (!p.emoji) p.emoji = AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length];
        if (!p.key) p.key = DEFAULT_KEYS[idx % DEFAULT_KEYS.length];
        if (typeof p.score !== 'number') p.score = 0;
      });
    },

    // 取得所有啟用隊伍
    getTeams() {
      return this.state.teams;
    },

    // 取得所有玩家
    getPlayers() {
      return this.state.players;
    },

    // 取得指定隊伍的所有玩家
    getTeamPlayers(teamId) {
      return this.state.players.filter(p => p.teamId === teamId);
    },

    // 設定隊伍數量 (2 ~ 6 隊)
    setTeamCount(count) {
      count = Math.max(2, Math.min(6, parseInt(count) || 2));
      this.state.activeTeamCount = count;
      const currentTeams = this.state.teams || [];
      const newTeams = [];

      for (let i = 0; i < count; i++) {
        const preset = TEAM_PRESETS[i];
        const existing = currentTeams.find(t => t.id === preset.id);
        if (existing) {
          newTeams.push(existing);
        } else {
          newTeams.push({
            id: preset.id,
            name: preset.name,
            color: preset.color,
            emoji: preset.emoji,
            key: preset.key,
            score: 0,
            pitch: preset.pitch
          });
        }
      }
      this.state.teams = newTeams;
      this.ensureConsistency();
      this.saveState();
      this.render();
    },

    // 新增一位玩家
    addPlayer(customName) {
      const idx = this.state.players.length;
      const teamId = this.state.teams[idx % this.state.teams.length].id;
      const newPlayer = {
        id: 'p_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        name: customName || `玩家 ${idx + 1}`,
        emoji: AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length],
        teamId: teamId,
        score: 0,
        key: DEFAULT_KEYS[idx % DEFAULT_KEYS.length] || `${idx + 1}`,
        color: this.state.teams.find(t => t.id === teamId)?.color || '#ffc83b'
      };
      this.state.players.push(newPlayer);
      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playBeat(true);
      return newPlayer;
    },

    // 刪除玩家
    removePlayer(playerId) {
      if (this.state.players.length <= 1) {
        alert('最少需保留 1 位玩家！');
        return;
      }
      this.state.players = this.state.players.filter(p => p.id !== playerId);
      this.saveState();
      this.render();
    },

    // 更新玩家資訊
    updatePlayer(playerId, updates) {
      const p = this.state.players.find(x => x.id === playerId);
      if (p) {
        Object.assign(p, updates);
        this.saveState();
        this.render();
      }
    },

    // 更新隊伍資訊
    updateTeam(teamId, updates) {
      const t = this.state.teams.find(x => x.id === teamId);
      if (t) {
        Object.assign(t, updates);
        this.saveState();
        this.render();
      }
    },

    // 快速套用人數 (2, 4, 6, 8, 10, 12)
    setPlayerCount(targetCount) {
      targetCount = Math.max(1, Math.min(24, parseInt(targetCount) || 4));
      const current = this.state.players.length;

      if (targetCount > current) {
        for (let i = current; i < targetCount; i++) {
          const teamId = this.state.teams[i % this.state.teams.length].id;
          this.state.players.push({
            id: 'p_' + Date.now() + '_' + i,
            name: `玩家 ${i + 1}`,
            emoji: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length],
            teamId: teamId,
            score: 0,
            key: DEFAULT_KEYS[i % DEFAULT_KEYS.length] || `${i + 1}`,
            color: this.state.teams.find(t => t.id === teamId)?.color || '#ffc83b'
          });
        }
      } else if (targetCount < current) {
        this.state.players = this.state.players.slice(0, targetCount);
      }

      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playBeat(true);
    },

    // 套用範本名單
    applyTemplate(templateKey) {
      const names = TEMPLATES[templateKey];
      if (!names) return;

      this.state.players = names.map((name, i) => {
        const teamId = this.state.teams[i % this.state.teams.length].id;
        return {
          id: 'p_' + Date.now() + '_' + i,
          name: name,
          emoji: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length],
          teamId: teamId,
          score: 0,
          key: DEFAULT_KEYS[i % DEFAULT_KEYS.length] || `${i + 1}`,
          color: this.state.teams.find(t => t.id === teamId)?.color || '#ffc83b'
        };
      });

      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playSuccess();
      if (typeof confettiEffect === 'function') confettiEffect();
    },

    // 批次匯入文字名單
    batchImport(rawText) {
      if (!rawText || !rawText.trim()) return;
      const names = rawText
        .split(/[\n,，、;；\t]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (names.length === 0) return;

      this.state.players = names.map((name, i) => {
        const teamId = this.state.teams[i % this.state.teams.length].id;
        return {
          id: 'p_' + Date.now() + '_' + i,
          name: name,
          emoji: AVATAR_EMOJIS[i % AVATAR_EMOJIS.length],
          teamId: teamId,
          score: 0,
          key: DEFAULT_KEYS[i % DEFAULT_KEYS.length] || `${i + 1}`,
          color: this.state.teams.find(t => t.id === teamId)?.color || '#ffc83b'
        };
      });

      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playSuccess();
      if (typeof confettiEffect === 'function') confettiEffect();
    },

    // 🎲 隨機洗牌分隊 (綜藝抽籤儀式感！)
    randomShuffleTeams() {
      const teams = this.state.teams;
      if (teams.length <= 1) return;

      // Fisher-Yates 洗牌
      const shuffled = [...this.state.players];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // 輪流分配進各隊
      shuffled.forEach((p, idx) => {
        p.teamId = teams[idx % teams.length].id;
        p.color = teams[idx % teams.length].color;
      });

      this.state.players = shuffled;
      this.saveState();
      this.render();

      if (typeof audio !== 'undefined') audio.playSuccess();
      if (typeof confettiEffect === 'function') confettiEffect();
    },

    // ⚖️ 依序均衡分隊
    balanceTeams() {
      const teams = this.state.teams;
      this.state.players.forEach((p, idx) => {
        p.teamId = teams[idx % teams.length].id;
        p.color = teams[idx % teams.length].color;
      });
      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playBeat(true);
    },

    // 切換模式 (teams 戰隊 / solo 個人)
    setMode(mode) {
      this.state.mode = mode;
      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playBeat(true);
    },

    // 分數操作 (隊伍或個人)
    modifyScore(type, id, delta) {
      if (type === 'team') {
        const t = this.state.teams.find(x => x.id === id);
        if (t) {
          t.score = Math.max(0, t.score + delta);
        }
      } else {
        const p = this.state.players.find(x => x.id === id);
        if (p) {
          p.score = Math.max(0, p.score + delta);
        }
      }

      if (delta > 0) {
        if (typeof audio !== 'undefined') audio.playSuccess();
        if (typeof confettiEffect === 'function') confettiEffect();
      }
      this.saveState();
      this.render();
    },

    // 所有分數歸零
    resetScores() {
      this.state.teams.forEach(t => t.score = 0);
      this.state.players.forEach(p => p.score = 0);
      this.saveState();
      this.render();
      if (typeof audio !== 'undefined') audio.playBeat(true);
    },

    // 搶答拍燈觸發
    triggerBuzzer(targetId) {
      if (this.buzzerLocked) return;
      this.buzzerLocked = true;

      const buzzerAlertEl = document.getElementById('buzzer-alert');
      let alertText = '';
      let alertColor = '#ffc83b';

      if (this.state.mode === 'teams') {
        // 隊伍拍燈
        const team = this.state.teams.find(t => t.id === targetId);
        if (team) {
          if (typeof audio !== 'undefined') audio.playBuzzer(team.pitch || 523.25);
          alertText = `${team.emoji} ${team.name} 搶先拍燈！ (${team.key})`;
          alertColor = team.color;
        }
      } else {
        // 個人拍燈
        const player = this.state.players.find(p => p.id === targetId);
        if (player) {
          const pitch = 400 + (this.state.players.indexOf(player) * 80);
          if (typeof audio !== 'undefined') audio.playBuzzer(pitch);
          alertText = `⚡ ${player.emoji} ${player.name} 搶先拍燈！ (${player.key})`;
          alertColor = player.color;
        }
      }

      if (buzzerAlertEl) {
        buzzerAlertEl.style.borderColor = alertColor;
        buzzerAlertEl.style.boxShadow = `0 0 35px ${alertColor}`;
        buzzerAlertEl.className = 'buzzer-alert show';
        buzzerAlertEl.textContent = alertText;
      }

      setTimeout(() => {
        if (buzzerAlertEl) buzzerAlertEl.classList.remove('show');
        this.buzzerLocked = false;
      }, 1500);
    },

    // 取得繪畫接力棒次清單 (連動 Game 12)
    getRelayBatons(teamId) {
      let roster = [];
      if (this.state.mode === 'teams') {
        if (teamId) {
          roster = this.getTeamPlayers(teamId);
        }
        if (roster.length === 0) {
          // 若該隊沒人，使用第一隊或全體玩家
          roster = this.getTeamPlayers(this.state.teams[0]?.id) || this.state.players;
        }
      } else {
        roster = this.state.players;
      }

      if (!roster || roster.length === 0) {
        return ['第 1 棒', '第 2 棒', '第 3 棒', '最後猜題棒'];
      }
      if (roster.length === 1) {
        return [`第 1 棒：${roster[0].name}`, `第 2 棒：${roster[0].name}`, `猜題棒：${roster[0].name}`];
      }

      const batons = [];
      for (let i = 0; i < roster.length - 1; i++) {
        batons.push(`第 ${i + 1} 棒：${roster[i].name} (${roster[i].emoji})`);
      }
      const guesser = roster[roster.length - 1];
      batons.push(`🏆 最後猜題者：${guesser.name} (${guesser.emoji})`);
      return batons;
    },

    // 渲染拍燈與計分板 HTML
    renderScoreboards() {
      const mode = this.state.mode;

      // 更新分頁按鈕狀態
      document.querySelectorAll('.score-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });

      let buzzerHtml = '';
      let scoreHtml = '';

      if (mode === 'teams') {
        // 戰隊對抗模式
        const teams = this.state.teams;
        const bzBtns = teams.map(t => `
          <button class="buzzer-btn" style="background:${t.color}; color:#fff; border-color:${t.color}; box-shadow:0 0 15px ${t.color}66;" onclick="partyHub.triggerBuzzer('${t.id}')">
            ${t.emoji} ${t.name} (${t.key})
          </button>
        `).join('');

        const scCards = teams.map(t => {
          const members = this.getTeamPlayers(t.id);
          const memberListHtml = members.map(m => `
            <span style="display:inline-flex; align-items:center; gap:2px; font-size:0.75rem; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:6px; margin:2px;">
              ${m.emoji} ${m.name}
            </span>
          `).join('');

          return `
            <div class="score-card" style="border-top:3px solid ${t.color};">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="score-card-title" style="color:${t.color};">${t.emoji} ${t.name}</span>
                <span style="font-size:0.75rem; color:#94a3b8;">${members.length} 人</span>
              </div>
              <div class="score-card-num" style="color:#fff;">${t.score}</div>
              <div style="margin-bottom:8px; min-height:24px; display:flex; flex-wrap:wrap;">
                ${memberListHtml || '<span style="font-size:0.7rem; color:#64748b;">暫無隊員</span>'}
              </div>
              <div class="score-card-btns">
                <button class="score-btn-sub" onclick="partyHub.modifyScore('team', '${t.id}', -1)" style="background:#222; color:#fff;">-1</button>
                <button class="score-btn-sub" onclick="partyHub.modifyScore('team', '${t.id}', 1)" style="background:${t.color}; color:#fff;">+1</button>
              </div>
            </div>
          `;
        }).join('');

        buzzerHtml = `<div class="buzzer-grid" style="grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:10px;">${bzBtns}</div>`;
        scoreHtml = `<div class="scoreboard-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">${scCards}</div>`;

      } else {
        // 個人爭霸模式
        const players = this.state.players;
        const bzBtns = players.map(p => `
          <button class="buzzer-btn" style="background:rgba(255,255,255,0.08); border:1.5px solid ${p.color}; color:#fff;" onclick="partyHub.triggerBuzzer('${p.id}')">
            ${p.emoji} ${p.name} (${p.key})
          </button>
        `).join('');

        const scCards = players.map(p => `
          <div class="score-card" style="border-top:3px solid ${p.color};">
            <span class="score-card-title" style="color:${p.color};">${p.emoji} ${p.name}</span>
            <div class="score-card-num" style="color:#fff;">${p.score}</div>
            <div class="score-card-btns">
              <button class="score-btn-sub" onclick="partyHub.modifyScore('player', '${p.id}', -1)" style="background:#222; color:#fff;">-1</button>
              <button class="score-btn-sub" onclick="partyHub.modifyScore('player', '${p.id}', 1)" style="background:${p.color}; color:#000; font-weight:800;">+1</button>
            </div>
          </div>
        `).join('');

        buzzerHtml = `<div class="buzzer-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap:8px;">${bzBtns}</div>`;
        scoreHtml = `<div class="scoreboard-grid" style="grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:10px;">${scCards}</div>`;
      }

      // 注入全站計分容器
      ['modal-buzzer-container', 'g1-buzzer-container', 'g11-buzzer-container', 'g12-buzzer-container'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = buzzerHtml;
      });

      ['modal-scoreboard-container', 'g1-scoreboard-container', 'g11-scoreboard-container', 'g12-scoreboard-container'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = scoreHtml;
      });
    },

    // 渲染管理 Modal 面板內容
    renderConfigModal() {
      const modal = document.getElementById('modal-player-config');
      if (!modal) return;

      const playerListContainer = document.getElementById('cfg-player-list');
      const teamListContainer = document.getElementById('cfg-team-list');

      // 渲染玩家清單
      if (playerListContainer) {
        playerListContainer.innerHTML = this.state.players.map((p, idx) => {
          const teamOptions = this.state.teams.map(t => 
            `<option value="${t.id}" ${t.id === p.teamId ? 'selected' : ''}>${t.emoji} ${t.name}</option>`
          ).join('');

          return `
            <div class="cfg-player-card" data-id="${p.id}" style="border-left: 4px solid ${p.color};">
              <div class="cfg-player-top">
                <button class="cfg-emoji-btn" title="點擊切換 Emoji" onclick="partyHub.cycleEmoji('${p.id}')">${p.emoji}</button>
                <input type="text" class="cfg-name-input" value="${p.name}" placeholder="輸入名字..." onchange="partyHub.updatePlayer('${p.id}', { name: this.value })">
                <button class="cfg-del-btn" title="刪除玩家" onclick="partyHub.removePlayer('${p.id}')">✕</button>
              </div>
              <div class="cfg-player-bottom">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:0.75rem; color:#94a3b8;">分隊：</span>
                  <select class="cfg-team-select" onchange="partyHub.changePlayerTeam('${p.id}', this.value)">
                    ${teamOptions}
                  </select>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:0.75rem; color:#94a3b8;">熱鍵：</span>
                  <input type="text" class="cfg-key-input" maxlength="2" value="${p.key}" onchange="partyHub.updatePlayer('${p.id}', { key: this.value.toUpperCase() })">
                </div>
              </div>
            </div>
          `;
        }).join('');
      }

      // 渲染戰隊清單
      if (teamListContainer) {
        teamListContainer.innerHTML = this.state.teams.map((t, idx) => {
          const count = this.getTeamPlayers(t.id).length;
          return `
            <div class="cfg-team-card" style="border: 1.5px solid ${t.color};">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:1.2rem;">${t.emoji}</span>
                  <input type="text" class="cfg-name-input" style="font-weight:800; color:${t.color}; width:110px;" value="${t.name}" onchange="partyHub.updateTeam('${t.id}', { name: this.value })">
                </div>
                <span class="cfg-badge" style="background:${t.color}22; border-color:${t.color}; color:${t.color};">${count} 位隊員</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:#94a3b8;">
                <span>代表色：<span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${t.color}; vertical-align:middle;"></span></span>
                <span>拍燈鍵：<b>${t.key}</b></span>
              </div>
            </div>
          `;
        }).join('');
      }

      // 更新即時統計摘要
      const countLabel = document.getElementById('cfg-summary-text');
      if (countLabel) {
        countLabel.textContent = `當前共 ${this.state.players.length} 位玩家，分為 ${this.state.teams.length} 支隊伍（${this.state.mode === 'teams' ? '戰隊對抗模式' : '個人競爭模式'}）`;
      }
    },

    // 換隊邏輯
    changePlayerTeam(playerId, newTeamId) {
      const team = this.state.teams.find(t => t.id === newTeamId);
      this.updatePlayer(playerId, {
        teamId: newTeamId,
        color: team?.color || '#ffc83b'
      });
    },

    // 點擊輪換 Emoji
    cycleEmoji(playerId) {
      const p = this.state.players.find(x => x.id === playerId);
      if (p) {
        const currentIdx = AVATAR_EMOJIS.indexOf(p.emoji);
        const nextIdx = (currentIdx + 1) % AVATAR_EMOJIS.length;
        this.updatePlayer(playerId, { emoji: AVATAR_EMOJIS[nextIdx] });
      }
    },

    // 整合渲染
    render() {
      this.renderScoreboards();
      this.renderConfigModal();

      // 通知第二關畫畫接力刷新棒次與隊伍
      if (typeof updateG12RosterUI === 'function') {
        updateG12RosterUI();
      }
    },

    // 開啟設定彈窗
    openModal() {
      const modal = document.getElementById('modal-player-config');
      if (modal) {
        this.renderConfigModal();
        modal.classList.add('open');
      }
    },

    // 關閉設定彈窗
    closeModal() {
      const modal = document.getElementById('modal-player-config');
      if (modal) modal.classList.remove('open');
    },

    // 鍵盤拍燈監聽
    bindEvents() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        const k = e.key.toUpperCase();

        if (this.state.mode === 'teams') {
          // 隊伍快速鍵
          const team = this.state.teams.find(t => t.key === k);
          if (team) {
            e.preventDefault();
            this.triggerBuzzer(team.id);
          }
        } else {
          // 個人快速鍵
          const player = this.state.players.find(p => p.key === k);
          if (player) {
            e.preventDefault();
            this.triggerBuzzer(player.id);
          }
        }
      });
    }
  };

  // 掛載至 window 全域
  window.partyHub = partyHub;

  // DOM 載入後啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => partyHub.init());
  } else {
    partyHub.init();
  }

})(window);
