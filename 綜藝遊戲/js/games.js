// ==========================================================
// 綜藝派對遊戲大廳 - 核心遊戲引擎 (12 大遊戲完整邏輯)
// ==========================================================

// ==========================================================
// 遊戲 1: 🔤 綜藝 Tempo 接龍 (題目無重複 ✕ 靈感提示)
// ==========================================================
let g1TopicDeck = [];
let g1DrawnCount = 0;

function drawGame1() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (g1TopicDeck.length === 0) {
    g1TopicDeck = [...G1_TOPICS_POOL].sort(() => Math.random() - 0.5);
    g1DrawnCount = 0;
  }
  g1DrawnCount++;
  const c1 = ZHUYIN[Math.floor(Math.random() * ZHUYIN.length)];
  let c2 = ZHUYIN[Math.floor(Math.random() * ZHUYIN.length)];
  if (c1 === c2) c2 = ZHUYIN[(ZHUYIN.indexOf(c1) + 1) % ZHUYIN.length];
  const topic = g1TopicDeck.pop();

  const c1El = document.getElementById('g1-c1');
  const c2El = document.getElementById('g1-c2');
  const topicEl = document.getElementById('g1-topic');
  const counterEl = document.getElementById('g1-deck-counter');
  const comboEl = document.getElementById('g1-combo-text');
  const hintEl = document.getElementById('g1-hint-box');

  if (c1El) c1El.textContent = c1;
  if (c2El) c2El.textContent = c2;
  if (topicEl) topicEl.textContent = `🎯 挑戰主題：${topic}`;
  if (counterEl) counterEl.textContent = `🎯 主題進度：第 ${g1DrawnCount} / ${G1_TOPICS_POOL.length} 題 (無重複)`;
  if (comboEl) comboEl.textContent = `${c1} ＋ ${c2}`;
  if (hintEl) hintEl.style.display = 'none';
}

const g1BtnDraw = document.getElementById('g1-btn-draw');
if (g1BtnDraw) g1BtnDraw.addEventListener('click', drawGame1);

const g1BtnHint = document.getElementById('g1-btn-hint');
if (g1BtnHint) {
  g1BtnHint.addEventListener('click', () => {
    const c1 = document.getElementById('g1-c1')?.textContent || 'ㄅ';
    const c2 = document.getElementById('g1-c2')?.textContent || 'ㄆ';
    const key = `${c1}+${c2}`;
    const hint = (typeof G1_HINTS !== 'undefined' && G1_HINTS[key]) ? G1_HINTS[key].join('、') : `例：${c1} ... ＋ ${c2} ...（造詞或造句）`;
    const box = document.getElementById('g1-hint-box');
    if (box) {
      box.textContent = `💡 參考靈感：${hint}`;
      box.style.display = 'block';
    }
  });
}
window.drawGame1 = drawGame1;

// ==========================================================
// 遊戲 2: 🥁 節奏 Tempo 節拍器
// ==========================================================
let g2Running = false, g2Interval = null, g2Beat = 0;
let g2Deck = [];
let g2DrawnCount = 0;

function applyNextG2Topic() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (g2Deck.length === 0) {
    g2Deck = [...G2_TOPICS_POOL].sort(() => Math.random() - 0.5);
    g2DrawnCount = 0;
  }
  g2DrawnCount++;
  const t = g2Deck.pop();
  const topicEl = document.getElementById('g2-topic');
  const counterEl = document.getElementById('g2-deck-counter');
  if (topicEl) topicEl.textContent = t;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g2DrawnCount} / ${G2_TOPICS_POOL.length} 題 (無重複)`;
}

const g2BtnToggle = document.getElementById('g2-btn-toggle');
if (g2BtnToggle) {
  g2BtnToggle.addEventListener('click', () => {
    if (g2Running) {
      clearInterval(g2Interval);
      g2Interval = null;
      g2Running = false;
      g2BtnToggle.textContent = '▶️ 開始節拍';
      for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`b-${i}`);
        if (dot) dot.classList.remove('active');
      }
    } else {
      g2Running = true;
      g2BtnToggle.textContent = '⏸️ 停止節拍';
      g2Interval = setInterval(() => {
        g2Beat = (g2Beat % 4) + 1;
        for (let i = 1; i <= 4; i++) {
          const dot = document.getElementById(`b-${i}`);
          if (dot) dot.classList.toggle('active', i === g2Beat);
        }
        if (typeof audio !== 'undefined') audio.playBeat(g2Beat === 1);
      }, 550);
    }
  });
}

const g2BtnNext = document.getElementById('g2-btn-next-topic');
if (g2BtnNext) g2BtnNext.addEventListener('click', applyNextG2Topic);
window.applyNextG2Topic = applyNextG2Topic;

// ==========================================================
// 遊戲 3: 📺 綜藝大電視 (限時 60 秒猜詞挑戰)
// ==========================================================
let g3Timer = null, g3Sec = 60, g3Score = 0;
let g3Deck = [];
let g3DrawnCount = 0;

function nextG3Word() {
  if (g3Deck.length === 0) {
    g3Deck = [...G3_WORDS_POOL].sort(() => Math.random() - 0.5);
    g3DrawnCount = 0;
  }
  g3DrawnCount++;
  const item = g3Deck.pop();
  const wordEl = document.getElementById('g3-word');
  const catEl = document.getElementById('g3-category');
  const counterEl = document.getElementById('g3-deck-counter');
  if (wordEl) wordEl.textContent = item.w;
  if (catEl) catEl.textContent = `🏷️ 類別：【${item.cat}】`;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g3DrawnCount} / ${G3_WORDS_POOL.length} 題 (無重複)`;
}

const g3BtnStart = document.getElementById('g3-btn-start');
if (g3BtnStart) {
  g3BtnStart.addEventListener('click', () => {
    clearInterval(g3Timer);
    g3Sec = 60; g3Score = 0;
    const scoreText = document.getElementById('g3-score-text');
    if (scoreText) scoreText.textContent = '🏆 本局已答對：0 題';
    nextG3Word();
    if (typeof audio !== 'undefined') audio.playBeat(true);

    g3Timer = setInterval(() => {
      if (g3Sec > 0) {
        g3Sec--;
        const timerEl = document.getElementById('g3-timer');
        if (timerEl) timerEl.textContent = `⏱️ ${g3Sec} 秒`;
        if (g3Sec <= 5 && g3Sec > 0) {
          if (typeof audio !== 'undefined') audio.playCountdownBeep(g3Sec);
        }
      } else {
        clearInterval(g3Timer);
        g3Timer = null;
        if (typeof audio !== 'undefined') audio.playExplosion();
        const wordEl = document.getElementById('g3-word');
        if (wordEl) wordEl.textContent = `⏰ 時間到！總計答對 ${g3Score} 題！`;
      }
    }, 1000);
  });
}

const g3BtnCorrect = document.getElementById('g3-btn-correct');
if (g3BtnCorrect) {
  g3BtnCorrect.addEventListener('click', () => {
    g3Score++;
    const scoreText = document.getElementById('g3-score-text');
    if (scoreText) scoreText.textContent = `🏆 本局已答對：${g3Score} 題`;
    if (typeof audio !== 'undefined') audio.playSuccess();
    if (typeof confettiEffect === 'function') confettiEffect();
    nextG3Word();
  });
}

const g3BtnPass = document.getElementById('g3-btn-pass');
if (g3BtnPass) {
  g3BtnPass.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playBeat(false);
    nextG3Word();
  });
}
window.nextG3Word = nextG3Word;

