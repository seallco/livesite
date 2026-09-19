let g1TopicDeck = [];
    let g1DrawnCount = 0;

    function drawGame1() {
      audio.playBeat(true);
      if (g1TopicDeck.length === 0) {
        g1TopicDeck = [...G1_TOPICS_POOL].sort(() => Math.random() - 0.5);
        g1DrawnCount = 0;
      }
      g1DrawnCount++;
      const c1 = ZHUYIN[Math.floor(Math.random() * ZHUYIN.length)];
      let c2 = ZHUYIN[Math.floor(Math.random() * ZHUYIN.length)];
      if (c1 === c2) c2 = ZHUYIN[(ZHUYIN.indexOf(c1) + 1) % ZHUYIN.length];
      const topic = g1TopicDeck.pop();

      document.getElementById('g1-c1').textContent = c1;
      document.getElementById('g1-c2').textContent = c2;
      document.getElementById('g1-topic').textContent = `🎯 挑戰主題：${topic}`;
      document.getElementById('g1-deck-counter').textContent = `🎯 主題進度：第 ${g1DrawnCount} / ${G1_TOPICS_POOL.length} 題 (無重複)`;
      document.getElementById('g1-combo-text').textContent = `${c1} ＋ ${c2}`;
      document.getElementById('g1-hint-box').style.display = 'none';
    }

    document.getElementById('g1-btn-draw').addEventListener('click', drawGame1);
    document.getElementById('g1-btn-hint').addEventListener('click', () => {
      const c1 = document.getElementById('g1-c1').textContent;
      const c2 = document.getElementById('g1-c2').textContent;
      const key = `${c1}+${c2}`;
      const hint = G1_HINTS[key] ? G1_HINTS[key].join('、') : `例：${c1} ... ＋ ${c2} ...（造詞或造句）`;
      const box = document.getElementById('g1-hint-box');
      box.textContent = `💡 參考靈感：${hint}`;
      box.style.display = 'block';
    });

    /* ==========================================================

    let g2Running = false, g2Interval = null, g2Beat = 0;
    let g2Deck = [];
    let g2DrawnCount = 0;

    function applyNextG2Topic() {
      audio.playBeat(true);
      if (g2Deck.length === 0) {
        g2Deck = [...G2_TOPICS_POOL].sort(() => Math.random() - 0.5);
        g2DrawnCount = 0;
      }
      g2DrawnCount++;
      const t = g2Deck.pop();
      document.getElementById('g2-topic').textContent = t;
      document.getElementById('g2-deck-counter').textContent = `🎯 題庫進度：第 ${g2DrawnCount} / ${G2_TOPICS_POOL.length} 題 (無重複)`;
    }

    document.getElementById('g2-btn-toggle').addEventListener('click', () => {
      const btn = document.getElementById('g2-btn-toggle');
      if (g2Running) {
        clearInterval(g2Interval);
        g2Running = false;
        btn.textContent = '▶️ 開始節拍';
      } else {
        g2Running = true;
        btn.textContent = '⏸️ 停止節拍';
        g2Interval = setInterval(() => {
          g2Beat = (g2Beat % 4) + 1;
          for (let i = 1; i <= 4; i++) {
            document.getElementById(`b-${i}`).classList.toggle('active', i === g2Beat);
          }
          audio.playBeat(g2Beat === 1);
        }, 550);
      }
    });

    document.getElementById('g2-btn-next-topic').addEventListener('click', applyNextG2Topic);

    /* ==========================================================

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
      document.getElementById('g3-word').textContent = item.w;
      document.getElementById('g3-category').textContent = `🏷️ 類別：【${item.cat}】`;
      document.getElementById('g3-deck-counter').textContent = `🎯 題庫進度：第 ${g3DrawnCount} / ${G3_WORDS_POOL.length} 題 (無重複)`;
    }

    document.getElementById('g3-btn-start').addEventListener('click', () => {
      clearInterval(g3Timer);
      g3Sec = 60; g3Score = 0;
      document.getElementById('g3-score-text').textContent = '🏆 本局已答對：0 題';
      nextG3Word();
      g3Timer = setInterval(() => {
        if (g3Sec > 0) {
          g3Sec--;
          document.getElementById('g3-timer').textContent = `⏱️ ${g3Sec} 秒`;
        } else {
          clearInterval(g3Timer);
          audio.playBuzzer(523.25);
          alert(`⏰ 時間到！總共答對 ${g3Score} 題！`);
        }
      }, 1000);
    });

    document.getElementById('g3-btn-correct').addEventListener('click', () => {
      g3Score++;
      document.getElementById('g3-score-text').textContent = `🏆 本局已答對：${g3Score} 題`;
      audio.playSuccess();
      confettiEffect();
      nextG3Word();
    });

    document.getElementById('g3-btn-pass').addEventListener('click', () => {
      audio.playBeat(false);
      nextG3Word();
    });

    /* ==========================================================

document.getElementById('g4-btn-next-q').addEventListener('click', applyNextG4Question);

    let g4CountdownTimer = null;
    document.getElementById('g4-btn-countdown').addEventListener('click', () => {
      clearInterval(g4CountdownTimer);
      let count = 3;
      const display = document.getElementById('g4-countdown-display');
      display.textContent = `⏱️ ${count}...`;
      audio.playCountdownBeep(count);

      g4CountdownTimer = setInterval(() => {
        count--;
        if (count > 0) {
          display.textContent = `⏱️ ${count}...`;
          audio.playCountdownBeep(count);
        } else if (count === 0) {
          display.textContent = `📢 3、2、1！同時喊出答案！`;
          audio.playCountdownBeep(0);
        } else {
          clearInterval(g4CountdownTimer);
        }
      }, 1000);
    });

    document.getElementById('g4-btn-reveal-all').addEventListener('click', () => {
      audio.playSuccess();
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
        
        if (maxMatch >= 3) {
          document.getElementById('g4-result-msg').textContent = `✨ 太有默契了！有 ${maxMatch} 位玩家答案完全一致！🎉`;
          confettiEffect();
        } else {
          document.getElementById('g4-result-msg').textContent = `🤣 默契考驗中！最高相同人數：${maxMatch} 人！`;
        }
      }
    });

    document.getElementById('g4-btn-clear-all').addEventListener('click', () => {
      document.querySelectorAll('.p-answer-input').forEach(inp => {
        inp.value = '';
        inp.type = 'password';
      });
      document.getElementById('g4-result-msg').textContent = '';
      document.getElementById('g4-countdown-display').textContent = '';
    });

    /* ==========================================================

    let g5PairsDeck = [];
    let g5DrawnCount = 0;

    document.getElementById('g5-btn-start').addEventListener('click', () => {
      audio.playBeat(true);
      if (g5PairsDeck.length === 0) {
        g5PairsDeck = [...G5_PAIRS_POOL].sort(() => Math.random() - 0.5);
        g5DrawnCount = 0;
      }
      g5DrawnCount++;
      const count = parseInt(document.getElementById('g5-players-count').value);
      const pair = g5PairsDeck.pop();
      const spyIdx = Math.floor(Math.random() * count);
      const container = document.getElementById('g5-cards-container');
      container.innerHTML = '';

      document.getElementById('g5-deck-counter').textContent = `🎯 詞庫進度：第 ${g5DrawnCount} / ${G5_PAIRS_POOL.length} 組 (無重複)`;

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

    /* ==========================================================


    let g6BombTimer = null;
    let g6CurrentHolder = 1;
    let g6BombRunning = false;
    let g6PlayerCount = 4;
    let g6BombDeck = [];
    let g6DrawnCount = 0;

    function renderG6PlayerNodes() {
      const container = document.getElementById('g6-player-nodes');
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
    renderG6PlayerNodes();

    function setG6Count(num) {
      g6PlayerCount = num;
      g6CurrentHolder = 1;
      document.getElementById('g6-tab-4p').classList.toggle('active', num === 4);
      document.getElementById('g6-tab-6p').classList.toggle('active', num === 6);
      renderG6PlayerNodes();
    }

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
      audio.playBeat(true);
      if (g6BombDeck.length === 0) {
        g6BombDeck = [...G6_BOMB_TOPICS_POOL].sort(() => Math.random() - 0.5);
        g6DrawnCount = 0;
      }
      g6DrawnCount++;
      const t = g6BombDeck.pop();
      document.getElementById('g6-bomb-topic').textContent = t;
      document.getElementById('g6-deck-counter').textContent = `🎯 題庫進度：第 ${g6DrawnCount} / ${G6_BOMB_TOPICS_POOL.length} 題 (無重複)`;
      document.getElementById('g6-bomb-status').textContent = '💣 炸彈狀態：未啟動（請點擊下方開始）';
      document.getElementById('g6-bomb-status').style.color = '#ff3366';
      clearInterval(g6BombTimer);
      g6BombRunning = false;
    }

    document.getElementById('g6-btn-next-topic').addEventListener('click', applyNextG6Topic);

    document.getElementById('g6-btn-start-bomb').addEventListener('click', () => {
      audio.playBeat(true);
      clearInterval(g6BombTimer);
      g6BombRunning = true;
      g6CurrentHolder = 1;
      updateBombHolderUI();

      document.getElementById('g6-bomb-status').textContent = '🔥 炸彈引信已點燃！快回答傳給下一位！';
      document.getElementById('g6-bomb-status').style.color = '#ffc83b';

      const bombDuration = (Math.floor(Math.random() * 22) + 14) * 1000;
      const startTime = Date.now();

      g6BombTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        audio.playBeat(false);

        if (elapsed >= bombDuration) {
          clearInterval(g6BombTimer);
          g6BombRunning = false;
          audio.playExplosion();
          document.getElementById('g6-bomb-status').textContent = `💥💥 轟！！炸彈在【玩家 ${g6CurrentHolder}】手上引爆！淘汰！`;
          document.getElementById('g6-bomb-status').style.color = '#ff2a6d';
        }
      }, 700);
    });

    document.getElementById('g6-btn-pass-bomb').addEventListener('click', () => {
      if (!g6BombRunning) {
        alert('請先點擊「🧨 啟動定時炸彈」開始遊戲！');
        return;
      }
      audio.playSuccess();
      g6CurrentHolder = (g6CurrentHolder % g6PlayerCount) + 1;
      updateBombHolderUI();
    });

    /* ==========================================================


    let g7PanicTimer = null;
    let g7TimeRemaining = 3.0;
    let g7Deck = [];
    let g7DrawnCount = 0;

    function resetG7Timer() {
      clearInterval(g7PanicTimer);
      g7TimeRemaining = 3.0;
      document.getElementById('g7-timer-text').textContent = '⏱️ 3.0 秒';
      document.getElementById('g7-timer-fill').style.width = '100%';
    }

    function applyNextG7Question() {
      audio.playBeat(true);
      resetG7Timer();
      if (g7Deck.length === 0) {
        g7Deck = [...G7_QUESTIONS_POOL].sort(() => Math.random() - 0.5);
        g7DrawnCount = 0;
      }
      g7DrawnCount++;
      const q = g7Deck.pop();
      document.getElementById('g7-question').textContent = q;
      document.getElementById('g7-deck-counter').textContent = `🎯 題庫進度：第 ${g7DrawnCount} / ${G7_QUESTIONS_POOL.length} 題 (無重複)`;
    }

    document.getElementById('g7-btn-next').addEventListener('click', applyNextG7Question);

    document.getElementById('g7-btn-start').addEventListener('click', () => {
      resetG7Timer();
      audio.playBeat(true);
      const startTime = Date.now();
      const totalDuration = 3000;

      g7PanicTimer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remain = Math.max(0, totalDuration - elapsed);
        g7TimeRemaining = (remain / 1000).toFixed(1);
        document.getElementById('g7-timer-text').textContent = `⏱️ ${g7TimeRemaining} 秒`;
        const percentage = (remain / totalDuration) * 100;
        document.getElementById('g7-timer-fill').style.width = `${percentage}%`;

        if (remain <= 0) {
          clearInterval(g7PanicTimer);
          audio.playExplosion();
          document.getElementById('g7-timer-text').textContent = `💥 時間到！爆炸！`;
        }
      }, 50);
    });

    document.getElementById('g7-btn-pass').addEventListener('click', () => {
      clearInterval(g7PanicTimer);
      audio.playSuccess();
      confettiEffect();
      applyNextG7Question();
    });

    document.getElementById('g7-btn-fail').addEventListener('click', () => {
      clearInterval(g7PanicTimer);
      audio.playExplosion();
    });

    /* ==========================================================


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
      audio.playBeat(true);
      const res = drawNextG8Word();
      document.getElementById('g8-word').textContent = res.item.w;
      document.getElementById('g8-hint').textContent = `💡 英文提示參考：${res.item.h}`;
      document.getElementById('g8-category-badge').textContent = `🏷️ 類別：【${res.item.cat}】`;
      document.getElementById('g8-deck-counter').textContent = `🎯 題庫進度：第 ${res.current} / ${res.total} 題 (無重複)`;
    }

    document.getElementById('g8-btn-next').addEventListener('click', applyNextG8Word);

    document.getElementById('g8-btn-correct').addEventListener('click', () => {
      audio.playSuccess();
      confettiEffect();
      applyNextG8Word();
    });

    document.getElementById('g8-btn-pass').addEventListener('click', () => {
      audio.playBeat(false);
      applyNextG8Word();
    });

    /* ==========================================================

    let g9Cards = [], g9Flipped = [], g9TurnRed = true;

    function initG9() {
      const grid = document.getElementById('g9-grid');
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
          audio.playBeat(false);
          g9Flipped.push(c);

          if (g9Flipped.length === 2) {
            const [c1, c2] = g9Flipped;
            if (c1.dataset.icon === c2.dataset.icon) {
              c1.classList.add('matched');
              c2.classList.add('matched');
              audio.playSuccess();
              g9Flipped = [];
            } else {
              setTimeout(() => {
                c1.classList.remove('flipped'); c1.textContent = '?';
                c2.classList.remove('flipped'); c2.textContent = '?';
                g9Flipped = [];
                g9TurnRed = !g9TurnRed;
                document.getElementById('g9-turn').textContent = g9TurnRed ? '輪到：🔴 紅隊翻牌' : '輪到：🔵 藍隊翻牌';
                document.getElementById('g9-turn').style.color = g9TurnRed ? 'var(--red-team)' : 'var(--blue-team)';
              }, 800);
            }
          }
        });
        grid.appendChild(c);
      });
    }
    document.getElementById('g9-btn-reset').addEventListener('click', initG9);
    initG9();

    /* ==========================================================


    let g10Timer = null;
    let g10Sec = 60;
    let g10Deck = [];

    const promptCard = document.getElementById('g10-hidden-prompt');
    const realCard = document.getElementById('g10-real-sentence');

    promptCard.addEventListener('click', () => {
      promptCard.style.display = 'none';
      realCard.style.display = 'block';
    });

    document.getElementById('g10-btn-next-sentence').addEventListener('click', () => {
      audio.playBeat(true);
      if (g10Deck.length === 0) {
        g10Deck = [...G10_SENTENCES_POOL].sort(() => Math.random() - 0.5);
      }
      const s = g10Deck.pop();
      realCard.textContent = s;
      realCard.style.display = 'none';
      promptCard.style.display = 'block';
      clearInterval(g10Timer);
      g10Sec = 60;
      document.getElementById('g10-timer-display').textContent = '⏱️ 剩餘時間：60 秒';
    });

    document.getElementById('g10-btn-start-timer').addEventListener('click', () => {
      clearInterval(g10Timer);
      g10Sec = 60;
      audio.playBeat(true);

      g10Timer = setInterval(() => {
        if (g10Sec > 0) {
          g10Sec--;
          document.getElementById('g10-timer-display').textContent = `⏱️ 剩餘時間：${g10Sec} 秒`;
          if (g10Sec <= 5 && g10Sec > 0) audio.playCountdownBeep(g10Sec);
        } else {
          clearInterval(g10Timer);
          audio.playExplosion();
          document.getElementById('g10-timer-display').textContent = `⏰ 時間到！請最後一位玩家公佈答案！`;
        }
      }, 1000);
    });

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
      document.getElementById('g11-char-display').textContent = g11CurrentItem.char;
      document.getElementById('g11-target-char').textContent = g11CurrentItem.char;
      document.getElementById('g11-char-sub').textContent = `範例首音：找「${g11CurrentItem.example}」等`;
      cardBox.classList.add('flipped');
      if (typeof audio !== 'undefined') audio.playBeat(true);
    }, 280);
  }

  // 更新文字看板與計數
  document.getElementById('g11-deck-counter').textContent = `🎯 題庫進度：第 ${g11DrawnCount} / ${G11_ZHUYIN_POOL.length} 題 (無重複，剩餘 ${g11Deck.length} 題)`;
  document.getElementById('g11-mission-text').innerHTML = `請在現場限時找到【<span style="color:var(--gold); font-size:1.7rem;">${g11CurrentItem.char}</span>】開頭的真實物品！例如：${g11CurrentItem.example}`;

  // 隨機趣味挑戰加碼卡 (約 35% 機率觸發加碼)
  const modBox = document.getElementById('g11-modifier-box');
  if (Math.random() < 0.45) {
    const randomMod = G11_MODIFIERS[Math.floor(Math.random() * G11_MODIFIERS.length)];
    modBox.innerHTML = `<span>${randomMod}</span>`;
    modBox.style.display = 'flex';
  } else {
    modBox.innerHTML = `<span>⚡ 現場規則：率先將物品送至大螢幕前並清楚喊出名稱即獲得判定資格！</span>`;
    modBox.style.display = 'flex';
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

  if (typeof audio !== 'undefined') audio.playBeat(true);
  if (btn) btn.textContent = '⏸️ 暫停計時';

  g11Timer = setInterval(() => {
    if (g11Sec > 0) {
      g11Sec--;
      if (disp) {
        disp.textContent = `⏱️ 剩餘時間：${g11Sec} 秒`;
        if (g11Sec <= 10) disp.style.color = '#ff0033';
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
document.getElementById('g11-btn-hint').addEventListener('click', () => {
  if (!g11CurrentItem) return;
  const container = document.getElementById('g11-hints-container');
  const list = document.getElementById('g11-chips-list');
  const title = document.getElementById('g11-hints-title');

  if (container.style.display === 'block') {
    container.style.display = 'none';
    return;
  }

  title.textContent = `💡【${g11CurrentItem.char}】現場真實常見物品參考清單：`;
  list.innerHTML = '';
  g11CurrentItem.hints.forEach(hint => {
    const chip = document.createElement('span');
    chip.className = 'g11-chip';
    chip.textContent = hint;
    list.appendChild(chip);
  });

  container.style.display = 'block';
  if (typeof audio !== 'undefined') audio.playBeat(false);
});

// 抽題按鈕監聽
document.getElementById('g11-btn-draw').addEventListener('click', drawNextG11Card);
document.getElementById('g11-btn-timer-toggle').addEventListener('click', toggleG11Timer);

// 驗收判定按鈕
document.getElementById('g11-btn-verify-pass').addEventListener('click', () => {
  if (typeof audio !== 'undefined') audio.playSuccess();
  if (typeof confettiEffect === 'function') confettiEffect();
  const modBox = document.getElementById('g11-modifier-box');
  if (modBox) {
    modBox.innerHTML = `<span>🎉 恭喜驗收合格！裁判請於下方計分板為獲勝隊伍/玩家加分！</span>`;
  }
});

document.getElementById('g11-btn-verify-fail').addEventListener('click', () => {
  if (typeof audio !== 'undefined') audio.playBuzzer(280);
  const modBox = document.getElementById('g11-modifier-box');
  if (modBox) {
    modBox.innerHTML = `<span>❌ 判定不符或物品錯誤！開放其他隊伍/玩家繼續爭取！</span>`;
  }
});


/* ==========================================================
   遊戲 12: 🎨 第二關：童話與電影畫畫接力 (210+ 巨量題庫 ✕ 互動畫板)
   ========================================================== */

