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

function generateG1SmartHintHTML(c1, c2, topicStr) {
  const cleanTopic = (topicStr || '').replace('🎯 挑戰主題：', '').trim();
  const topicData = (typeof G1_TOPIC_ANGLES !== 'undefined' && G1_TOPIC_ANGLES[cleanTopic])
    ? G1_TOPIC_ANGLES[cleanTopic]
    : { angle: '可從生活實體名詞、特定動作、特色物品切入聯想', keywords: [] };

  const comboDict = (typeof G1_COMBO_WORDS !== 'undefined') ? G1_COMBO_WORDS : (typeof G1_HINTS !== 'undefined' ? G1_HINTS : {});
  const directKey = `${c1}+${c2}`;
  const reverseKey = `${c2}+${c1}`;
  const directWords = comboDict[directKey] || [];
  const reverseWords = comboDict[reverseKey] || [];

  const singleDict = (typeof G1_SINGLE_VOCAB !== 'undefined') ? G1_SINGLE_VOCAB : {};
  const c1Vocab = singleDict[c1] || ['物品', '名詞'];
  const c2Vocab = singleDict[c2] || ['東西', '動作'];

  const c1Picks = c1Vocab.slice(0, 3);
  const c2Picks = c2Vocab.slice(0, 3);

  let sampleSentence = '';
  if (directWords.length > 0) {
    sampleSentence = `例如迅速搶答：「${directWords[0]}」即可成功奪分！`;
  } else if (reverseWords.length > 0) {
    sampleSentence = `例如顛倒詞搶答：「${reverseWords[0]}」，既爆笑又符合規則！`;
  } else {
    sampleSentence = `例如創意組合：「${c1Picks[0]}」搭配「${c2Picks[0]}」，靈活應變奪分！`;
  }

  return `
    <div style="text-align:left; line-height:1.6;">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:8px; margin-bottom:10px;">
        <span style="font-weight:900; color:var(--gold); font-size:1.05rem;">💡【注音雙卡造詞靈感錦囊】(兩段式)</span>
        <span style="font-size:0.82rem; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.2); padding:2px 10px; border-radius:12px; color:var(--neon-green); font-weight:800;">${cleanTopic}</span>
      </div>

      <!-- 第一段：思維方向提示 (預設展示・不劇透具體答案) -->
      <div style="margin-bottom:10px; background:rgba(255,255,255,0.06); padding:8px 12px; border-radius:8px; border-left:3px solid var(--neon-green); font-size:0.88rem;">
        <span style="font-weight:800; color:var(--neon-green);">🧠 主題思路引導：</span>
        <span style="color:#e2e8f0;">${topicData.angle}</span>
      </div>

      <div style="font-size:0.86rem; color:#cbd5e1; margin-bottom:8px; background:rgba(255,255,255,0.04); padding:8px 12px; border-radius:8px; border-left:3px solid var(--gold);">
        <div style="font-weight:800; color:var(--gold); margin-bottom:4px;">💡 造詞思路引導（兩段式・先動腦後看答案）：</div>
        <div style="line-height:1.5;">
          • 首字【<b style="color:#fff;">${c1}</b>】：可朝主題中常見的「實體事物、主要動作、或特定稱呼」方向構思。<br>
          • 次字【<b style="color:#fff;">${c2}</b>】：嘗試搭配「受詞名詞、形容特徵、或情境產物」相互銜接。<br>
          • 🔄 綜藝逆向思考：若正向一時卡住，可嘗試將順序對調為【<b style="color:var(--orange);">${c2} ＋ ${c1}</b>】顛倒搶答！
        </div>
      </div>

      <!-- 解鎖第二段按鈕 -->
      <div id="g1-reveal-btn-wrap" style="text-align:center; margin:12px 0 4px 0;">
        <button class="nav-btn" id="g1-btn-reveal-words" onclick="revealG1WordAnswers()" style="background:rgba(157,78,221,0.25); border-color:var(--purple); color:#fff; font-size:0.82rem; padding:5px 18px; font-weight:800; border-radius:20px;">
          🔍 全場想不到？點此揭曉具體參考字詞 ➔
        </button>
      </div>

      <!-- 第二段：具體字詞解答清單 (預設隱藏，點擊後展開) -->
      <div id="g1-hint-words-reveal" style="display:none; margin-top:10px; padding-top:10px; border-top:1px dashed rgba(255,255,255,0.15);">
        ${directWords.length > 0 ? `
        <div style="margin-bottom:8px; font-size:0.9rem;">
          <span style="font-weight:800; color:var(--blue-team);">🔤 正向雙字詞 (${c1} ＋ ${c2})：</span>
          <span style="color:#fff; font-weight:800; background:rgba(5,217,232,0.18); border:1px solid rgba(5,217,232,0.4); padding:2px 10px; border-radius:6px;">${directWords.join('、')}</span>
        </div>` : ''}

        ${reverseWords.length > 0 ? `
        <div style="margin-bottom:8px; font-size:0.9rem;">
          <span style="font-weight:800; color:var(--orange);">🔄 反向顛倒詞 (${c2} ＋ ${c1})：</span>
          <span style="color:#fff; font-weight:800; background:rgba(255,123,0,0.18); border:1px solid rgba(255,123,0,0.4); padding:2px 10px; border-radius:6px;">${reverseWords.join('、')}</span>
          <span style="font-size:0.75rem; color:#94a3b8; margin-left:4px;">(派對可開放倒過來搶答)</span>
        </div>` : ''}

        <div style="margin-top:8px; padding-top:6px; font-size:0.86rem; color:#cbd5e1;">
          <div style="margin-bottom:4px;">
            <span style="font-weight:800; color:#ff85a1;">🧩 拆字組合思路：</span>
            <span>【${c1}開頭詞】：<b style="color:#fff;">${c1Picks.join('/')}</b> ＋ 【${c2}開頭詞】：<b style="color:#fff;">${c2Picks.join('/')}</b></span>
          </div>
          <div style="color:var(--gold); font-weight:700; margin-top:4px;">
            💬 造句/情境示範：${sampleSentence}
          </div>
        </div>
      </div>

    </div>
  `;
}
window.generateG1SmartHintHTML = generateG1SmartHintHTML;