// ==========================================================
// 遊戲 4: 🧠 我們心電感應 (默契大考驗)
// ==========================================================
let g4Mode = '4p';
let g4Deck = [];
let g4DrawnCount = 0;

function drawNextG4Question() {
  if (g4Deck.length === 0) {
    g4Deck = [...G4_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
    g4DrawnCount = 0;
  }
  g4DrawnCount++;
  const item = g4Deck.pop();
  return {
    item: item,
    current: g4DrawnCount,
    total: G4_QUESTIONS_POOL.length,
    remaining: g4Deck.length
  };
}

function renderG4Players() {
  const grid = document.getElementById('g4-players-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const count = (g4Mode === '4p') ? 4 : 6;

  for (let i = 1; i <= count; i++) {
    const card = document.createElement('div');
    const isRed = (g4Mode === 'team' && i <= 3);
    const isBlue = (g4Mode === 'team' && i > 3);
    card.className = `p-card ${isRed ? 'team-red-player' : ''} ${isBlue ? 'team-blue-player' : ''}`;
    
    let label = `玩家 ${i}`;
    if (g4Mode === 'team') {
      label = i <= 3 ? `🔴 紅隊 - 隊員 ${i}` : `🔵 藍隊 - 隊員 ${i - 3}`;
    }

    card.innerHTML = `
      <span class="p-title">${label}</span>
      <input type="password" class="p-answer-input" id="g4-p-${i}" placeholder="輸入答案...">
    `;
    grid.appendChild(card);
  }
}

function applyNextG4Question() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  const res = drawNextG4Question();
  const qEl = document.getElementById('g4-question');
  const catEl = document.getElementById('g4-category-badge');
  const counterEl = document.getElementById('g4-deck-counter');
  const resultEl = document.getElementById('g4-result-msg');
  if (qEl) qEl.textContent = res.item.q;
  if (catEl) catEl.textContent = `🏷️ 類別：【${res.item.cat}】`;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${res.current} / ${res.total} 題 (無重複)`;
  if (resultEl) resultEl.textContent = '';
  document.querySelectorAll('.p-answer-input').forEach(inp => {
    inp.value = '';
    inp.type = 'password';
  });
}

const g4Mode4p = document.getElementById('g4-mode-4p');
if (g4Mode4p) {
  g4Mode4p.addEventListener('click', () => {
    g4Mode = '4p';
    document.querySelectorAll('.telepathy-mode-selector .mode-btn').forEach(b => b.classList.remove('active'));
    g4Mode4p.classList.add('active');
    renderG4Players();
  });
}

const g4Mode6p = document.getElementById('g4-mode-6p');
if (g4Mode6p) {
  g4Mode6p.addEventListener('click', () => {
    g4Mode = '6p';
    document.querySelectorAll('.telepathy-mode-selector .mode-btn').forEach(b => b.classList.remove('active'));
    g4Mode6p.classList.add('active');
    renderG4Players();
  });
}

const g4ModeTeam = document.getElementById('g4-mode-team');
if (g4ModeTeam) {
  g4ModeTeam.addEventListener('click', () => {
    g4Mode = 'team';
    document.querySelectorAll('.telepathy-mode-selector .mode-btn').forEach(b => b.classList.remove('active'));
    g4ModeTeam.classList.add('active');
    renderG4Players();
  });
}

const g4BtnNextQ = document.getElementById('g4-btn-next-q');
if (g4BtnNextQ) g4BtnNextQ.addEventListener('click', applyNextG4Question);

let g4CountdownTimer = null;
const g4BtnCountdown = document.getElementById('g4-btn-countdown');
if (g4BtnCountdown) {
  g4BtnCountdown.addEventListener('click', () => {
    clearInterval(g4CountdownTimer);
    let count = 3;
    const display = document.getElementById('g4-countdown-display');
    if (display) display.textContent = `⏱️ ${count}...`;
    if (typeof audio !== 'undefined') audio.playCountdownBeep(count);

    g4CountdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (display) display.textContent = `⏱️ ${count}...`;
        if (typeof audio !== 'undefined') audio.playCountdownBeep(count);
      } else if (count === 0) {
        if (display) display.textContent = `📢 3、2、1！同時喊出答案！`;
        if (typeof audio !== 'undefined') audio.playCountdownBeep(0);
      } else {
        clearInterval(g4CountdownTimer);
        g4CountdownTimer = null;
      }
    }, 1000);
  });
}

const g4BtnReveal = document.getElementById('g4-btn-reveal-all');
if (g4BtnReveal) {
  g4BtnReveal.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playSuccess();
    const answers = [];
    document.querySelectorAll('.p-answer-input').forEach(inp => {
      inp.type = 'text';
      answers.push(inp.value.trim());
    });

    const filled = answers.filter(a => a !== '');
    if (filled.length > 0) {
      const counts = {};
      filled.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      const maxMatch = Math.max(...Object.values(counts));
      const resEl = document.getElementById('g4-result-msg');
      if (resEl) {
        if (maxMatch >= 3) {
          resEl.textContent = `✨ 太有默契了！有 ${maxMatch} 位玩家答案完全一致！🎉`;
          if (typeof confettiEffect === 'function') confettiEffect();
        } else {
          resEl.textContent = `🤣 默契考驗中！最高相同人數：${maxMatch} 人！`;
        }
      }
    }
  });
}

const g4BtnClear = document.getElementById('g4-btn-clear-all');
if (g4BtnClear) {
  g4BtnClear.addEventListener('click', () => {
    document.querySelectorAll('.p-answer-input').forEach(inp => {
      inp.value = '';
      inp.type = 'password';
    });
    const resEl = document.getElementById('g4-result-msg');
    const disp = document.getElementById('g4-countdown-display');
    if (resEl) resEl.textContent = '';
    if (disp) disp.textContent = '';
  });
}

renderG4Players();
window.applyNextG4Question = applyNextG4Question;

// ==========================================================
// 遊戲 5: 🕵️ 誰是臥底 (精選不重複詞彙庫 ✕ 現場發牌)
// ==========================================================
let g5PairsDeck = [];
let g5DrawnCount = 0;

const g5BtnStart = document.getElementById('g5-btn-start');
if (g5BtnStart) {
  g5BtnStart.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playBeat(true);
    if (g5PairsDeck.length === 0) {
      g5PairsDeck = [...G5_PAIRS_POOL].sort(() => Math.random() - 0.5);
      g5DrawnCount = 0;
    }
    g5DrawnCount++;
    const pCountSelect = document.getElementById('g5-players-count');
    const count = pCountSelect ? parseInt(pCountSelect.value) : 6;
    const pair = g5PairsDeck.pop();
    const spyIdx = Math.floor(Math.random() * count);
    const container = document.getElementById('g5-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const counterEl = document.getElementById('g5-deck-counter');
    if (counterEl) counterEl.textContent = `🎯 詞庫進度：第 ${g5DrawnCount} / ${G5_PAIRS_POOL.length} 組 (無重複)`;

    for (let i = 0; i < count; i++) {
      const word = (i === spyIdx) ? pair.spy : pair.normal;
      const card = document.createElement('div');
      card.className = 'spy-card';
      card.innerHTML = `<strong>玩家 ${i + 1}</strong><div style="margin-top:6px; font-size:0.8rem; color:#888;">點擊查看</div>`;
      let open = false;
      card.addEventListener('click', () => {
        open = !open;
        if (open) {
          card.innerHTML = `<strong>玩家 ${i + 1}</strong><div style="margin-top:6px; color:var(--gold); font-weight:800;">${word}</div>`;
          card.classList.add('checked');
        } else {
          card.innerHTML = `<strong>玩家 ${i + 1}</strong><div style="margin-top:6px; color:var(--neon-green);">✓ 已看過</div>`;
        }
      });
      container.appendChild(card);
    }
  });
}

// ==========================================================
// 遊戲 6: 💣 定時炸彈聯想 (隨機爆炸 ✕ 緊張心跳)
// ==========================================================
let g6BombTimer = null;
let g6CurrentHolder = 1;
let g6BombRunning = false;
let g6PlayerCount = 4;
let g6BombDeck = [];
let g6DrawnCount = 0;

function renderG6PlayerNodes() {
  const container = document.getElementById('g6-player-nodes');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 1; i <= g6PlayerCount; i++) {
    const node = document.createElement('div');
    node.id = `b-node-${i}`;
    if (i === g6CurrentHolder) {
      node.className = 'player-bomb-node holding-bomb';
      node.textContent = `💣 玩家 ${i}`;
    } else {
      node.className = 'player-bomb-node';
      node.textContent = `玩家 ${i}`;
    }
    container.appendChild(node);
  }
}

function setG6Count(num) {
  g6PlayerCount = num;
  g6CurrentHolder = 1;
  const tab4 = document.getElementById('g6-tab-4p');
  const tab6 = document.getElementById('g6-tab-6p');
  if (tab4) tab4.classList.toggle('active', num === 4);
  if (tab6) tab6.classList.toggle('active', num === 6);
  renderG6PlayerNodes();
}
window.setG6Count = setG6Count;

function updateBombHolderUI() {
  for (let i = 1; i <= g6PlayerCount; i++) {
    const node = document.getElementById(`b-node-${i}`);
    if (!node) continue;
    if (i === g6CurrentHolder) {
      node.className = 'player-bomb-node holding-bomb';
      node.textContent = `💣 玩家 ${i}`;
    } else {
      node.className = 'player-bomb-node';
      node.textContent = `玩家 ${i}`;
    }
  }
}

function applyNextG6Topic() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (g6BombDeck.length === 0) {
    g6BombDeck = [...G6_BOMB_TOPICS_POOL].sort(() => Math.random() - 0.5);
    g6DrawnCount = 0;
  }
  g6DrawnCount++;
  const t = g6BombDeck.pop();
  const topicEl = document.getElementById('g6-bomb-topic');
  const counterEl = document.getElementById('g6-deck-counter');
  const statusEl = document.getElementById('g6-bomb-status');
  if (topicEl) topicEl.textContent = t;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g6DrawnCount} / ${G6_BOMB_TOPICS_POOL.length} 題 (無重複)`;
  if (statusEl) {
    statusEl.textContent = '💣 炸彈狀態：未啟動（請點擊下方開始）';
    statusEl.style.color = '#ff3366';
  }
  clearInterval(g6BombTimer);
  g6BombTimer = null;
  g6BombRunning = false;
}

const g6BtnNext = document.getElementById('g6-btn-next-topic');
if (g6BtnNext) g6BtnNext.addEventListener('click', applyNextG6Topic);

const g6BtnStart = document.getElementById('g6-btn-start-bomb');
if (g6BtnStart) {
  g6BtnStart.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playBeat(true);
    clearInterval(g6BombTimer);
    g6BombRunning = true;
    g6CurrentHolder = 1;
    updateBombHolderUI();

    const statusEl = document.getElementById('g6-bomb-status');
    if (statusEl) {
      statusEl.textContent = '🔥 炸彈引信已點燃！快回答傳給下一位！';
      statusEl.style.color = '#ffc83b';
    }

    const bombDuration = (Math.floor(Math.random() * 22) + 14) * 1000;
    const startTime = Date.now();

    g6BombTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (typeof audio !== 'undefined') audio.playBeat(false);

      if (elapsed >= bombDuration) {
        clearInterval(g6BombTimer);
        g6BombTimer = null;
        g6BombRunning = false;
        if (typeof audio !== 'undefined') audio.playExplosion();
        if (statusEl) {
          statusEl.textContent = `💥💥 轟！！炸彈在【玩家 ${g6CurrentHolder}】手上引爆！淘汰！`;
          statusEl.style.color = '#ff2a6d';
        }
      }
    }, 700);
  });
}