let g12Category = 'all'; // 'all', 'fairy', 'movie'
let g12Deck = [];
let g12DrawnCount = 0;
let g12CurrentTopic = null;

// 接力棒次與計時狀態
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
  document.getElementById('g12-current-cat-badge').textContent = `🏷️ 題庫類別：【${catNames[g12Category]}】`;
  document.getElementById('g12-deck-counter').textContent = `🎯 題庫進度：第 ${g12DrawnCount} / ${pool.length} 題 (無重複，剩餘 ${g12Deck.length} 題)`;

  // 暗題卡片重設為隱藏狀態
  document.getElementById('g12-secret-prompt').style.display = 'block';
  document.getElementById('g12-secret-content').style.display = 'none';

  // 填入秘密題目內容
  document.getElementById('g12-topic-tag').textContent = g12CurrentTopic.cat === '童話故事' ? '🏰 童話故事' : '🎬 經典電影';
  document.getElementById('g12-words-count').textContent = g12CurrentTopic.words;
  document.getElementById('g12-secret-title').textContent = g12CurrentTopic.title;
  document.getElementById('g12-secret-hint').textContent = `💡 靈感特徵提示：${g12CurrentTopic.hint}`;

  // 隱藏揭曉答案框
  document.getElementById('g12-reveal-box').style.display = 'none';

  // 重設接力狀態與清空畫布
  resetG12Relay();
  clearG12Canvas();
}