function revealG1WordAnswers() {
  console.info('[Action Triggered]: revealG1WordAnswers');
  const section = document.getElementById('g1-hint-words-reveal');
  const btnWrap = document.getElementById('g1-reveal-btn-wrap');
  if (section) section.style.display = 'block';
  if (btnWrap) btnWrap.style.display = 'none';
  if (typeof audio !== 'undefined') audio.playBeat(true);
}
window.revealG1WordAnswers = revealG1WordAnswers;

function toggleG1Hint() {
  console.info('[Action Triggered]: toggleG1Hint');
  const c1 = document.getElementById('g1-c1')?.textContent?.trim() || 'ㄅ';
  const c2 = document.getElementById('g1-c2')?.textContent?.trim() || 'ㄆ';
  const topicEl = document.getElementById('g1-topic');
  const topic = topicEl ? topicEl.textContent : '【美食與飲料】';
  const box = document.getElementById('g1-hint-box');
  if (box) {
    if (box.style.display === 'block') {
      box.style.display = 'none';
    } else {
      box.innerHTML = generateG1SmartHintHTML(c1, c2, topic);
      box.style.display = 'block';
      if (typeof audio !== 'undefined') audio.playBeat(false);
    }
  }
}
window.toggleG1Hint = toggleG1Hint;
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
  console.info('[Action Triggered]: drawNextG11Card');
  const pool = (typeof G11_ZHUYIN_POOL !== 'undefined') ? G11_ZHUYIN_POOL : [];
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
      if (charSub) charSub.textContent = '首音注音符號 (現場搜查)';
      cardBox.classList.add('flipped');
      if (typeof audio !== 'undefined') audio.playBeat(true);
    }, 280);
  }

  // 更新文字看板與計數
  const deckCounter = document.getElementById('g11-deck-counter');
  if (deckCounter) {
    deckCounter.textContent = `🎯 題庫進度：第 ${g11DrawnCount} / ${pool.length} 題 (無重複，剩餘 ${g11Deck.length} 題)`;
  }
  const missionText = document.getElementById('g11-mission-text');
  if (missionText) {
    missionText.innerHTML = `請在現場限時找到【<span style="color:var(--gold); font-size:1.7rem;">${g11CurrentItem.char}</span>】開頭的真實物品！`;
  }
  const hintContainer = document.getElementById('g11-hints-container');
  if (hintContainer) hintContainer.style.display = 'none';

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
  console.info('[Action Triggered]: setG11TimerPreset', { seconds });
  g11InitialSec = seconds;
  resetG11Timer();
  // 更新 30/60/90/120 按鈕 active 狀態
  document.querySelectorAll('#view-game-11 .g11-preset-btn, #view-game-11 .nav-btn').forEach(btn => {
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
  console.info('[Action Triggered]: resetG11Timer', { initialSec: g11InitialSec });
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
    // 暫停倒數計時
    clearInterval(g11Timer);
    g11Timer = null;
    console.info('[Action Triggered]: toggleG11Timer', { state: 'paused', remaining: g11Sec });
    if (btn) btn.textContent = '▶️ 繼續倒數';
    if (typeof audio !== 'undefined') audio.playBeat(false);
    return;
  }

  if (g11Sec <= 0) {
    g11Sec = g11InitialSec;
  }

  console.info('[Action Triggered]: toggleG11Timer', { state: 'running', remaining: g11Sec });
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
      console.info('[Action Triggered]: g11TimerFinished');
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

// 搜查提示 (兩段式：Stage 1 區域線索與方向，Stage 2 點擊才揭開具體物品解答)
function toggleG11Hint() {
  if (!g11CurrentItem) {
    g11CurrentItem = (typeof G11_ZHUYIN_POOL !== 'undefined' && G11_ZHUYIN_POOL.length > 0) 
      ? (G11_ZHUYIN_POOL.find(i => i.char === 'ㄑ') || G11_ZHUYIN_POOL[0])
      : { char: 'ㄑ', example: '球', hints: ['球', '鉛筆', '錢包', '汽水', '青椒'] };
  }
  const container = document.getElementById('g11-hints-container');
  const title = document.getElementById('g11-hints-title');
  const clueBox = document.getElementById('g11-clue-direction-box');
  const revealBtnWrap = document.getElementById('g11-reveal-btn-wrap');
  const itemsSection = document.getElementById('g11-items-reveal-section');
  const list = document.getElementById('g11-chips-list');
  if (!container) return;

  if (container.style.display === 'block') {
    container.style.display = 'none';
    console.info('[Action Triggered]: toggleG11Hint', { state: 'closed' });
    return;
  }

  console.info('[Action Triggered]: toggleG11Hint', { state: 'opened', char: g11CurrentItem.char });
  
  if (title) {
    title.textContent = `💡【${g11CurrentItem.char}】現場搜查方向線索 (兩段式・不劇透物品)：`;
  }

  // 第一階段：僅提供搜查區域與思考方向，絕不劇透具體物品
  const clueData = (typeof G11_AREA_CLUES !== 'undefined' && G11_AREA_CLUES[g11CurrentItem.char])
    ? G11_AREA_CLUES[g11CurrentItem.char]
    : { area: '隨身包包、辦公桌面、身上穿戴配飾', direction: '觀察身邊常用日用品、文具或隨身物件，先自己動腦尋找！' };

  if (clueBox) {
    if (typeof clueData === 'object' && clueData.area) {
      clueBox.innerHTML = `
        <div style="margin-bottom:8px;">
          <strong style="color:var(--neon-green); font-size:0.92rem;">📍 推薦搜查區域：</strong>
          <span style="color:#f1f5f9;">${clueData.area}</span>
        </div>
        <div>
          <strong style="color:var(--gold); font-size:0.92rem;">🔍 線索思考方向：</strong>
          <span style="color:#cbd5e1;">${clueData.direction}</span>
        </div>
      `;
    } else {
      clueBox.textContent = clueData;
    }
  }

  // 重置第二階段狀態：預設隱藏物品清單，顯示解鎖按鈕
  if (itemsSection) itemsSection.style.display = 'none';
  if (revealBtnWrap) revealBtnWrap.style.display = 'block';

  // 預載物品 chips (供第二階段解鎖時展示)
  if (list) {
    list.innerHTML = '';
    (g11CurrentItem.hints || []).forEach(hint => {
      const chip = document.createElement('span');
      chip.className = 'g11-chip';
      chip.textContent = hint;
      list.appendChild(chip);
    });
  }

  container.style.display = 'block';
  if (typeof audio !== 'undefined') audio.playBeat(false);
}

function revealG11ItemList() {
  console.info('[Action Triggered]: revealG11ItemList', { char: g11CurrentItem ? g11CurrentItem.char : null });
  const itemsSection = document.getElementById('g11-items-reveal-section');
  const revealBtnWrap = document.getElementById('g11-reveal-btn-wrap');
  if (itemsSection) itemsSection.style.display = 'block';
  if (revealBtnWrap) revealBtnWrap.style.display = 'none';
  if (typeof audio !== 'undefined') audio.playBeat(true);
}

function verifyG11Pass() {
  console.info('[Action Triggered]: verifyG11Pass');
  if (typeof audio !== 'undefined') audio.playSuccess();
  if (typeof confettiEffect === 'function') confettiEffect();
  const modBox = document.getElementById('g11-modifier-box');
  if (modBox) {
    modBox.innerHTML = `<span>🎉 恭喜驗收合格！裁判請於下方計分板為獲勝隊伍/玩家加分！</span>`;
  }
}

function verifyG11Fail() {
  console.info('[Action Triggered]: verifyG11Fail');
  if (typeof audio !== 'undefined') audio.playBuzzer(280);
  const modBox = document.getElementById('g11-modifier-box');
  if (modBox) {
    modBox.innerHTML = `<span>❌ 判定不符或物品錯誤！開放其他隊伍/玩家繼續爭取！</span>`;
  }
}

window.shuffleG11Deck = shuffleG11Deck;
window.drawNextG11Card = drawNextG11Card;
window.setG11TimerPreset = setG11TimerPreset;
window.resetG11Timer = resetG11Timer;
window.toggleG11Timer = toggleG11Timer;
window.toggleG11Hint = toggleG11Hint;
window.revealG11ItemList = revealG11ItemList;
window.verifyG11Pass = verifyG11Pass;
window.verifyG11Fail = verifyG11Fail;

// ==========================================================
// 遊戲 12: 🎨 第二關：靈魂畫手大考驗 (接力傳畫 ✕ 經典猜畫雙模式・278+題)
// ==========================================================
let g12SubMode = 'relay'; // 'relay' (傳畫接力) or 'solo' (單人作畫猜題)
let g12Category = 'all'; // 'all', 'daily', 'idiom', 'fairy', 'movie'
let g12Deck = [];
let g12DrawnCount = 0;
let g12CurrentTopic = null;
let g12SelectedTeamId = null;

// 接力棒次與計時狀態
let g12CurrentBatonIdx = 0;
let g12Timer = null;
let g12Sec = 30;
let g12BatonDuration = 30;
let g12ViewTimer = null;
let g12PlayMode = 'canvas'; // 'canvas' or 'host'

// 單人作畫模式計時狀態
let g12SoloTimer = null;
let g12SoloInitialSec = 30;
let g12SoloSec = 30;

// 本回合接力畫作快照清單 [{ batonIndex, batonName, imgUrl, time }]
let g12CurrentRelaySnapshots = [];

// 歷史畫作相簿存儲 (讀取 localStorage)
const G12_ARCHIVE_KEY = 'PARTY_HUB_G12_ARCHIVE';
let g12Archive = [];
try {
  const saved = localStorage.getItem(G12_ARCHIVE_KEY);
  if (saved) g12Archive = JSON.parse(saved);
} catch (e) {
  g12Archive = [];
}

function updateG12ArchiveCountBadge() {
  const badge = document.getElementById('g12-archive-count-badge');
  if (badge) badge.textContent = g12Archive.length;
}

// 獲取當前作畫隊伍的棒次名稱清單
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

// 依據選擇的系列獲取題目池
function getG12ActivePool() {
  if (g12Category === 'daily') return (typeof G12_DAILY_LIFE_POOL !== 'undefined' ? G12_DAILY_LIFE_POOL : []);
  if (g12Category === 'idiom') return (typeof G12_IDIOMS_POOL !== 'undefined' ? G12_IDIOMS_POOL : []);
  if (g12Category === 'fairy') return (typeof G12_FAIRY_TALES_POOL !== 'undefined' ? G12_FAIRY_TALES_POOL : []);
  if (g12Category === 'movie') return (typeof G12_MOVIES_POOL !== 'undefined' ? G12_MOVIES_POOL : []);
  return (typeof G12_ALL_POOL !== 'undefined' ? G12_ALL_POOL : []);
}

function shuffleG12Deck() {
  const pool = getG12ActivePool();
  g12Deck = [...pool].sort(() => Math.random() - 0.5);
  g12DrawnCount = 0;
  console.info('[Action Triggered]: shuffleG12Deck', { category: g12Category, total: pool.length });
}

// 切換題目系列分類
function filterG12(cat, btn) {
  console.info('[Action Triggered]: filterG12', { category: cat });
  g12Category = cat;
  document.querySelectorAll('.g12-filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  shuffleG12Deck();
  drawNextG12Topic();
}
window.filterG12 = filterG12;

// 抽下一題 (不可重複)
function drawNextG12Topic() {
  const pool = getG12ActivePool();
  if (g12Deck.length === 0) {
    shuffleG12Deck();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  }
  g12DrawnCount++;
  g12CurrentTopic = g12Deck.pop();
  console.info('[Action Triggered]: drawNextG12Topic', { topic: g12CurrentTopic.title, cat: g12CurrentTopic.cat });

  if (typeof audio !== 'undefined') audio.playBeat(false);

  // 更新計數器與類別標籤
  const catNames = {
    all: '全部混合大亂鬥 (284+ 題)',
    daily: '趣味生活日常 (精準詞彙)',
    idiom: '經典成語俗語 (四字成語)',
    fairy: '經典童話故事 (高難度)',
    movie: '中外熱門電影 (高難度)'
  };
  const catBadge = document.getElementById('g12-current-cat-badge');
  const counterEl = document.getElementById('g12-deck-counter');
  if (catBadge) catBadge.textContent = `🏷️ 題庫類別：【${catNames[g12Category] || '自訂題庫'}】`;
  if (counterEl) counterEl.textContent = `🎯 題庫進度：第 ${g12DrawnCount} / ${pool.length} 題 (無重複，剩餘 ${g12Deck.length} 題)`;

  // 暗題卡片重設為隱藏狀態
  const secretPrompt = document.getElementById('g12-secret-prompt');
  const secretContent = document.getElementById('g12-secret-content');
  if (secretPrompt) {
    secretPrompt.style.display = 'block';
    secretPrompt.textContent = g12SubMode === 'relay' 
      ? '🔒 點擊此處【揭開秘密題目】（僅第 1 棒看題，其他隊員請背對螢幕）'
      : '🔒 點擊此處【揭開秘密題目】（僅作畫者觀看，猜題者請閉眼或背對螢幕）';
  }
  if (secretContent) secretContent.style.display = 'none';

  // 填入秘密題目內容
  const topicTag = document.getElementById('g12-topic-tag');
  const wordsCount = document.getElementById('g12-words-count');
  const secretTitle = document.getElementById('g12-secret-title');
  const secretHint = document.getElementById('g12-secret-hint');

  if (topicTag) {
    let tagColor = 'var(--neon-green)';
    let tagText = '🟢 趣味生活';
    if (g12CurrentTopic.cat === '經典成語') {
      tagColor = 'var(--gold)';
      tagText = '🟡 經典成語';
    } else if (g12CurrentTopic.cat === '童話故事') {
      tagColor = '#ff3366';
      tagText = '🔴 經典童話';
    } else if (g12CurrentTopic.cat === '經典電影') {
      tagColor = '#9d4edd';
      tagText = '🟣 熱門電影';
    }
    topicTag.textContent = tagText;
    topicTag.style.borderColor = tagColor;
    topicTag.style.color = tagColor;
    topicTag.style.background = 'rgba(255,255,255,0.06)';
  }

  if (wordsCount) wordsCount.textContent = g12CurrentTopic.words;
  if (secretTitle) secretTitle.textContent = g12CurrentTopic.title;
  if (secretHint) secretHint.textContent = `💡 靈感特徵提示：${g12CurrentTopic.hint}`;

  // 隱藏揭曉答案框
  const revealBox = document.getElementById('g12-reveal-box');
  if (revealBox) revealBox.style.display = 'none';

  // 重置畫布、本局接力歷程與計時器
  g12CurrentRelaySnapshots = [];
  renderG12EvolutionStrip();
  resetG12Relay();
  resetG12SoloTimer();
  clearG12Canvas();
}
window.drawNextG12Topic = drawNextG12Topic;

// 切換接力模式 vs 單人猜畫模式
function setG12SubMode(mode) {
  console.info('[Action Triggered]: setG12SubMode', { mode });
  g12SubMode = mode;

  const tabRelay = document.getElementById('g12-tab-relay');
  const tabSolo = document.getElementById('g12-tab-solo');
  const relayBar = document.getElementById('g12-relay-status-bar');
  const relayTeamToolbar = document.getElementById('g12-relay-team-toolbar');
  const resetRelayBtn = document.getElementById('g12-btn-reset-relay');
  const soloBar = document.getElementById('g12-solo-status-bar');
  const secretPrompt = document.getElementById('g12-secret-prompt');

  if (mode === 'relay') {
    if (tabRelay) tabRelay.classList.add('active');
    if (tabSolo) tabSolo.classList.remove('active');
    if (relayBar) relayBar.style.display = 'flex';
    if (relayTeamToolbar) relayTeamToolbar.style.display = 'flex';
    if (resetRelayBtn) resetRelayBtn.style.display = 'inline-block';
    if (soloBar) soloBar.classList.remove('show');
    if (secretPrompt) secretPrompt.textContent = '🔒 點擊此處【揭開秘密題目】（僅第 1 棒看題，其他隊員請背對螢幕）';
    resetG12Relay();
    renderG12EvolutionStrip();
  } else {
    if (tabRelay) tabRelay.classList.remove('active');
    if (tabSolo) tabSolo.classList.add('active');
    if (relayBar) relayBar.style.display = 'none';
    if (relayTeamToolbar) relayTeamToolbar.style.display = 'none';
    if (resetRelayBtn) resetRelayBtn.style.display = 'none';
    if (soloBar) soloBar.classList.add('show');
    const evoBox = document.getElementById('g12-evolution-box');
    if (evoBox) evoBox.style.display = 'none';
    if (secretPrompt) secretPrompt.textContent = '🔒 點擊此處【揭開秘密題目】（僅作畫者觀看，猜題者請閉眼或背對螢幕）';
    resetG12SoloTimer();
    hideG12RelayOverlay();
  }
  if (typeof audio !== 'undefined') audio.playBeat(false);
}
window.setG12SubMode = setG12SubMode;

// 重新隱藏題目 (作畫防偷看)
function rehideG12() {
  console.info('[Action Triggered]: rehideG12');
  const prompt = document.getElementById('g12-secret-prompt');
  const content = document.getElementById('g12-secret-content');
  if (content) content.style.display = 'none';
  if (prompt) prompt.style.display = 'block';
  if (typeof audio !== 'undefined') audio.playBeat(false);
}
window.rehideG12 = rehideG12;

// 點擊暗題卡揭開/隱藏
const secretCardBox = document.getElementById('g12-secret-card-box');
if (secretCardBox) {
  secretCardBox.addEventListener('click', (e) => {
    if (e.target.id === 'g12-btn-rehide') return;
    const prompt = document.getElementById('g12-secret-prompt');
    const content = document.getElementById('g12-secret-content');
    if (prompt && prompt.style.display !== 'none') {
      prompt.style.display = 'none';
      if (content) content.style.display = 'block';
      if (typeof audio !== 'undefined') audio.playBeat(true);
    }
  });
}

// ==========================================================
// 接力模式 (Relay Mode) 邏輯與畫作快照紀錄
// ==========================================================
function resetG12Relay() {
  console.info('[Action Triggered]: resetG12Relay');
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
window.resetG12Relay = resetG12Relay;

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

// 捕獲當前畫布快照
function captureG12BatonSnapshot(batonName) {
  if (!g12Canvas) return null;
  try {
    const dataUrl = g12Canvas.toDataURL('image/png');
    const snapshot = {
      batonIndex: g12CurrentBatonIdx + 1,
      batonName: batonName || `第 ${g12CurrentBatonIdx + 1} 棒`,
      imgUrl: dataUrl,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    g12CurrentRelaySnapshots.push(snapshot);
    console.info('[Action Triggered]: captureG12BatonSnapshot', { batonName: snapshot.batonName });
    renderG12EvolutionStrip();
    return snapshot;
  } catch (e) {
    console.error('Failed to capture snapshot:', e);
    return null;
  }
}

// 渲染當前局各棒接力畫作走勢演變橫條
function renderG12EvolutionStrip() {
  const box = document.getElementById('g12-evolution-box');
  const list = document.getElementById('g12-evolution-steps-list');
  if (!box || !list) return;

  if (g12SubMode !== 'relay' || g12CurrentRelaySnapshots.length === 0) {
    box.style.display = 'none';
    list.innerHTML = '';
    return;
  }

  box.style.display = 'flex';
  list.innerHTML = '';

  g12CurrentRelaySnapshots.forEach((snap, idx) => {
    if (idx > 0) {
      const arrow = document.createElement('div');
      arrow.className = 'g12-evolution-arrow';
      arrow.textContent = '➔';
      list.appendChild(arrow);
    }

    const card = document.createElement('div');
    card.className = 'g12-evolution-card';
    card.title = '點擊放大檢視這張畫作';
    card.innerHTML = `
      <img src="${snap.imgUrl}" alt="${snap.batonName}">
      <div class="g12-evolution-card-meta">
        <span class="g12-evolution-baton-title">${snap.batonName}</span>
        <span class="g12-evolution-baton-author">⏰ ${snap.time}</span>
      </div>
    `;
    card.onclick = () => {
      openG12Lightbox(snap.imgUrl, snap.batonName, g12CurrentTopic ? `題目：${g12CurrentTopic.title}` : '');
    };
    list.appendChild(card);
  });
}

function startG12BatonTimer() {
  console.info('[Action Triggered]: startG12BatonTimer');
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
window.startG12BatonTimer = startG12BatonTimer;

function nextG12Baton() {
  console.info('[Action Triggered]: nextG12Baton');
  if (g12Timer) {
    clearInterval(g12Timer);
    g12Timer = null;
  }
  triggerG12NextBatonPrompt();
}
window.nextG12Baton = nextG12Baton;

// 觸發換棒提示
function triggerG12NextBatonPrompt() {
  const batons = getG12Batons();
  const finishedBatonName = batons[g12CurrentBatonIdx] || `第 ${g12CurrentBatonIdx + 1} 棒`;
  
  // 📸 自動捕捉當前棒次的畫作快照
  captureG12BatonSnapshot(finishedBatonName);

  g12CurrentBatonIdx++;
  if (g12CurrentBatonIdx >= batons.length - 1) {
    // 進入最後猜題階段
    const guesserName = batons[batons.length - 1] || '最後猜題棒';
    showG12RelayOverlay(
      '🎉 接力作畫完畢！',
      `請【${guesserName}】上前觀看畫作，向主持人或大螢幕大聲猜出答案！`,
      '👀 揭開畫作全貌猜題！',
      () => {
        hideG12RelayOverlay();
        const batonDisp = document.getElementById('g12-baton-display');
        const timerDisp = document.getElementById('g12-timer-display');
        if (batonDisp) batonDisp.textContent = `🏆 ${guesserName}！`;
        if (timerDisp) timerDisp.textContent = '請猜題！';
      }
    );
    return;
  }

  const nextBatonName = batons[g12CurrentBatonIdx] || `第 ${g12CurrentBatonIdx + 1} 棒`;
  showG12RelayOverlay(
    '🔔 時間到！請前一棒離場！',
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

      // 開始新棒次繪圖
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

function confirmNextG12Baton() {
  console.info('[Action Triggered]: confirmNextG12Baton');
  // 由 showG12RelayOverlay 動態綁定回呼
}
window.confirmNextG12Baton = confirmNextG12Baton;

// ==========================================================
// 單人作畫猜題模式 (Solo Drawer Mode) 計時器狀態機
// ==========================================================
function setG12SoloPreset(sec) {
  console.info('[Action Triggered]: setG12SoloPreset', { seconds: sec });
  g12SoloInitialSec = sec;
  resetG12SoloTimer();

  document.querySelectorAll('.g12-solo-pbtn').forEach(b => {
    if (b.id === `g12-solo-p${sec}`) b.classList.add('active');
    else b.classList.remove('active');
  });
  if (typeof audio !== 'undefined') audio.playBeat(false);
}
window.setG12SoloPreset = setG12SoloPreset;

function resetG12SoloTimer() {
  console.info('[Action Triggered]: resetG12SoloTimer');
  if (g12SoloTimer) {
    clearInterval(g12SoloTimer);
    g12SoloTimer = null;
  }
  g12SoloSec = g12SoloInitialSec;
  const disp = document.getElementById('g12-solo-timer-display');
  const btn = document.getElementById('g12-solo-btn-timer');
  if (disp) {
    disp.textContent = g12SoloInitialSec === 0 ? '⏱️ 不限時自由畫' : `⏱️ ${g12SoloSec} 秒`;
    disp.style.color = '#ff3366';
  }
  if (btn) btn.textContent = '▶️ 開始計時';
}
window.resetG12SoloTimer = resetG12SoloTimer;

function toggleG12SoloTimer() {
  const btn = document.getElementById('g12-solo-btn-timer');
  const disp = document.getElementById('g12-solo-timer-display');

  if (g12SoloTimer) {
    clearInterval(g12SoloTimer);
    g12SoloTimer = null;
    console.info('[Action Triggered]: toggleG12SoloTimer', { state: 'paused', remaining: g12SoloSec });
    if (btn) btn.textContent = '▶️ 繼續計時';
    if (typeof audio !== 'undefined') audio.playBeat(false);
    return;
  }

  if (g12SoloInitialSec === 0) {
    // 不限時模式正計時
    if (btn) btn.textContent = '⏸️ 暫停計時';
    if (typeof audio !== 'undefined') audio.playBeat(true);
    let elapsed = 0;
    g12SoloTimer = setInterval(() => {
      elapsed++;
      if (disp) disp.textContent = `⏱️ 已作畫 ${elapsed} 秒`;
    }, 1000);
    return;
  }

  if (g12SoloSec <= 0) {
    g12SoloSec = g12SoloInitialSec;
  }

  console.info('[Action Triggered]: toggleG12SoloTimer', { state: 'running', remaining: g12SoloSec });
  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (btn) btn.textContent = '⏸️ 暫停計時';

  g12SoloTimer = setInterval(() => {
    if (g12SoloSec > 0) {
      g12SoloSec--;
      if (disp) {
        disp.textContent = `⏱️ ${g12SoloSec} 秒`;
        disp.style.color = (g12SoloSec <= 5) ? '#ff0033' : '#ff3366';
      }
      if (g12SoloSec <= 5 && g12SoloSec > 0) {
        if (typeof audio !== 'undefined') audio.playCountdownBeep(g12SoloSec);
      } else {
        if (typeof audio !== 'undefined') audio.playBeat(false);
      }
    } else {
      clearInterval(g12SoloTimer);
      g12SoloTimer = null;
      console.info('[Action Triggered]: g12SoloTimerFinished');
      if (typeof audio !== 'undefined') audio.playExplosion();
      if (disp) disp.textContent = '⏰ 時間到！請作畫者停筆，全場猜題！';
      if (btn) btn.textContent = '🔄 重新計時';
    }
  }, 1000);
}
window.toggleG12SoloTimer = toggleG12SoloTimer;

// ==========================================================
// 揭曉答案與歷史畫作歸檔
// ==========================================================
function revealG12Answer() {
  console.info('[Action Triggered]: revealG12Answer');
  if (!g12CurrentTopic) {
    const activePool = getG12ActivePool();
    g12CurrentTopic = (activePool && activePool.length > 0) ? activePool[0] : { title: '拔罐', cat: '趣味生活', words: '2 個字', hint: '背上一排排圓形玻璃罐與紫紅色的圓形印記' };
  }

  // 停止所有計時
  if (g12Timer) { clearInterval(g12Timer); g12Timer = null; }
  if (g12SoloTimer) { clearInterval(g12SoloTimer); g12SoloTimer = null; }
  hideG12RelayOverlay();

  // 擷取最後一幅畫作快照
  if (g12Canvas) {
    const finalDataUrl = g12Canvas.toDataURL('image/png');
    if (g12SubMode === 'relay') {
      const batons = getG12Batons();
      const currentBatonName = batons[g12CurrentBatonIdx] || '最終畫作';
      // 如果最後一棒還沒加入 snapshots，補抓
      if (!g12CurrentRelaySnapshots.some(s => s.batonName === currentBatonName)) {
        g12CurrentRelaySnapshots.push({
          batonIndex: g12CurrentBatonIdx + 1,
          batonName: currentBatonName,
          imgUrl: finalDataUrl,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } else {
      // 單人模式
      g12CurrentRelaySnapshots = [{
        batonIndex: 1,
        batonName: '作畫者成品',
        imgUrl: finalDataUrl,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }];
    }
  }

  // 存檔至歷史相簿
  const roundRecord = {
    id: 'round_' + Date.now(),
    date: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    mode: g12SubMode,
    modeTitle: g12SubMode === 'relay' ? '🤝 隊伍傳畫接力' : '🎨 單人作畫猜題',
    topic: g12CurrentTopic.title,
    cat: g12CurrentTopic.cat,
    words: g12CurrentTopic.words,
    hint: g12CurrentTopic.hint,
    snapshots: [...g12CurrentRelaySnapshots]
  };

  g12Archive.unshift(roundRecord);
  if (g12Archive.length > 40) g12Archive.pop();
  try {
    localStorage.setItem(G12_ARCHIVE_KEY, JSON.stringify(g12Archive));
  } catch (e) {
    console.warn('localStorage quota exceeded');
  }
  updateG12ArchiveCountBadge();

  // 音效與拉炮
  if (typeof audio !== 'undefined') audio.playSuccess();
  if (typeof confettiEffect === 'function') confettiEffect();

  // 展開答案面板
  const revealBox = document.getElementById('g12-reveal-box');
  const titleEl = document.getElementById('g12-revealed-title');
  const descEl = document.getElementById('g12-revealed-desc');
  const evoWrap = document.getElementById('g12-reveal-evolution-wrap');

  if (titleEl) titleEl.textContent = g12CurrentTopic.title;
  if (descEl) descEl.textContent = `難度系列：【${g12CurrentTopic.cat}】｜ 字數：${g12CurrentTopic.words} ｜ ${g12CurrentTopic.hint}`;

  if (evoWrap) {
    if (g12SubMode === 'relay' && g12CurrentRelaySnapshots.length > 0) {
      evoWrap.innerHTML = `
        <div style="font-size:1.05rem; font-weight:800; color:var(--gold); margin-bottom:10px;">
          🎨 本局接力畫作演變大公開 (點擊可看大圖)：
        </div>
        <div class="g12-evolution-steps" style="justify-content:center;">
          ${g12CurrentRelaySnapshots.map((s, idx) => `
            ${idx > 0 ? '<div class="g12-evolution-arrow">➔</div>' : ''}
            <div class="g12-evolution-card" onclick="openG12Lightbox('${s.imgUrl}', '${s.batonName}', '正確答案：${g12CurrentTopic.title}')">
              <img src="${s.imgUrl}" alt="${s.batonName}">
              <div class="g12-evolution-card-meta">
                <span class="g12-evolution-baton-title">${s.batonName}</span>
                <span class="g12-evolution-baton-author">⏰ ${s.time}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (g12CurrentRelaySnapshots.length > 0) {
      const snap = g12CurrentRelaySnapshots[0];
      evoWrap.innerHTML = `
        <div style="font-size:1.05rem; font-weight:800; color:var(--gold); margin-bottom:10px;">
          🎨 本局作畫成品 (點擊可看大圖)：
        </div>
        <div style="display:flex; justify-content:center;">
          <div class="g12-evolution-card" style="flex:0 0 240px;" onclick="openG12Lightbox('${snap.imgUrl}', '單人作畫成品', '正確答案：${g12CurrentTopic.title}')">
            <img src="${snap.imgUrl}" alt="成品" style="height:140px;">
            <div class="g12-evolution-card-meta">
              <span class="g12-evolution-baton-title">畫家成品畫作</span>
              <span class="g12-evolution-baton-author">⏰ ${snap.time}</span>
            </div>
          </div>
        </div>
      `;
    }
  }

  if (revealBox) revealBox.style.display = 'block';
  renderG12EvolutionStrip();
}
window.revealG12Answer = revealG12Answer;

// ==========================================================
// 歷史畫作相簿 (History Archive Modal)
// ==========================================================
function openG12GalleryModal() {
  console.info('[Action Triggered]: openG12GalleryModal');
  const modal = document.getElementById('g12-gallery-modal');
  const list = document.getElementById('g12-gallery-list');
  if (!modal || !list) return;

  if (g12Archive.length === 0) {
    list.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:#94a3b8;">
        <div style="font-size:3rem; margin-bottom:12px;">🖼️</div>
        <div style="font-size:1.1rem; font-weight:800; color:#cbd5e1;">尚無任何歷史畫作紀錄</div>
        <div style="font-size:0.9rem; margin-top:6px;">只要在接力或單人模式中揭曉答案，畫作將自動保存於此相簿中！</div>
      </div>
    `;
  } else {
    list.innerHTML = g12Archive.map(round => `
      <div class="g12-gallery-round-item">
        <div class="g12-gallery-round-header">
          <div class="g12-gallery-round-title">
            <span>🎨 ${round.topic}</span>
            <span style="font-size:0.85rem; font-weight:normal; color:#94a3b8;">(${round.words})</span>
          </div>
          <div style="display:flex; gap:8px; align-items:center;">
            <span class="g12-gallery-round-badge">${round.modeTitle}</span>
            <span style="font-size:0.8rem; color:#94a3b8;">📅 ${round.date}</span>
          </div>
        </div>
        <div style="font-size:0.85rem; color:#cbd5e1; margin-bottom:4px;">
          🏷️ 系列：${round.cat} ｜ 💡 特徵提示：${round.hint}
        </div>
        <div class="g12-evolution-steps" style="padding:4px 0 8px 0;">
          ${(round.snapshots || []).map((s, idx) => `
            ${idx > 0 ? '<div class="g12-evolution-arrow">➔</div>' : ''}
            <div class="g12-evolution-card" onclick="openG12Lightbox('${s.imgUrl}', '${s.batonName} (${round.topic})', '紀錄時間：${round.date}')">
              <img src="${s.imgUrl}" alt="${s.batonName}">
              <div class="g12-evolution-card-meta">
                <span class="g12-evolution-baton-title">${s.batonName}</span>
                <span class="g12-evolution-baton-author">⏰ ${s.time || ''}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  modal.classList.add('show');
}
window.openG12GalleryModal = openG12GalleryModal;

function closeG12GalleryModal() {
  const modal = document.getElementById('g12-gallery-modal');
  if (modal) modal.classList.remove('show');
}
window.closeG12GalleryModal = closeG12GalleryModal;

function clearG12Archive() {
  if (!confirm('確定要清空所有歷史畫作相簿紀錄嗎？')) return;
  g12Archive = [];
  try {
    localStorage.removeItem(G12_ARCHIVE_KEY);
  } catch (e) {}
  updateG12ArchiveCountBadge();
  openG12GalleryModal();
}
window.clearG12Archive = clearG12Archive;

// ==========================================================
// 單圖大圖檢視 (Lightbox Modal)
// ==========================================================
function openG12Lightbox(imgSrc, title, sub) {
  console.info('[Action Triggered]: openG12Lightbox', { title });
  const modal = document.getElementById('g12-lightbox-modal');
  const img = document.getElementById('g12-lightbox-img');
  const titleEl = document.getElementById('g12-lightbox-title');
  const subEl = document.getElementById('g12-lightbox-sub');
  const dlBtn = document.getElementById('g12-lightbox-dl-btn');

  if (img) img.src = imgSrc;
  if (titleEl) titleEl.textContent = title || '畫作檢視';
  if (subEl) subEl.textContent = sub || '';
  if (dlBtn) {
    dlBtn.onclick = () => {
      const link = document.createElement('a');
      link.download = `${title || '畫畫'}_${Date.now()}.png`;
      link.href = imgSrc;
      link.click();
    };
  }
  if (modal) modal.classList.add('show');
}
window.openG12Lightbox = openG12Lightbox;

function closeG12Lightbox() {
  const modal = document.getElementById('g12-lightbox-modal');
  if (modal) modal.classList.remove('show');
}
window.closeG12Lightbox = closeG12Lightbox;

// 模式切換 (數位畫布 / 現場主持控台)
function toggleG12PlayMode(mode) {
  console.info('[Action Triggered]: toggleG12PlayMode', { mode });
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
window.toggleG12PlayMode = toggleG12PlayMode;

// 戰隊切換監聽
const g12TeamSel = document.getElementById('g12-team-selector');
if (g12TeamSel) {
  g12TeamSel.addEventListener('change', (e) => {
    g12SelectedTeamId = e.target.value;
    resetG12Relay();
    if (typeof audio !== 'undefined') audio.playBeat(true);
  });
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
window.initG12Canvas = initG12Canvas;

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
  console.info('[Action Triggered]: clearG12Canvas');
  if (!g12Canvas || !g12Ctx) return;
  saveG12UndoState();
  g12Ctx.fillStyle = '#ffffff';
  g12Ctx.fillRect(0, 0, g12Canvas.width, g12Canvas.height);
}
window.clearG12Canvas = clearG12Canvas;

function toggleG12Eraser() {
  console.info('[Action Triggered]: toggleG12Eraser');
  g12IsEraser = !g12IsEraser;
  const eraserBtn = document.getElementById('g12-btn-eraser');
  if (g12IsEraser) {
    if (eraserBtn) eraserBtn.classList.add('active');
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  } else {
    if (eraserBtn) eraserBtn.classList.remove('active');
    const firstDot = document.querySelector('.color-dot');
    if (firstDot) firstDot.classList.add('active');
  }
  if (typeof audio !== 'undefined') audio.playBeat(false);
}
window.toggleG12Eraser = toggleG12Eraser;

function setG12BrushSize(size, btn) {
  console.info('[Action Triggered]: setG12BrushSize', { size });
  g12CurrentLineWidth = size;
  document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (typeof audio !== 'undefined') audio.playBeat(false);
}
window.setG12BrushSize = setG12BrushSize;

function undoG12Canvas() {
  console.info('[Action Triggered]: undoG12Canvas');
  if (g12UndoStack.length > 0) {
    const last = g12UndoStack.pop();
    g12Ctx.putImageData(last, 0, 0);
    if (typeof audio !== 'undefined') audio.playBeat(false);
  }
}
window.undoG12Canvas = undoG12Canvas;

function downloadG12Canvas() {
  console.info('[Action Triggered]: downloadG12Canvas');
  if (!g12Canvas) return;
  const link = document.createElement('a');
  link.download = `畫畫_${g12CurrentTopic ? g12CurrentTopic.title : '畫作'}_${Date.now()}.png`;
  link.href = g12Canvas.toDataURL('image/png');
  link.click();
  if (typeof audio !== 'undefined') audio.playSuccess();
}
window.downloadG12Canvas = downloadG12Canvas;

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