const g6BtnPass = document.getElementById('g6-btn-pass-bomb');
if (g6BtnPass) {
  g6BtnPass.addEventListener('click', () => {
    if (!g6BombRunning) {
      alert('請先點擊「🧨 啟動定時炸彈」開始遊戲！');
      return;
    }
    if (typeof audio !== 'undefined') audio.playSuccess();
    g6CurrentHolder = (g6CurrentHolder % g6PlayerCount) + 1;
    updateBombHolderUI();
  });
}

renderG6PlayerNodes();
window.applyNextG6Topic = applyNextG6Topic;

// ==========================================================
// 遊戲 7: ⚡ 快問快答 3 秒極速 (緊迫倒數 ✕ 即時反應)
// ==========================================================
let g7PanicTimer = null;
let g7TimeRemaining = 3.0;
let g7Deck = [];
let g7DrawnCount = 0;

function resetG7Timer() {
  clearInterval(g7PanicTimer);
  g7PanicTimer = null;
  g7TimeRemaining = 3.0;
  const textEl = document.getElementById('g7-timer-text');
  const fillEl = document.getElementById('g7-timer-fill');
  if (textEl) textEl.textContent = '⏱️ 3.0 秒';
  if (fillEl) fillEl.style.width = '100%';
}

function applyNextG7Question() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  resetG7Timer();
  if (g7Deck.length === 0) {
    g7Deck = [...G7_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
    g7DrawnCount = 0;
  }
  g7DrawnCount++;
  const q = g7Deck.pop();
  const qEl = document.getElementById('g7-question');
  const counterEl = document.getElementById('g7-deck-counter');
  if (qEl) qEl.textContent = q;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g7DrawnCount} / ${G7_QUESTIONS_POOL.length} 題 (無重複)`;
}

const g7BtnNext = document.getElementById('g7-btn-next');
if (g7BtnNext) g7BtnNext.addEventListener('click', applyNextG7Question);

const g7BtnStart = document.getElementById('g7-btn-start');
if (g7BtnStart) {
  g7BtnStart.addEventListener('click', () => {
    resetG7Timer();
    if (typeof audio !== 'undefined') audio.playBeat(true);
    const startTime = Date.now();
    const totalDuration = 3000;

    g7PanicTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remain = Math.max(0, totalDuration - elapsed);
      g7TimeRemaining = (remain / 1000).toFixed(1);
      const textEl = document.getElementById('g7-timer-text');
      const fillEl = document.getElementById('g7-timer-fill');
      if (textEl) textEl.textContent = `⏱️ ${g7TimeRemaining} 秒`;
      const percentage = (remain / totalDuration) * 100;
      if (fillEl) fillEl.style.width = `${percentage}%`;

      if (remain <= 0) {
        clearInterval(g7PanicTimer);
        g7PanicTimer = null;
        if (typeof audio !== 'undefined') audio.playExplosion();
        if (textEl) textEl.textContent = `💥 時間到！爆炸！`;
      }
    }, 50);
  });
}

const g7BtnPass = document.getElementById('g7-btn-pass');
if (g7BtnPass) {
  g7BtnPass.addEventListener('click', () => {
    clearInterval(g7PanicTimer);
    g7PanicTimer = null;
    if (typeof audio !== 'undefined') audio.playSuccess();
    if (typeof confettiEffect === 'function') confettiEffect();
    applyNextG7Question();
  });
}

const g7BtnFail = document.getElementById('g7-btn-fail');
if (g7BtnFail) {
  g7BtnFail.addEventListener('click', () => {
    clearInterval(g7PanicTimer);
    g7PanicTimer = null;
    if (typeof audio !== 'undefined') audio.playExplosion();
  });
}
window.applyNextG7Question = applyNextG7Question;

// ==========================================================
// 遊戲 8: 🔄 反向思考大腦倒著說 (詞彙鏡像逆轉)
// ==========================================================
let g8Deck = [];
let g8DrawnCount = 0;

function drawNextG8Word() {
  if (g8Deck.length === 0) {
    g8Deck = [...G8_WORDS_POOL].sort(() => Math.random() - 0.5);
    g8DrawnCount = 0;
  }
  g8DrawnCount++;
  const item = g8Deck.pop();
  return {
    item: item,
    current: g8DrawnCount,
    total: G8_WORDS_POOL.length,
    remaining: g8Deck.length
  };
}

function applyNextG8Word() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  const res = drawNextG8Word();
  const wordEl = document.getElementById('g8-word');
  const hintEl = document.getElementById('g8-hint');
  const catEl = document.getElementById('g8-category-badge');
  const counterEl = document.getElementById('g8-deck-counter');
  if (wordEl) wordEl.textContent = res.item.w;
  if (hintEl) hintEl.textContent = `💡 英文提示參考：${res.item.h}`;
  if (catEl) catEl.textContent = `🏷️ 類別：【${res.item.cat}】`;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${res.current} / ${res.total} 題 (無重複)`;
}