// 點擊暗題卡揭開/隱藏
const secretCardBox = document.getElementById('g12-secret-card-box');
if (secretCardBox) {
  secretCardBox.addEventListener('click', (e) => {
    if (e.target.id === 'g12-btn-rehide') {
      document.getElementById('g12-secret-content').style.display = 'none';
      document.getElementById('g12-secret-prompt').style.display = 'block';
      if (typeof audio !== 'undefined') audio.playBeat(false);
      return;
    }
    const prompt = document.getElementById('g12-secret-prompt');
    const content = document.getElementById('g12-secret-content');
    if (prompt.style.display !== 'none') {
      prompt.style.display = 'none';
      content.style.display = 'block';
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
  document.getElementById('g12-baton-display').textContent = `👤 ${batonName} 作畫中`;
  document.getElementById('g12-timer-display').textContent = `⏱️ ${g12Sec} 秒`;
  document.getElementById('g12-timer-display').style.color = '#ff3366';
  document.getElementById('g12-btn-start-baton').textContent = '▶️ 開始作畫';

  // 主持人模式看板同步
  const hostBaton = document.getElementById('g12-host-big-baton');
  const hostTimer = document.getElementById('g12-host-big-timer');
  if (hostBaton) hostBaton.textContent = `${batonName} 繪製中`;
  if (hostTimer) hostTimer.textContent = `⏱️ ${g12Sec}`;
}

function startG12BatonTimer() {
  if (g12Timer) {
    clearInterval(g12Timer);
    g12Timer = null;
    document.getElementById('g12-btn-start-baton').textContent = '▶️ 繼續作畫';
    return;
  }

  if (typeof audio !== 'undefined') audio.playBeat(true);
  document.getElementById('g12-btn-start-baton').textContent = '⏸️ 暫停';

  g12Timer = setInterval(() => {
    if (g12Sec > 0) {
      g12Sec--;
      document.getElementById('g12-timer-display').textContent = `⏱️ ${g12Sec} 秒`;
      const hostTimer = document.getElementById('g12-host-big-timer');
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
        document.getElementById('g12-baton-display').textContent = `🏆 ${guesserName}！`;
        document.getElementById('g12-timer-display').textContent = `請猜題！`;
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

  confirmBtn.style.display = 'none';
  overlayTitle.textContent = `👀 仔細看畫倒數：${viewSec} 秒！`;
  overlayDesc.textContent = '把握時間記住上一棒的畫作特徵與細節！';

  // 暫時隱藏遮罩露出畫布
  const relayModal = document.getElementById('g12-relay-modal');
  relayModal.style.background = 'rgba(10, 13, 26, 0.4)';

  g12ViewTimer = setInterval(() => {
    viewSec--;
    if (viewSec > 0) {
      overlayTitle.textContent = `👀 仔細看畫倒數：${viewSec} 秒！`;
      if (typeof audio !== 'undefined') audio.playCountdownBeep(viewSec);
    } else {
      clearInterval(g12ViewTimer);
      g12ViewTimer = null;
      relayModal.style.background = 'rgba(10, 13, 26, 0.96)';
      confirmBtn.style.display = 'inline-block';
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
  document.getElementById('g12-overlay-title').textContent = title;
  document.getElementById('g12-overlay-desc').textContent = desc;
  const btn = document.getElementById('g12-overlay-confirm-btn');
  btn.textContent = btnText;
  btn.style.display = 'inline-block';
  btn.onclick = callback;
  overlay.classList.add('show');
}

function hideG12RelayOverlay() {
  const overlay = document.getElementById('g12-relay-modal');
  overlay.classList.remove('show');
}

// 揭曉答案
document.getElementById('g12-btn-reveal').addEventListener('click', () => {
  if (!g12CurrentTopic) return;
  if (typeof audio !== 'undefined') audio.playSuccess();
  if (typeof confettiEffect === 'function') confettiEffect();

  const revealBox = document.getElementById('g12-reveal-box');
  document.getElementById('g12-revealed-title').textContent = g12CurrentTopic.title;
  document.getElementById('g12-revealed-desc').textContent = `分類：【${g12CurrentTopic.cat}】｜ 字數：${g12CurrentTopic.words} ｜ ${g12CurrentTopic.hint}`;
  revealBox.style.display = 'block';

  // 停止一切計時
  if (g12Timer) { clearInterval(g12Timer); g12Timer = null; }
  hideG12RelayOverlay();
});

document.getElementById('g12-btn-start-baton').addEventListener('click', startG12BatonTimer);
document.getElementById('g12-btn-next-baton').addEventListener('click', () => {
  if (g12Timer) { clearInterval(g12Timer); g12Timer = null; }
  triggerG12NextBatonPrompt();
});
document.getElementById('g12-btn-next-topic').addEventListener('click', drawNextG12Topic);

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
    canvasWrap.style.display = 'none';
    toolsRow.style.display = 'none';
    hostConsole.style.display = 'block';
    canvasBtn.classList.remove('active');
    hostBtn.classList.add('active');
  } else {
    canvasWrap.style.display = 'flex';
    toolsRow.style.display = 'flex';
    hostConsole.style.display = 'none';
    canvasBtn.classList.add('active');
    hostBtn.classList.remove('active');
    initG12Canvas();
  }
  if (typeof audio !== 'undefined') audio.playBeat(false);
}

/* ==========================================================
   HTML5 Canvas 平滑互動繪圖引擎
   ========================================================== */
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
  const targetWidth = Math.min(wrap.clientWidth, 820);
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
        document.getElementById('g12-btn-eraser').classList.remove('active');
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

// 橡皮擦切換
document.getElementById('g12-btn-eraser').addEventListener('click', () => {
  g12IsEraser = !g12IsEraser;
  const btn = document.getElementById('g12-btn-eraser');
  if (g12IsEraser) {
    btn.classList.add('active');
    document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  } else {
    btn.classList.remove('active');
    const firstDot = document.querySelector('.color-dot');
    if (firstDot) firstDot.classList.add('active');
  }
  if (typeof audio !== 'undefined') audio.playBeat(false);
});

// 筆刷粗細切換
document.querySelectorAll('.brush-size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.brush-size-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    g12CurrentLineWidth = parseInt(btn.dataset.size);
    if (typeof audio !== 'undefined') audio.playBeat(false);
  });
});

// 復原 (Undo)
document.getElementById('g12-btn-undo').addEventListener('click', () => {
  if (g12UndoStack.length > 0) {
    const last = g12UndoStack.pop();
    g12Ctx.putImageData(last, 0, 0);
    if (typeof audio !== 'undefined') audio.playBeat(false);
  }
});

// 清空畫布
document.getElementById('g12-btn-clear').addEventListener('click', () => {
  clearG12Canvas();
  if (typeof audio !== 'undefined') audio.playBeat(true);
});

// 保存下載畫作 PNG
document.getElementById('g12-btn-download').addEventListener('click', () => {
  if (!g12Canvas) return;
  const link = document.createElement('a');
  link.download = `畫畫接力_${g12CurrentTopic ? g12CurrentTopic.title : '畫作'}_${Date.now()}.png`;
  link.href = g12Canvas.toDataURL('image/png');
  link.click();
  if (typeof audio !== 'undefined') audio.playSuccess();
});

// 視窗縮放時適配
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