const g8BtnNext = document.getElementById('g8-btn-next');
if (g8BtnNext) g8BtnNext.addEventListener('click', applyNextG8Word);

const g8BtnCorrect = document.getElementById('g8-btn-correct');
if (g8BtnCorrect) {
  g8BtnCorrect.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playSuccess();
    if (typeof confettiEffect === 'function') confettiEffect();
    applyNextG8Word();
  });
}

const g8BtnPass = document.getElementById('g8-btn-pass');
if (g8BtnPass) {
  g8BtnPass.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playBeat(false);
    applyNextG8Word();
  });
}
window.applyNextG8Word = applyNextG8Word;

// ==========================================================
// 遊戲 9: 🃏 記憶翻牌大對抗 (動態圖示 ✕ 戰隊翻牌)
// ==========================================================
let g9Cards = [], g9Flipped = [], g9TurnRed = true;

function initG9() {
  const grid = document.getElementById('g9-grid');
  if (!grid) return;
  grid.innerHTML = '';
  g9Flipped = [];
  const currentTheme = THEME_ICONS_POOL[Math.floor(Math.random() * THEME_ICONS_POOL.length)];
  const deck = [...currentTheme, ...currentTheme].sort(() => Math.random() - 0.5);
  deck.forEach((icon) => {
    const c = document.createElement('div');
    c.className = 'memo-card';
    c.textContent = '?';
    c.dataset.icon = icon;
    c.addEventListener('click', () => {
      if (c.classList.contains('flipped') || g9Flipped.length >= 2) return;
      c.classList.add('flipped');
      c.textContent = icon;
      if (typeof audio !== 'undefined') audio.playBeat(false);
      g9Flipped.push(c);

      if (g9Flipped.length === 2) {
        const [c1, c2] = g9Flipped;
        if (c1.dataset.icon === c2.dataset.icon) {
          c1.classList.add('matched');
          c2.classList.add('matched');
          if (typeof audio !== 'undefined') audio.playSuccess();
          g9Flipped = [];
        } else {
          setTimeout(() => {
            c1.classList.remove('flipped'); c1.textContent = '?';
            c2.classList.remove('flipped'); c2.textContent = '?';
            g9Flipped = [];
            g9TurnRed = !g9TurnRed;
            const turnEl = document.getElementById('g9-turn');
            if (turnEl) {
              turnEl.textContent = g9TurnRed ? '輪到：🔴 紅隊翻牌' : '輪到：🔵 藍隊翻牌';
              turnEl.style.color = g9TurnRed ? 'var(--red-team)' : 'var(--blue-team)';
            }
          }, 800);
        }
      }
    });
    grid.appendChild(c);
  });
}

const g9BtnReset = document.getElementById('g9-btn-reset');
if (g9BtnReset) g9BtnReset.addEventListener('click', initG9);
window.initG9 = initG9;

// ==========================================================
// 遊戲 10: 🤫 綜藝傳話筒 (超長繞口令與爆笑秘密句子)
// ==========================================================
let g10Timer = null;
let g10Sec = 60;
let g10Deck = [];
let g10DrawnCount = 0;

const promptCard = document.getElementById('g10-hidden-prompt');
const realCard = document.getElementById('g10-real-sentence');

if (promptCard && realCard) {
  promptCard.addEventListener('click', () => {
    promptCard.style.display = 'none';
    realCard.style.display = 'block';
  });
}

function applyNextG10Sentence() {
  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (g10Deck.length === 0) {
    g10Deck = [...G10_SENTENCES_POOL].sort(() => Math.random() - 0.5);
    g10DrawnCount = 0;
  }
  g10DrawnCount++;
  const s = g10Deck.pop();
  if (realCard) {
    realCard.textContent = s;
    realCard.style.display = 'none';
  }
  if (promptCard) promptCard.style.display = 'block';
  clearInterval(g10Timer);
  g10Timer = null;
  g10Sec = 60;
  const timerDisplay = document.getElementById('g10-timer-display');
  if (timerDisplay) timerDisplay.textContent = '⏱️ 剩餘時間：60 秒';
}

const g10BtnNext = document.getElementById('g10-btn-next-sentence');
if (g10BtnNext) g10BtnNext.addEventListener('click', applyNextG10Sentence);

const g10BtnStart = document.getElementById('g10-btn-start-timer');
if (g10BtnStart) {
  g10BtnStart.addEventListener('click', () => {
    clearInterval(g10Timer);
    g10Sec = 60;
    if (typeof audio !== 'undefined') audio.playBeat(true);

    g10Timer = setInterval(() => {
      if (g10Sec > 0) {
        g10Sec--;
        const timerDisplay = document.getElementById('g10-timer-display');
        if (timerDisplay) timerDisplay.textContent = `⏱️ 剩餘時間：${g10Sec} 秒`;
        if (g10Sec <= 5 && g10Sec > 0) {
          if (typeof audio !== 'undefined') audio.playCountdownBeep(g10Sec);
        }
      } else {
        clearInterval(g10Timer);
        g10Timer = null;
        if (typeof audio !== 'undefined') audio.playExplosion();
        const timerDisplay = document.getElementById('g10-timer-display');
        if (timerDisplay) timerDisplay.textContent = `⏰ 時間到！請最後一位玩家公佈答案！`;
      }
    }, 1000);
  });
}
window.applyNextG10Sentence = applyNextG10Sentence;

// ==========================================================
// 遊戲 11: 🔍 第一關：翻注音現場找物 (37 注音不重複 ✕ 現場限時搶物)
// ==========================================================
let g11Deck = [];
let g11DrawnCount = 0;
let g11CurrentItem = null;
let g11Timer = null;
let g11Sec = 60;
let g11InitialSec = 60;

function shuffleG11Deck() {
  g11Deck = [...G11_ZHUYIN_POOL].sort(() => Math.random() - 0.5);
  g11DrawnCount = 0;
}

function drawNextG11Card() {
  if (g11Deck.length === 0) {
    shuffleG11Deck();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  }
  g11DrawnCount++;
  g11CurrentItem = g11Deck.pop();

  if (typeof audio !== 'undefined') audio.playBeat(false);

  // 3D 翻牌動畫效果
  const cardBox = document.getElementById('g11-card-box');
  if (cardBox) {
    cardBox.classList.remove('flipped');
    setTimeout(() => {
      const charDisp = document.getElementById('g11-char-display');
      const targetChar = document.getElementById('g11-target-char');
      const charSub = document.getElementById('g11-char-sub');
      if (charDisp) charDisp.textContent = g11CurrentItem.char;
      if (targetChar) targetChar.textContent = g11CurrentItem.char;
      if (charSub) charSub.textContent = `範例首音：找「${g11CurrentItem.example}」等`;
      cardBox.classList.add('flipped');
      if (typeof audio !== 'undefined') audio.playBeat(true);
    }, 280);
  }

  // 更新文字看板與計數
  const deckCounter = document.getElementById('g11-deck-counter');
  if (deckCounter) {
    deckCounter.textContent = `🎯 題庫進度：第 ${g11DrawnCount} / ${G11_ZHUYIN_POOL.length} 題 (無重複，剩餘 ${g11Deck.length} 題)`;
  }
  const missionText = document.getElementById('g11-mission-text');
  if (missionText) {
    missionText.innerHTML = `請在現場限時找到【<span style="color:var(--gold); font-size:1.7rem;">${g11CurrentItem.char}</span>】開頭的真實物品！例如：${g11CurrentItem.example}`;
  }

  // 隨機趣味挑戰加碼卡
  const modBox = document.getElementById('g11-modifier-box');
  if (modBox) {
    if (Math.random() < 0.45 && typeof G11_MODIFIERS !== 'undefined') {
      const randomMod = G11_MODIFIERS[Math.floor(Math.random() * G11_MODIFIERS.length)];
      modBox.innerHTML = `<span>${randomMod}</span>`;
      modBox.style.display = 'flex';
    } else {
      modBox.innerHTML = `<span>⚡ 現場規則：率先將物品送至大螢幕前並清楚喊出名稱即獲得判定資格！</span>`;
      modBox.style.display = 'flex';
    }
  }

  // 隱藏並預載提示庫
  const hintsContainer = document.getElementById('g11-hints-container');
  if (hintsContainer) hintsContainer.style.display = 'none';

  // 重設計時器文字
  resetG11Timer();
}

function setG11TimerPreset(seconds) {
  g11InitialSec = seconds;
  resetG11Timer();
  // 更新 30/60/90/120 按鈕 active 狀態
  document.querySelectorAll('#view-game-11 .nav-btn').forEach(btn => {
    const txt = btn.textContent;
    if (txt.includes(`${seconds} 秒`)) {
      btn.classList.add('active');
    } else if (txt.includes('秒速戰') || txt.includes('秒標準') || txt.includes('秒寬裕') || txt.includes('秒大混戰')) {
      btn.classList.remove('active');
    }
  });
  if (typeof audio !== 'undefined') audio.playBeat(false);
}

function resetG11Timer() {
  if (g11Timer) {
    clearInterval(g11Timer);
    g11Timer = null;
  }
  g11Sec = g11InitialSec;
  const disp = document.getElementById('g11-timer-display');
  if (disp) {
    disp.textContent = `⏱️ 剩餘時間：${g11Sec} 秒`;
    disp.style.color = '#ff3366';
  }
  const btn = document.getElementById('g11-btn-timer-toggle');
  if (btn) btn.textContent = '⏱️ 開始倒數計時';
}

function toggleG11Timer() {
  const btn = document.getElementById('g11-btn-timer-toggle');
  const disp = document.getElementById('g11-timer-display');

  if (g11Timer) {
    clearInterval(g11Timer);
    g11Timer = null;
    if (btn) btn.textContent = '▶️ 繼續倒數';
    return;
  }

  if (g11Sec <= 0) {
    g11Sec = g11InitialSec;
  }

  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (btn) btn.textContent = '⏸️ 暫停計時';

  g11Timer = setInterval(() => {
    if (g11Sec > 0) {
      g11Sec--;
      if (disp) {
        disp.textContent = `⏱️ 剩餘時間：${g11Sec} 秒`;
        disp.style.color = (g11Sec <= 10) ? '#ff0033' : '#ff3366';
      }
      if (g11Sec <= 5 && g11Sec > 0) {
        if (typeof audio !== 'undefined') audio.playCountdownBeep(g11Sec);
      } else {
        if (typeof audio !== 'undefined') audio.playBeat(false);
      }
    } else {
      clearInterval(g11Timer);
      g11Timer = null;
      if (typeof audio !== 'undefined') audio.playExplosion();
      if (disp) disp.textContent = '⏰ 時間到！請全場停止移動，裁判進行驗收！';
      if (btn) btn.textContent = '🔄 重新計時';
    }
  }, 1000);
}

// 點擊卡牌手動翻轉
const g11CardBox = document.getElementById('g11-card-box');
if (g11CardBox) {
  g11CardBox.addEventListener('click', () => {
    g11CardBox.classList.toggle('flipped');
    if (typeof audio !== 'undefined') audio.playBeat(false);
  });
}

// 靈感提示清單展開
const g11BtnHint = document.getElementById('g11-btn-hint');
if (g11BtnHint) {
  g11BtnHint.addEventListener('click', () => {
    if (!g11CurrentItem) {
      g11CurrentItem = (typeof G11_ZHUYIN_POOL !== 'undefined' && G11_ZHUYIN_POOL.length > 0) 
        ? (G11_ZHUYIN_POOL.find(i => i.char === 'ㄑ') || G11_ZHUYIN_POOL[0])
        : { char: 'ㄑ', example: '球', hints: ['球', '鉛筆', '錢包', '汽水', '青椒'] };
    }
    const container = document.getElementById('g11-hints-container');
    const list = document.getElementById('g11-chips-list');
    const title = document.getElementById('g11-hints-title');
    if (!container || !list || !title) return;

    if (container.style.display === 'block') {
      container.style.display = 'none';
      return;
    }

    title.textContent = `💡【${g11CurrentItem.char}】現場常見真實物品參考清單：`;
    list.innerHTML = '';
    (g11CurrentItem.hints || []).forEach(hint => {
      const chip = document.createElement('span');
      chip.className = 'g11-chip';
      chip.textContent = hint;
      list.appendChild(chip);
    });

    container.style.display = 'block';
    if (typeof audio !== 'undefined') audio.playBeat(false);
  });
}

const g11BtnDraw = document.getElementById('g11-btn-draw');
if (g11BtnDraw) g11BtnDraw.addEventListener('click', drawNextG11Card);

const g11BtnTimerToggle = document.getElementById('g11-btn-timer-toggle');
if (g11BtnTimerToggle) g11BtnTimerToggle.addEventListener('click', toggleG11Timer);

const g11BtnVerifyPass = document.getElementById('g11-btn-verify-pass');
if (g11BtnVerifyPass) {
  g11BtnVerifyPass.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playSuccess();
    if (typeof confettiEffect === 'function') confettiEffect();
    const modBox = document.getElementById('g11-modifier-box');
    if (modBox) {
      modBox.innerHTML = `<span>🎉 恭喜驗收合格！裁判請於下方計分板為獲勝隊伍/玩家加分！</span>`;
    }
  });
}

const g11BtnVerifyFail = document.getElementById('g11-btn-verify-fail');
if (g11BtnVerifyFail) {
  g11BtnVerifyFail.addEventListener('click', () => {
    if (typeof audio !== 'undefined') audio.playBuzzer(280);
    const modBox = document.getElementById('g11-modifier-box');
    if (modBox) {
      modBox.innerHTML = `<span>❌ 判定不符或物品錯誤！開放其他隊伍/玩家繼續爭取！</span>`;
    }
  });
}

window.shuffleG11Deck = shuffleG11Deck;
window.drawNextG11Card = drawNextG11Card;
window.setG11TimerPreset = setG11TimerPreset;
window.resetG11Timer = resetG11Timer;
window.toggleG11Timer = toggleG11Timer;

// ==========================================================
// 遊戲 12: 🎨 第二關：童話與電影畫畫接力 (210+ 巨量題庫 ✕ 互動畫板)
// ==========================================================
let g12Category = 'all'; // 'all', 'fairy', 'movie'
let g12Deck = [];
let g12DrawnCount = 0;
let g12CurrentTopic = null;
let g12SelectedTeamId = null;

function getG12Batons() {
  if (typeof partyHub !== 'undefined' && typeof partyHub.getRelayBatons === 'function') {
    return partyHub.getRelayBatons(g12SelectedTeamId);
  }
  return ['第 1 棒', '第 2 棒', '第 3 棒', '第 4 棒', '最後猜題棒'];
}

function updateG12RosterUI() {
  const selector = document.getElementById('g12-team-selector');
  if (!selector) return;
  if (typeof partyHub === 'undefined') return;

  const teams = partyHub.getTeams();
  const container = document.getElementById('g12-team-select-container');

  if (partyHub.state.mode === 'teams' && teams && teams.length > 0) {
    if (!g12SelectedTeamId || !teams.some(t => t.id === g12SelectedTeamId)) {
      g12SelectedTeamId = teams[0].id;
    }
    if (container) container.style.display = 'flex';
    selector.innerHTML = teams.map(t => `<option value="${t.id}" ${t.id === g12SelectedTeamId ? 'selected' : ''}>${t.emoji} ${t.name}</option>`).join('');
  } else {
    if (container) container.style.display = 'none';
    g12SelectedTeamId = null;
  }
  updateG12RelayUI();
}
window.updateG12RosterUI = updateG12RosterUI;

let g12CurrentBatonIdx = 0;
let g12Timer = null;
let g12Sec = 30;
let g12BatonDuration = 30;
let g12ViewTimer = null;
let g12PlayMode = 'canvas'; // 'canvas' or 'host'

function getG12ActivePool() {
  if (g12Category === 'fairy') return G12_FAIRY_TALES_POOL;
  if (g12Category === 'movie') return G12_MOVIES_POOL;
  return G12_ALL_POOL;
}

function shuffleG12Deck() {
  const pool = getG12ActivePool();
  g12Deck = [...pool].sort(() => Math.random() - 0.5);
  g12DrawnCount = 0;
}

function drawNextG12Topic() {
  const pool = getG12ActivePool();
  if (g12Deck.length === 0) {
    shuffleG12Deck();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  }
  g12DrawnCount++;
  g12CurrentTopic = g12Deck.pop();

  if (typeof audio !== 'undefined') audio.playBeat(false);

  // 更新計數器與標籤
  const catNames = { all: '經典童話 ✕ 熱門電影', fairy: '經典童話故事專區', movie: '中外經典電影專區' };
  const catBadge = document.getElementById('g12-current-cat-badge');
  const counterEl = document.getElementById('g12-deck-counter');
  if (catBadge) catBadge.textContent = `🏷️ 題庫類別：【${catNames[g12Category]}】`;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g12DrawnCount} / ${pool.length} 題 (無重複，剩餘 ${g12Deck.length} 題)`;

  // 暗題卡片重設為隱藏狀態
  const secretPrompt = document.getElementById('g12-secret-prompt');
  const secretContent = document.getElementById('g12-secret-content');
  if (secretPrompt) secretPrompt.style.display = 'block';
  if (secretContent) secretContent.style.display = 'none';

  // 填入秘密題目內容
  const topicTag = document.getElementById('g12-topic-tag');
  const wordsCount = document.getElementById('g12-words-count');
  const secretTitle = document.getElementById('g12-secret-title');
  const secretHint = document.getElementById('g12-secret-hint');
  if (topicTag) topicTag.textContent = g12CurrentTopic.cat === '童話故事' ? '🏰 童話故事' : '🎬 經典電影';
  if (wordsCount) wordsCount.textContent = g12CurrentTopic.words;
  if (secretTitle) secretTitle.textContent = g12CurrentTopic.title;
  if (secretHint) secretHint.textContent = `💡 靈感特徵提示：${g12CurrentTopic.hint}`;

  // 隱藏揭曉答案框
  const revealBox = document.getElementById('g12-reveal-box');
  if (revealBox) revealBox.style.display = 'none';

  // 重設接力狀態與清空畫布
  resetG12Relay();
  clearG12Canvas();
}

// 點擊暗題卡揭開/隱藏
const secretCardBox = document.getElementById('g12-secret-card-box');
if (secretCardBox) {
  secretCardBox.addEventListener('click', (e) => {
    if (e.target.id === 'g12-btn-rehide') {
      const content = document.getElementById('g12-secret-content');
      const prompt = document.getElementById('g12-secret-prompt');
      if (content) content.style.display = 'none';
      if (prompt) prompt.style.display = 'block';
      if (typeof audio !== 'undefined') audio.playBeat(false);
      return;
    }
    const prompt = document.getElementById('g12-secret-prompt');
    const content = document.getElementById('g12-secret-content');
    if (prompt && prompt.style.display !== 'none') {
      prompt.style.display = 'none';
      if (content) content.style.display = 'block';
      if (typeof audio !== 'undefined') audio.playBeat(true);
    }
  });
}

// 題庫分類切換
document.querySelectorAll('.g12-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.g12-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    g12Category = btn.dataset.cat;
    shuffleG12Deck();
    drawNextG12Topic();
  });
});

// 重設接力棒次
function resetG12Relay() {
  if (g12Timer) {
    clearInterval(g12Timer);
    g12Timer = null;
  }
  if (g12ViewTimer) {
    clearInterval(g12ViewTimer);
    g12ViewTimer = null;
  }
  g12CurrentBatonIdx = 0;
  g12Sec = g12BatonDuration;

  updateG12RelayUI();
  hideG12RelayOverlay();
}

function updateG12RelayUI() {
  const batons = getG12Batons();
  const batonName = batons[g12CurrentBatonIdx] || '交棒結束';
  const batonDisp = document.getElementById('g12-baton-display');
  const timerDisp = document.getElementById('g12-timer-display');
  const startBtn = document.getElementById('g12-btn-start-baton');
  if (batonDisp) batonDisp.textContent = `👤 ${batonName} 作畫中`;
  if (timerDisp) {
    timerDisp.textContent = `⏱️ ${g12Sec} 秒`;
    timerDisp.style.color = '#ff3366';
  }
  if (startBtn) startBtn.textContent = '▶️ 開始作畫';

  // 主持人模式看板同步
  const hostBaton = document.getElementById('g12-host-big-baton');
  const hostTimer = document.getElementById('g12-host-big-timer');
  if (hostBaton) hostBaton.textContent = `${batonName} 繪製中`;
  if (hostTimer) hostTimer.textContent = `⏱️ ${g12Sec}`;
}

function startG12BatonTimer() {
  const startBtn = document.getElementById('g12-btn-start-baton');
  if (g12Timer) {
    clearInterval(g12Timer);
    g12Timer = null;
    if (startBtn) startBtn.textContent = '▶️ 繼續作畫';
    return;
  }

  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (startBtn) startBtn.textContent = '⏸️ 暫停';

  g12Timer = setInterval(() => {
    if (g12Sec > 0) {
      g12Sec--;
      const timerDisp = document.getElementById('g12-timer-display');
      const hostTimer = document.getElementById('g12-host-big-timer');
      if (timerDisp) timerDisp.textContent = `⏱️ ${g12Sec} 秒`;
      if (hostTimer) hostTimer.textContent = `⏱️ ${g12Sec}`;

      if (g12Sec <= 5 && g12Sec > 0) {
        if (typeof audio !== 'undefined') audio.playCountdownBeep(g12Sec);
      } else {
        if (typeof audio !== 'undefined') audio.playBeat(false);
      }
    } else {
      clearInterval(g12Timer);
      g12Timer = null;
      if (typeof audio !== 'undefined') audio.playExplosion();
      triggerG12NextBatonPrompt();
    }
  }, 1000);
}

function triggerG12NextBatonPrompt() {
  g12CurrentBatonIdx++;
  const batons = getG12Batons();
  if (g12CurrentBatonIdx >= batons.length - 1) {
    // 進入猜題階段
    const guesserName = batons[batons.length - 1] || '猜題者';
    showG12RelayOverlay(
      '🎉 接力繪製完畢！',
      `請【${guesserName}】上前觀看畫作，並向裁判或大聲猜出答案！`,
      '👀 揭開畫作全貌！',
      () => {
        hideG12RelayOverlay();
        const batonDisp = document.getElementById('g12-baton-display');
        const timerDisp = document.getElementById('g12-timer-display');
        if (batonDisp) batonDisp.textContent = `🏆 ${guesserName}！`;
        if (timerDisp) timerDisp.textContent = `請猜題！`;
      }
    );
    return;
  }

  const nextBatonName = batons[g12CurrentBatonIdx] || `第 ${g12CurrentBatonIdx + 1} 棒`;
  showG12RelayOverlay(
    `🔔 時間到！請前一棒離場！`,
    `請【${nextBatonName}】上前準備，點擊下方按鈕觀看畫作 5 秒倒數！`,
    `👀 我是【${nextBatonName}】，看畫 5 秒！`,
    () => {
      startG12ReviewCountdown(nextBatonName);
    }
  );
}

function startG12ReviewCountdown(batonName) {
  let viewSec = 5;
  const overlayTitle = document.getElementById('g12-overlay-title');
  const overlayDesc = document.getElementById('g12-overlay-desc');
  const confirmBtn = document.getElementById('g12-overlay-confirm-btn');

  if (confirmBtn) confirmBtn.style.display = 'none';
  if (overlayTitle) overlayTitle.textContent = `👀 仔細看畫倒數：${viewSec} 秒！`;
  if (overlayDesc) overlayDesc.textContent = '把握時間記住上一棒的畫作特徵與細節！';

  // 暫時半透明露出畫布
  const relayModal = document.getElementById('g12-relay-modal');
  if (relayModal) relayModal.style.background = 'rgba(10, 13, 26, 0.4)';

  g12ViewTimer = setInterval(() => {
    viewSec--;
    if (viewSec > 0) {
      if (overlayTitle) overlayTitle.textContent = `👀 仔細看畫倒數：${viewSec} 秒！`;
      if (typeof audio !== 'undefined') audio.playCountdownBeep(viewSec);
    } else {
      clearInterval(g12ViewTimer);
      g12ViewTimer = null;
      if (relayModal) relayModal.style.background = 'rgba(10, 13, 26, 0.96)';
      if (confirmBtn) confirmBtn.style.display = 'inline-block';
      hideG12RelayOverlay();

      // 開始該棒次繪圖
      g12Sec = g12BatonDuration;
      updateG12RelayUI();
      startG12BatonTimer();
    }
  }, 1000);
}

function showG12RelayOverlay(title, desc, btnText, callback) {
  const overlay = document.getElementById('g12-relay-modal');
  const titleEl = document.getElementById('g12-overlay-title');
  const descEl = document.getElementById('g12-overlay-desc');
  const btn = document.getElementById('g12-overlay-confirm-btn');
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;
  if (btn) {
    btn.textContent = btnText;
    btn.style.display = 'inline-block';
    btn.onclick = callback;
  }
  if (overlay) overlay.classList.add('show');
}

function hideG12RelayOverlay() {
  const overlay = document.getElementById('g12-relay-modal');
  if (overlay) overlay.classList.remove('show');
}

// 揭曉答案
const g12BtnReveal = document.getElementById('g12-btn-reveal');
if (g12BtnReveal) {
  g12BtnReveal.addEventListener('click', () => {
    if (!g12CurrentTopic) {
      g12CurrentTopic = (typeof getG12ActivePool === 'function' && getG12ActivePool().length > 0)
        ? getG12ActivePool()[0]
        : { title: '白雪公主', cat: '童話故事', words: '4 個字', hint: '毒蘋果、魔鏡、七個小矮人' };
    }
    if (typeof audio !== 'undefined') audio.playSuccess();
    if (typeof confettiEffect === 'function') confettiEffect();

    const revealBox = document.getElementById('g12-reveal-box');
    const titleEl = document.getElementById('g12-revealed-title');
    const descEl = document.getElementById('g12-revealed-desc');
    if (titleEl) titleEl.textContent = g12CurrentTopic.title;
    if (descEl) descEl.textContent = `分類：【${g12CurrentTopic.cat}】｜ 字數：${g12CurrentTopic.words} ｜ ${g12CurrentTopic.hint}`;
    if (revealBox) revealBox.style.display = 'block';

    // 停止一切計時
    if (g12Timer) { clearInterval(g12Timer); g12Timer = null; }
    hideG12RelayOverlay();
  });
}

const g12BtnStartBaton = document.getElementById('g12-btn-start-baton');
if (g12BtnStartBaton) g12BtnStartBaton.addEventListener('click', startG12BatonTimer);

const g12BtnNextBaton = document.getElementById('g12-btn-next-baton');
if (g12BtnNextBaton) {
  g12BtnNextBaton.addEventListener('click', () => {
    if (g12Timer) { clearInterval(g12Timer); g12Timer = null; }
    triggerG12NextBatonPrompt();
  });
}

const g12BtnNextTopic = document.getElementById('g12-btn-next-topic');
if (g12BtnNextTopic) g12BtnNextTopic.addEventListener('click', drawNextG12Topic);

const g12TeamSel = document.getElementById('g12-team-selector');
if (g12TeamSel) {
  g12TeamSel.addEventListener('change', (e) => {
    g12SelectedTeamId = e.target.value;
    resetG12Relay();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  });
}

// 模式切換 (數位畫布 / 現場主持控台)
function toggleG12PlayMode(mode) {
  g12PlayMode = mode;
  const canvasWrap = document.getElementById('g12-canvas-wrap');
  const toolsRow = document.getElementById('g12-tools-row');
  const hostConsole = document.getElementById('g12-host-console');
  const canvasBtn = document.getElementById('g12-mode-canvas-btn');
  const hostBtn = document.getElementById('g12-mode-host-btn');

  if (mode === 'host') {
    if (canvasWrap) canvasWrap.style.display = 'none';
    if (toolsRow) toolsRow.style.display = 'none';
    if (hostConsole) hostConsole.style.display = 'block';
    if (canvasBtn) canvasBtn.classList.remove('active');
    if (hostBtn) hostBtn.classList.add('active');
  } else {
    if (canvasWrap) canvasWrap.style.display = 'flex';
    if (toolsRow) toolsRow.style.display = 'flex';
    if (hostConsole) hostConsole.style.display = 'none';
    if (canvasBtn) canvasBtn.classList.add('active');
    if (hostBtn) hostBtn.classList.remove('active');
    initG12Canvas();
  }
  if (typeof audio !== 'undefined') audio.playBeat(false);
}

// ==========================================================
// HTML5 Canvas 平滑互動繪圖引擎
// ==========================================================
const G12_COLORS = [
  '#000000', '#ffffff', '#ff2a6d', '#05d9e8', '#00f59b',
  '#ffc83b', '#ff7b00', '#9d4edd', '#ff85a1', '#8b5cf6'
];

let g12Canvas = null;
let g12Ctx = null;
let g12IsDrawing = false;
let g12CurrentColor = '#000000';
let g12CurrentLineWidth = 8;
let g12IsEraser = false;
let g12UndoStack = [];

function initG12Canvas() {
  g12Canvas = document.getElementById('g12-drawing-canvas');
  if (!g12Canvas) return;
  g12Ctx = g12Canvas.getContext('2d', { willReadFrequently: true });

  // 容器寬度自適應
  const wrap = document.getElementById('g12-canvas-wrap');
  const targetWidth = wrap ? Math.min(wrap.clientWidth, 820) : 800;
  const targetHeight = Math.round(targetWidth * 0.58);

  if (g12Canvas.width !== targetWidth) {
    g12Canvas.width = targetWidth;
    g12Canvas.height = targetHeight;
    clearG12Canvas();
  }

  // 注入調色盤
  const palette = document.getElementById('g12-color-palette');
  if (palette && palette.children.length === 0) {
    G12_COLORS.forEach((color, idx) => {
      const dot = document.createElement('div');
      dot.className = `color-dot ${idx === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = color;
      dot.addEventListener('click', () => {
        g12CurrentColor = color;
        g12IsEraser = false;
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const eraserBtn = document.getElementById('g12-btn-eraser');
        if (eraserBtn) eraserBtn.classList.remove('active');
        if (typeof audio !== 'undefined') audio.playBeat(false);
      });
      palette.appendChild(dot);
    });
  }

  // 綁定繪畫事件 (支援滑鼠與觸控)
  g12Canvas.onmousedown = startG12Draw;
  g12Canvas.onmousemove = moveG12Draw;
  window.onmouseup = stopG12Draw;

  g12Canvas.ontouchstart = (e) => {
    e.preventDefault();
    startG12Draw(e.touches[0]);
  };
  g12Canvas.ontouchmove = (e) => {
    e.preventDefault();
    moveG12Draw(e.touches[0]);
  };
  window.ontouchend = stopG12Draw;
}

function saveG12UndoState() {
  if (!g12Ctx || !g12Canvas) return;
  if (g12UndoStack.length > 25) g12UndoStack.shift();
  g12UndoStack.push(g12Ctx.getImageData(0, 0, g12Canvas.width, g12Canvas.height));
}

function startG12Draw(e) {
  g12IsDrawing = true;
  saveG12UndoState();
  const rect = g12Canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (g12Canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (g12Canvas.height / rect.height);

  g12Ctx.beginPath();
  g12Ctx.moveTo(x, y);
  g12Ctx.lineCap = 'round';
  g12Ctx.lineJoin = 'round';
  g12Ctx.strokeStyle = g12IsEraser ? '#ffffff' : g12CurrentColor;
  g12Ctx.lineWidth = g12CurrentLineWidth;
}

function moveG12Draw(e) {
  if (!g12IsDrawing) return;
  const rect = g12Canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (g12Canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (g12Canvas.height / rect.height);

  g12Ctx.lineTo(x, y);
  g12Ctx.stroke();
}

function stopG12Draw() {
  if (g12IsDrawing) {
    g12IsDrawing = false;
    if (g12Ctx) g12Ctx.closePath();
  }
}

function clearG12Canvas() {
  if (!g12Canvas || !g12Ctx) return;
  saveG12UndoState();
  g12Ctx.fillStyle = '#ffffff';
  g12Ctx.fillRect(0, 0, g12Canvas.width, g12Canvas.height);
}

const g12BtnEraser = document.getElementById('g12-btn-eraser');
if (g12BtnEraser) {
  g12BtnEraser.addEventListener('click', () => {
    g12IsEraser = !g12IsEraser;
    if (g12IsEraser) {
      g12BtnEraser.classList.add('active');
      document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    } else {
      g12BtnEraser.classList.remove('active');
      const firstDot = document.querySelector('.color-dot');
      if (firstDot) firstDot.classList.add('active');
    }
    if (typeof audio !== 'undefined') audio.playBeat(false);
  });
}

document.querySelectorAll('.brush-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    g12CurrentLineWidth = parseInt(btn.dataset.size);
    if (typeof audio !== 'undefined') audio.playBeat(false);
  });
});

const g12BtnUndo = document.getElementById('g12-btn-undo');
if (g12BtnUndo) {
  g12BtnUndo.addEventListener('click', () => {
    if (g12UndoStack.length > 0) {
      const last = g12UndoStack.pop();
      g12Ctx.putImageData(last, 0, 0);
      if (typeof audio !== 'undefined') audio.playBeat(false);
    }
  });
}

const g12BtnClear = document.getElementById('g12-btn-clear');
if (g12BtnClear) {
  g12BtnClear.addEventListener('click', () => {
    clearG12Canvas();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  });
}

const g12BtnDownload = document.getElementById('g12-btn-download');
if (g12BtnDownload) {
  g12BtnDownload.addEventListener('click', () => {
    if (!g12Canvas) return;
    const link = document.createElement('a');
    link.download = `畫畫接力_${g12CurrentTopic ? g12CurrentTopic.title : '畫作'}_${Date.now()}.png`;
    link.href = g12Canvas.toDataURL('image/png');
    link.click();
    if (typeof audio !== 'undefined') audio.playSuccess();
  });
}

window.addEventListener('resize', () => {
  if (g12Canvas && g12PlayMode === 'canvas') {
    const wrap = document.getElementById('g12-canvas-wrap');
    if (wrap && Math.abs(wrap.clientWidth - g12Canvas.width) > 50) {
      const imgData = g12Ctx.getImageData(0, 0, g12Canvas.width, g12Canvas.height);
      const targetWidth = Math.min(wrap.clientWidth, 820);
      const targetHeight = Math.round(targetWidth * 0.58);
      g12Canvas.width = targetWidth;
      g12Canvas.height = targetHeight;
      g12Ctx.putImageData(imgData, 0, 0);
    }
  }
});

window.drawNextG12Topic = drawNextG12Topic;
window.resetG12Relay = resetG12Relay;
window.startG12BatonTimer = startG12BatonTimer;
window.toggleG12PlayMode = toggleG12PlayMode;
window.initG12Canvas = initG12Canvas;
window.clearG12Canvas = clearG12Canvas;
