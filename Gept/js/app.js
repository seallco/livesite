// LinguaPulse Main Application Controller
// Orchestrates state, gamification, GEPT 8,365 dataset, TOEIC drills, and Web APIs

class LinguaPulseApp {
  constructor() {
    this.currentMode = null;
    this.selectedDifficulty = '中高級'; // '中高級', '中級', 'all'
    this.geptData = window.GEPT_DATA || [];
    this.practiceData = window.PRACTICE_DATA || {};
    
    // Word Blitz State
    this.blitzTimer = null;
    this.blitzTimerMode = 'infinite'; // 'infinite' | 'timed'
    this.blitzTimeLeft = 60;
    this.blitzScore = 0;
    this.blitzCombo = 0;
    this.blitzCurrentQuestion = null;
    this.blitzActive = false;
    this.blitzSessionHistory = []; // Track all questions in current session

    // Dialogue State
    this.currentDialogue = null;
    this.dialogueTurnIndex = 0;
    this.dialogueTotalScore = 0;

    // Flashcard State
    this.flashcardIndex = 0;
    this.flashcardPool = [];
    this.isFlashcardFlipped = false;

    // Speech State
    this.currentSpeechItem = null;
    this.speechRate = 1.0;

    this.init();
  }

  init() {
    this.renderHeaderStats();
    this.bindEvents();
    this.updateBadges();
    console.log(`LinguaPulse Initialized with ${this.geptData.length} GEPT vocabulary entries!`);
  }

  // ==========================================
  // Navigation & UI State
  // ==========================================
  showHub() {
    this.stopBlitzTimer();
    window.speechEngine.stopSpeaking();
    window.speechEngine.stopListening();
    
    document.querySelectorAll('.practice-container').forEach(el => el.classList.remove('active'));
    document.getElementById('hub-view').style.display = 'block';
    this.currentMode = null;
    this.renderHeaderStats();
  }

  showView(viewId) {
    window.speechEngine.stopSpeaking();
    window.speechEngine.stopListening();
    document.getElementById('hub-view').style.display = 'none';
    document.querySelectorAll('.practice-container').forEach(el => el.classList.remove('active'));
    
    const target = document.getElementById(viewId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  bindEvents() {
    // Logo returns to home
    document.getElementById('btn-home-logo').addEventListener('click', () => {
      window.soundEngine.click();
      this.showHub();
    });

    // Sound toggle
    document.getElementById('btn-toggle-sound').addEventListener('click', () => {
      const isMuted = window.soundEngine.toggleMute();
      document.getElementById('icon-sound').textContent = isMuted ? '🔇' : '🔊';
      this.showToast(isMuted ? '音效已靜音' : '音效已開啟');
    });

    // Vault & Bookmarks
    document.getElementById('btn-open-mistakes').addEventListener('click', () => {
      window.soundEngine.click();
      this.openVault('mistakes');
    });

    document.getElementById('btn-open-bookmarks').addEventListener('click', () => {
      window.soundEngine.click();
      this.openVault('bookmarks');
    });

    // Difficulty selection in Hero
    document.querySelectorAll('#filter-difficulty-group .filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        window.soundEngine.click();
        document.querySelectorAll('#filter-difficulty-group .filter-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDifficulty = btn.dataset.diff;
        this.showToast(`已切換難度：${btn.innerText}`);
      });
    });

    // Hero Quick Spark (1-Click Surprise Mini-Drill)
    document.getElementById('btn-hero-quick-spark').addEventListener('click', () => {
      window.soundEngine.click();
      this.triggerQuickSpark();
    });

    // Mode Grid Cards
    document.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        const mode = card.dataset.mode;
        window.soundEngine.click();
        this.startMode(mode);
      });
    });

    // Sub-mode next buttons
    document.getElementById('btn-next-native')?.addEventListener('click', () => this.loadNativeExpression());
    document.getElementById('btn-next-grammar')?.addEventListener('click', () => this.loadGrammarTrap());
    document.getElementById('btn-next-echo')?.addEventListener('click', () => this.loadEchoDrill());
    document.getElementById('btn-next-reading')?.addEventListener('click', () => this.loadMicroReading());
    document.getElementById('btn-next-dialogue')?.addEventListener('click', () => this.loadDialogue());
    document.getElementById('btn-clear-vault')?.addEventListener('click', () => {
      if (confirm('確定要清空嗎？')) {
        if (this.currentVaultType === 'mistakes') {
          window.storageManager.clearMistakes();
        } else {
          window.storageManager.bookmarks = [];
          window.storageManager.saveJSON(window.storageManager.KEY_BOOKMARKS, []);
        }
        this.updateBadges();
        this.openVault(this.currentVaultType);
        this.showToast('已清空列表');
      }
    });

    // Knowledge Map (Mastery Pokédex)
    document.getElementById('btn-open-mastery')?.addEventListener('click', () => {
      window.soundEngine.click();
      this.startMode('mastery');
    });

    // Dictionary mode toggle
    document.getElementById('btn-dict-flashcard-mode')?.addEventListener('click', () => {
      window.soundEngine.click();
      this.startFlashcardViewer();
    });
  }

  // ==========================================
  // Gamification & Header Updates
  // ==========================================
  renderHeaderStats() {
    const data = window.storageManager.userData;
    const lvl = window.storageManager.getLevelInfo();

    document.getElementById('val-streak').textContent = `${data.streak} 天連續`;
    document.getElementById('val-level-badge').textContent = lvl.badge;
    document.getElementById('val-level-title').textContent = `Lv.${lvl.lvl} ${lvl.title.split('(')[0].trim()}`;
    document.getElementById('val-xp-text').textContent = `${data.xp} XP`;
    
    if (lvl.nextRank) {
      document.getElementById('val-next-level').textContent = `距離下一級 ${lvl.nextRank.minXp - data.xp} XP`;
      document.getElementById('val-xp-bar').style.width = `${lvl.progressPercent}%`;
    } else {
      document.getElementById('val-next-level').textContent = `已達最高榮譽等級`;
      document.getElementById('val-xp-bar').style.width = `100%`;
    }

    document.getElementById('val-daily-count').textContent = data.dailyPractices || 0;
    this.updateBadges();
  }

  updateBadges() {
    const mistakeCount = window.storageManager.mistakes.length;
    const bookmarkCount = window.storageManager.bookmarks.length;

    const bMistakes = document.getElementById('badge-mistakes');
    const bBookmarks = document.getElementById('badge-bookmarks');

    if (mistakeCount > 0) {
      bMistakes.textContent = mistakeCount;
      bMistakes.style.display = 'inline-block';
    } else {
      bMistakes.style.display = 'none';
    }

    if (bookmarkCount > 0) {
      bBookmarks.textContent = bookmarkCount;
      bBookmarks.style.display = 'inline-block';
    } else {
      bBookmarks.style.display = 'none';
    }
  }

  awardXP(amount, isCorrect = true, reason = '') {
    const res = window.storageManager.addXP(amount, isCorrect);
    this.renderHeaderStats();

    if (isCorrect) {
      window.soundEngine.correct();
      this.showToast(`+${amount} XP！${reason}`);
    }

    if (res.leveledUp) {
      window.soundEngine.levelUp();
      this.showToast(`🎉 恭喜晉升！${res.levelInfo.badge} ${res.levelInfo.title} (目標: ${res.levelInfo.toeic})`, 4000);
    }
  }

  showToast(msg, duration = 2500) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // ==========================================
  // Mode Router
  // ==========================================
  startMode(mode) {
    this.currentMode = mode;
    switch(mode) {
      case 'blitz':
        this.showView('view-blitz');
        this.startWordBlitz();
        break;
      case 'native':
        this.showView('view-native');
        this.loadNativeExpression();
        break;
      case 'grammar':
        this.showView('view-grammar');
        this.loadGrammarTrap();
        break;
      case 'echo':
        this.showView('view-echo');
        this.loadEchoDrill();
        break;
      case 'reading':
        this.showView('view-reading');
        this.loadMicroReading();
        break;
      case 'dialogue':
        this.showView('view-dialogue');
        this.loadDialogue();
        break;
      case 'dictionary':
        this.showView('view-dictionary');
        this.loadDictionaryView();
        break;
      case 'mastery':
        this.showView('view-mastery');
        this.loadMasteryMap();
        break;
      default:
        this.showHub();
    }
  }

  // ==========================================
  // 🎲 Quick Spark: 1-Click Surprise 30s Drill
  // ==========================================
  triggerQuickSpark() {
    const randomChoices = ['blitz_quick', 'native', 'grammar', 'echo'];
    const pick = randomChoices[Math.floor(Math.random() * randomChoices.length)];

    if (pick === 'blitz_quick') {
      this.startMode('blitz');
    } else {
      this.startMode(pick);
    }
    this.showToast('🚀 已為您準備好 1 分鐘隨機靈感挑戰！');
  }

  // ==========================================
  // 1. ⚡ Word Blitz Mode (詞彙特訓狂飆：同詞性鑑別 ✕ 無限刷題 ✕ 總整理)
  // ==========================================
  switchBlitzTimerMode(mode) {
    if (this.blitzTimerMode === mode) return;
    this.blitzTimerMode = mode;

    document.querySelectorAll('.blitz-mode-pill').forEach(btn => btn.classList.remove('active'));
    if (mode === 'infinite') {
      document.getElementById('btn-mode-infinite')?.classList.add('active');
      this.showToast('已切換為：♾️ 無限刷題模式 (隨心練習，點擊結束查看總整理)');
    } else {
      document.getElementById('btn-mode-timed')?.classList.add('active');
      this.showToast('已切換為：⏱️ 60秒限時挑戰模式');
    }

    this.startWordBlitz();
  }

  startWordBlitz() {
    this.blitzTimeLeft = 60;
    this.blitzScore = 0;
    this.blitzCombo = 0;
    this.blitzActive = true;
    this.blitzSessionHistory = []; // Reset session records

    const timerDisplay = document.getElementById('blitz-timer-display');
    const comboDisplay = document.getElementById('blitz-combo-display');
    const counterDisplay = document.getElementById('blitz-counter-display');
    
    if (comboDisplay) comboDisplay.style.display = 'none';
    if (counterDisplay) counterDisplay.textContent = '📝 0 題';

    if (this.blitzTimerMode === 'infinite') {
      if (timerDisplay) timerDisplay.textContent = '♾️ 無限刷題';
      this.stopBlitzTimer();
    } else {
      if (timerDisplay) timerDisplay.textContent = `⏱️ ${this.blitzTimeLeft}s`;
      clearInterval(this.blitzTimer);
      this.blitzTimer = setInterval(() => {
        this.blitzTimeLeft--;
        if (timerDisplay) timerDisplay.textContent = `⏱️ ${this.blitzTimeLeft}s`;

        if (this.blitzTimeLeft <= 10) {
          window.soundEngine.tick();
        }

        if (this.blitzTimeLeft <= 0) {
          this.endWordBlitz();
        }
      }, 1000);
    }

    const subTitle = document.getElementById('blitz-level-sub');
    if (subTitle) {
      subTitle.textContent = `難度設定：GEPT ${this.selectedDifficulty === 'all' ? '全部難度' : this.selectedDifficulty} 詞庫 ✕ 嚴格同詞性選項`;
    }

    this.nextBlitzQuestion();
  }

  stopBlitzTimer() {
    if (this.blitzTimer) {
      clearInterval(this.blitzTimer);
      this.blitzTimer = null;
    }
  }

  getFilteredVocabPool() {
    if (this.selectedDifficulty === 'all') {
      return this.geptData;
    }
    return this.geptData.filter(item => item.l === this.selectedDifficulty);
  }

  // 嚴格比對詞性：確保選項與題目的詞性一模一樣
  normalizePos(p) {
    if (!p) return 'noun';
    const lower = p.toLowerCase().trim();
    if (lower.startsWith('v') || lower.includes('verb')) return 'verb';
    if (lower.startsWith('n') || lower.includes('noun')) return 'noun';
    if (lower.startsWith('adj') || lower.includes('adj.')) return 'adj.';
    if (lower.startsWith('adv') || lower.includes('adv.')) return 'adv.';
    if (lower.startsWith('prep') || lower.includes('prep.')) return 'prep.';
    if (lower.startsWith('conj') || lower.includes('conj.')) return 'conj.';
    return lower.split('/')[0].split(' ')[0];
  }

  nextBlitzQuestion() {
    if (!this.blitzActive) return;

    const pool = this.getFilteredVocabPool();
    if (!pool || pool.length === 0) return;

    // Use weighted random: lower-mastery words appear more frequently
    const target = window.storageManager.pickWeightedItem(pool);
    const targetNormalizedPos = this.normalizePos(target.p);

    // 1. 先從同難度 pool 尋找同詞性干擾項
    let samePosPool = pool.filter(item => 
      item.w !== target.w && this.normalizePos(item.p) === targetNormalizedPos
    );

    // 2. 如果同難度同詞性不足，擴展至全詞庫中同詞性的單字，確保絕對同詞性
    if (samePosPool.length < 3) {
      const fullSamePosPool = this.geptData.filter(item => 
        item.w !== target.w && this.normalizePos(item.p) === targetNormalizedPos
      );
      samePosPool = fullSamePosPool.length >= 3 ? fullSamePosPool : pool.filter(item => item.w !== target.w);
    }

    const distractors = [];
    const usedIndices = new Set();
    let attempts = 0;
    while (distractors.length < 3 && attempts < 100) {
      attempts++;
      const randIdx = Math.floor(Math.random() * samePosPool.length);
      if (!usedIndices.has(randIdx)) {
        usedIndices.add(randIdx);
        const candidate = samePosPool[randIdx];
        if (candidate.w !== target.w && candidate.m !== target.m && !distractors.some(d => d.w === candidate.w || d.m === candidate.m)) {
          distractors.push(candidate);
        }
      }
    }

    // 防禦機制：若極端情況不足 3 個，補足候選項
    while (distractors.length < 3) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (candidate.w !== target.w && !distractors.some(d => d.w === candidate.w)) {
        distractors.push(candidate);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    this.blitzCurrentQuestion = { target, options };

    // Update Question Counter
    const counterDisplay = document.getElementById('blitz-counter-display');
    if (counterDisplay) {
      counterDisplay.textContent = `📝 第 ${this.blitzSessionHistory.length + 1} 題`;
    }

    const area = document.getElementById('blitz-content-area');
    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="level-tag-pill">${target.l} ${target.a ? `(${target.a})` : ''}</span>
            <span class="level-tag-pill" style="background: rgba(6, 182, 212, 0.15); color: #38bdf8; border-color: rgba(6, 182, 212, 0.35);">
              同詞性辨析：${target.p}
            </span>
          </div>
          <div class="action-tool-btns">
            <button class="tool-mini-btn" title="發音" onclick="window.speechEngine.speak('${target.w.replace(/'/g, "\\'")}')">🔊</button>
            <button class="tool-mini-btn ${window.storageManager.isBookmarked(target.w) ? 'bookmarked' : ''}" title="收藏" onclick="app.toggleBookmarkWord('${target.w.replace(/'/g, "\\'")}', this)">⭐</button>
          </div>
        </div>

        <div class="drill-prompt-text" style="font-size: 2.3rem; text-align: center; color: #fff; margin: 1rem 0; font-family: 'Outfit', sans-serif;">
          ${target.w}
        </div>
        <div class="drill-sub-prompt" style="text-align: center; font-family: 'JetBrains Mono', monospace; color: #38bdf8; font-size: 1.05rem;">
          [詞性: ${target.p}]
        </div>

        <div class="options-stack two-cols" id="blitz-options-container">
          ${options.map((opt, idx) => `
            <button class="option-btn" onclick="app.handleBlitzAnswer(${idx}, '${opt.w.replace(/'/g, "\\'")}', this)">
              <span>${opt.m}</span>
              <span style="font-size: 0.8rem; color: var(--accent-cyan); font-family: 'JetBrains Mono', monospace;">${opt.p}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  handleBlitzAnswer(selectedIndex, chosenWord, btnElement) {
    if (!this.blitzActive) return;

    const { target, options } = this.blitzCurrentQuestion;
    const isCorrect = chosenWord === target.w;
    const chosenOption = options[selectedIndex];

    // Disable all options momentarily
    document.querySelectorAll('#blitz-options-container .option-btn').forEach((btn, idx) => {
      btn.disabled = true;
      if (options[idx].w === target.w) {
        btn.classList.add('selected-correct');
      }
    });

    // Track in session history for final comprehensive summary
    this.blitzSessionHistory.push({
      target: target,
      chosen: chosenOption,
      isCorrect: isCorrect,
      allOptions: options,
      timestamp: Date.now()
    });

    // Update Counter
    const counterDisplay = document.getElementById('blitz-counter-display');
    if (counterDisplay) {
      counterDisplay.textContent = `📝 已答 ${this.blitzSessionHistory.length} 題`;
    }

    // Track mastery progress in persistent storage
    const masteryResult = window.storageManager.recordAnswer(
      target.w,
      isCorrect,
      { word: target.w, meaning: target.m, pos: target.p, level: target.l, type: 'blitz' }
    );

    if (isCorrect) {
      this.blitzScore += 10 + (this.blitzCombo * 2);
      this.blitzCombo++;
      window.soundEngine.correct();

      if (this.blitzCombo >= 3) {
        window.soundEngine.streakBonus();
        const comboEl = document.getElementById('blitz-combo-display');
        if (comboEl) {
          comboEl.style.display = 'inline-block';
          comboEl.textContent = `🔥 連擊 x${this.blitzCombo} (+${this.blitzCombo * 2} 分)`;
        }
      }

      // Show mastery progress notification
      if (masteryResult.justMastered) {
        window.soundEngine.levelUp();
        this.showMasteryToast(target.w, masteryResult.newStars, true);
      } else if (masteryResult.newStars > masteryResult.prevStars) {
        this.showMasteryToast(target.w, masteryResult.newStars, false);
      }

      setTimeout(() => this.nextBlitzQuestion(), masteryResult.justMastered ? 1200 : 350);
    } else {
      btnElement.classList.add('selected-wrong');
      window.soundEngine.wrong();
      this.blitzCombo = 0;
      const comboEl = document.getElementById('blitz-combo-display');
      if (comboEl) comboEl.style.display = 'none';

      // Save mistake
      window.storageManager.addMistake({
        id: `gept_${target.w}`,
        type: '詞彙特訓狂飆',
        question: target.w,
        yourAnswer: chosenOption.m,
        correctAnswer: `${target.m} [${target.p}]`,
        explanation: `GEPT ${target.l} 核心字彙。詞性：${target.p}。`,
        targetWord: target.w
      });
      this.updateBadges();

      setTimeout(() => this.nextBlitzQuestion(), 700);
    }
  }

  // Generate Smart Contextual Examples, Word-by-Word Translation & Memory Mnemonics
  generateWordDetails(wordObj) {
    const w = wordObj.w;
    const m = wordObj.m;
    const p = this.normalizePos(wordObj.p);

    // 1. 動態例句庫與翻譯模板 (依詞性與意義精準匹配)
    let enEx = "";
    let zhEx = "";
    let breakdown = [];
    let mnemonic = "";

    if (p === 'verb') {
      enEx = `We need to ${w} this crucial project before the upcoming deadline.`;
      zhEx = `我們必須在即將到來的截止日前${m.split('、')[0]}這個關鍵專案。`;
      breakdown = [
        { en: "We need to", zh: "我們需要" },
        { en: w, zh: m.split('、')[0] },
        { en: "this crucial project", zh: "這個關鍵專案" },
        { en: "before the deadline", zh: "在截止期限之前" }
      ];
      mnemonic = `💡 【動詞搭配記憶法】：常用動詞片語如「${w} closely (密切${m.split('、')[0]})」或「attempt to ${w} (試圖${m.split('、')[0]})」，在句子中通常緊接受詞或副詞。`;
    } else if (p === 'noun') {
      enEx = `The international team achieved a significant ${w} during the annual summit.`;
      zhEx = `這個國際團隊在年度高峰會期間取得了顯著的${m.split('、')[0]}。`;
      breakdown = [
        { en: "The team", zh: "團隊" },
        { en: "achieved a significant", zh: "取得了顯著的" },
        { en: w, zh: m.split('、')[0] },
        { en: "during the summit", zh: "在高峰會期間" }
      ];
      mnemonic = `💡 【名詞結構記憶法】：常放在「a/an/the + 形容詞 + ${w}」位置，如「key ${w} (關鍵${m.split('、')[0]})」或「great ${w}」。`;
    } else if (p === 'adj.') {
      enEx = `Her proactive and ${w} attitude played a vital role in our success.`;
      zhEx = `她積極主動且${m.split('、')[0]}的態度，在我們的成功中發揮了關鍵作用。`;
      breakdown = [
        { en: "Her proactive and", zh: "她積極主動且" },
        { en: w, zh: m.split('、')[0] },
        { en: "attitude", zh: "態度" },
        { en: "played a vital role", zh: "發揮了關鍵作用" }
      ];
      mnemonic = `💡 【形容詞修飾小撇步】：修飾後方名詞，例如「${w} result (${m.split('、')[0]}的成果)」或接在 be 動詞後面「is highly ${w} (非常${m.split('、')[0]})」。`;
    } else if (p === 'adv.') {
      enEx = `The system was updated and is now running ${w} without any technical delay.`;
      zhEx = `系統已經更新，現在運行得${m.split('、')[0]}且沒有任何技術延遲。`;
      breakdown = [
        { en: "The system", zh: "系統" },
        { en: "is running", zh: "正運行得" },
        { en: w, zh: m.split('、')[0] },
        { en: "without delay", zh: "毫無延遲" }
      ];
      mnemonic = `💡 【副詞情境小撇步】：多數副詞字尾為 -ly，專門用來加強修飾動詞或形容詞，如「work ${w} (${m.split('、')[0]}地運作)」。`;
    } else {
      enEx = `The manager explained the policy regarding ${w} in clear detail.`;
      zhEx = `經理清楚詳細地解釋了關於 ${w} (${m}) 的政策規定。`;
      breakdown = [
        { en: "The manager", zh: "經理" },
        { en: "explained the policy", zh: "解釋了政策" },
        { en: w, zh: m },
        { en: "in clear detail", zh: "清楚詳細地" }
      ];
      mnemonic = `💡 【語感速記法】：將 ${w} 放入短語固定搭配中朗讀 3 次，形成語音肌肉記憶！`;
    }

    // 額外加上字根字首或拆解巧記
    if (w.startsWith('un') || w.startsWith('in') || w.startsWith('dis') || w.startsWith('im')) {
      mnemonic += ` ⚡ 字首暗示：含有否定/相反意涵。`;
    } else if (w.endsWith('tion') || w.endsWith('ment') || w.endsWith('ness')) {
      mnemonic += ` ⚡ 字尾暗示：標準名詞字尾 (-${w.slice(-4)})。`;
    } else if (w.endsWith('able') || w.endsWith('ive') || w.endsWith('ous')) {
      mnemonic += ` ⚡ 字尾暗示：標準形容詞字尾 (-${w.slice(-3)})。`;
    }

    return { enEx, zhEx, breakdown, mnemonic };
  }

  endWordBlitz() {
    this.stopBlitzTimer();
    this.blitzActive = false;
    window.soundEngine.levelUp();

    const history = this.blitzSessionHistory;
    const totalCount = history.length;
    const correctCount = history.filter(h => h.isCorrect).length;
    const wrongCount = totalCount - correctCount;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const xpEarned = Math.max(10, Math.round(this.blitzScore / 2) + (correctCount * 5));
    this.awardXP(xpEarned, true, `詞彙特訓完成！共答 ${totalCount} 題，獲得 ${xpEarned} XP`);

    this.renderBlitzSummary('all');
  }

  renderBlitzSummary(filterType = 'all') {
    const history = this.blitzSessionHistory;
    const totalCount = history.length;
    const correctCount = history.filter(h => h.isCorrect).length;
    const wrongCount = totalCount - correctCount;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const filteredItems = history.filter(item => {
      if (filterType === 'correct') return item.isCorrect;
      if (filterType === 'wrong') return !item.isCorrect;
      return true;
    });

    const area = document.getElementById('blitz-content-area');
    area.innerHTML = `
      <div class="blitz-summary-container">
        <!-- Summary Header Hero -->
        <div class="blitz-summary-hero">
          <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🎉</div>
          <h2 style="font-size: 2rem; font-family: 'Outfit', sans-serif; font-weight: 800; color: #fff; margin-bottom: 0.4rem;">
            特訓結算與全題目總整理
          </h2>
          <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 1.2rem;">
            嚴格同詞性鑑別完成！以下為本次練習的所有單字清單、例句示範、逐字翻譯與超好記小撇步。
          </p>

          <div class="blitz-summary-stats-grid">
            <div class="blitz-stat-card">
              <div class="blitz-stat-label">總練習題數</div>
              <div class="blitz-stat-val" style="color: var(--accent-cyan);">${totalCount} 題</div>
            </div>
            <div class="blitz-stat-card">
              <div class="blitz-stat-label">答對題數</div>
              <div class="blitz-stat-val" style="color: var(--accent-emerald);">${correctCount} 題</div>
            </div>
            <div class="blitz-stat-card">
              <div class="blitz-stat-label">答錯題數</div>
              <div class="blitz-stat-val" style="color: var(--accent-rose);">${wrongCount} 題</div>
            </div>
            <div class="blitz-stat-card">
              <div class="blitz-stat-label">正確率</div>
              <div class="blitz-stat-val" style="color: var(--accent-gold);">${accuracy}%</div>
            </div>
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem;">
            <button class="btn-primary" onclick="app.startWordBlitz()">⚡ 再次開始特訓</button>
            <button class="btn-secondary" onclick="app.showHub()">返回主選單</button>
          </div>
        </div>

        <!-- Filter Tabs -->
        <div class="summary-filter-tabs">
          <button class="summary-tab-btn ${filterType === 'all' ? 'active' : ''}" onclick="app.renderBlitzSummary('all')">
            📚 全部題目 (${totalCount})
          </button>
          <button class="summary-tab-btn ${filterType === 'wrong' ? 'active' : ''}" onclick="app.renderBlitzSummary('wrong')">
            ❌ 需複習錯題 (${wrongCount})
          </button>
          <button class="summary-tab-btn ${filterType === 'correct' ? 'active' : ''}" onclick="app.renderBlitzSummary('correct')">
            ✅ 答對題數 (${correctCount})
          </button>
        </div>

        <!-- Word Breakdown List -->
        <div class="summary-words-list">
          ${filteredItems.length === 0 ? `
            <div class="drill-card" style="text-align: center; padding: 3rem; color: var(--text-secondary);">
              此分類目前沒有題目。
            </div>
          ` : filteredItems.map((item, idx) => {
            const wordData = item.target;
            const details = this.generateWordDetails(wordData);
            return `
              <div class="summary-word-card ${item.isCorrect ? 'is-correct' : 'is-wrong'}">
                <div class="summary-word-header">
                  <div class="summary-word-main">
                    <span class="summary-target-word">${wordData.w}</span>
                    <span class="summary-pos-tag">${wordData.p}</span>
                    <span class="summary-level-tag">${wordData.l}</span>
                  </div>

                  <div style="display: flex; align-items: center; gap: 0.6rem;">
                    <span style="font-size: 0.85rem; font-weight: 700; color: ${item.isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
                      ${item.isCorrect ? '✅ 答對' : `❌ 你的答案: ${item.chosen.m}`}
                    </span>
                    <button class="tool-mini-btn" title="朗讀" onclick="window.speechEngine.speak('${wordData.w.replace(/'/g, "\\'")}')">🔊</button>
                    <button class="tool-mini-btn ${window.storageManager.isBookmarked(wordData.w) ? 'bookmarked' : ''}" title="收藏單字" onclick="app.toggleBookmarkWord('${wordData.w.replace(/'/g, "\\'")}', this)">⭐</button>
                  </div>
                </div>

                <div class="summary-meaning-box">
                  🎯 中文釋義：${wordData.m}
                </div>

                <!-- 1. 精選地道例句 -->
                <div class="summary-section-box">
                  <div class="summary-section-title">
                    <span>📖</span> 情境應用示範例句
                  </div>
                  <div class="summary-example-en">
                    ${details.enEx}
                    <button class="tool-mini-btn" style="display: inline-flex; width: 24px; height: 24px; font-size: 0.75rem; margin-left: 6px; vertical-align: middle;" title="朗讀例句" onclick="window.speechEngine.speak('${details.enEx.replace(/'/g, "\\'")}')">🔊</button>
                  </div>
                  <div class="summary-example-zh">
                    ${details.zhEx}
                  </div>
                </div>

                <!-- 2. 逐字拆解翻譯 -->
                <div class="summary-section-box">
                  <div class="summary-section-title">
                    <span>🧩</span> 句構逐字與片段對照翻譯
                  </div>
                  <div class="summary-breakdown-row">
                    ${details.breakdown.map(b => `
                      <span class="breakdown-token">
                        <b>${b.en}</b>➔ ${b.zh}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <!-- 3. 超好記小撇步 -->
                <div class="summary-tip-box">
                  <div class="summary-section-title" style="color: var(--accent-gold);">
                    <span>🧠</span> 記憶小撇步 ＆ 搭配心法
                  </div>
                  <div class="summary-tip-text">
                    ${details.mnemonic}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // 2. ☕ Native Expressions Mode (地道表達 vs 課本)
  // ==========================================
  loadNativeExpression() {
    const list = this.practiceData.nativeExpressions;
    if (!list || list.length === 0) return;

    const item = list[Math.floor(Math.random() * list.length)];
    const area = document.getElementById('native-content-area');

    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <span class="level-tag-pill">🏷️ ${item.category} (母語高頻)</span>
          <div class="action-tool-btns">
            <button class="tool-mini-btn" title="朗讀地道句" onclick="window.speechEngine.speak('${item.native.replace(/'/g, "\\'")}')">🔊</button>
            <button class="tool-mini-btn ${window.storageManager.isBookmarked(item.id) ? 'bookmarked' : ''}" title="收藏" onclick="app.toggleBookmarkIdiom('${item.id}', this)">⭐</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1.5rem 0;">
          <div style="background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.25); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: #fb7185; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">❌ 課本/生硬中式說法</div>
            <div style="font-size: 1.15rem; font-weight: 600; color: #fecdd3;">${item.textbook}</div>
          </div>

          <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); padding: 1.25rem;">
            <div style="font-size: 0.75rem; color: #34d399; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem;">🔥 老外母語真正地道說法</div>
            <div style="font-size: 1.25rem; font-weight: 700; color: #a7f3d0;">${item.native}</div>
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.75); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.95rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 0.4rem;">
            💡 核心片語 / 俚語：<span style="color: #fff; font-size: 1.1rem;">${item.idiom}</span> (${item.meaning})
          </div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.85rem;">
            ${item.explanation}
          </div>
          <div style="font-size: 0.9rem; color: var(--text-highlight); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
            <strong>💬 情境例句：</strong> "${item.example}"
            <button class="tool-mini-btn" style="display: inline-flex; vertical-align: middle; margin-left: 0.5rem;" onclick="window.speechEngine.speak('${item.example.replace(/'/g, "\\'")}')">🔊</button>
          </div>
        </div>

        <div class="drill-actions-bar">
          <button class="btn-primary" onclick="app.awardXP(15, true, '學習了 1 個地道片語！'); app.loadNativeExpression();">
            ✅ 掌握了 (+15 XP) ➔ 下一句
          </button>
          <button class="btn-secondary" onclick="window.speechEngine.speak('${item.native.replace(/'/g, "\\'")}', {rate: 0.85})">
            🐢 0.85x 慢速跟讀
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. 🕵️ Grammar Detective & TOEIC Gold Traps
  // ==========================================
  loadGrammarTrap() {
    const list = this.practiceData.grammarTraps;
    if (!list || list.length === 0) return;

    const item = list[Math.floor(Math.random() * list.length)];
    const area = document.getElementById('grammar-content-area');

    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <span class="level-tag-pill">🎯 ${item.topic}</span>
          <span class="level-tag-pill" style="background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); border-color: var(--border-gold);">${item.targetLevel}</span>
        </div>

        <div class="drill-prompt-text" style="font-size: 1.45rem; line-height: 1.6; margin: 1.5rem 0;">
          ${item.sentence.replace('_____', '<span style="color: var(--accent-cyan); text-decoration: underline; font-weight: 800;">[ ? ]</span>')}
        </div>

        <div class="options-stack two-cols" id="grammar-options-container">
          ${item.options.map(opt => `
            <button class="option-btn" onclick="app.handleGrammarAnswer('${opt}', '${item.correct}', '${item.id}', this)">
              <span>${opt}</span>
              <span>➔</span>
            </button>
          `).join('')}
        </div>

        <div id="grammar-feedback-container" style="display: none;"></div>
      </div>
    `;
  }

  handleGrammarAnswer(chosen, correct, itemId, btnElement) {
    const item = this.practiceData.grammarTraps.find(g => g.id === itemId);
    const isCorrect = chosen === correct;

    document.querySelectorAll('#grammar-options-container .option-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.innerText.includes(correct)) {
        btn.classList.add('selected-correct');
      }
    });

    const fbContainer = document.getElementById('grammar-feedback-container');
    fbContainer.style.display = 'block';

    if (isCorrect) {
      btnElement.classList.add('selected-correct');
      this.awardXP(25, true, '破解多益金色考點！');
      fbContainer.className = 'feedback-box correct';
      fbContainer.innerHTML = `
        <div class="feedback-title">🎉 正確解答！金證直擊</div>
        <div class="feedback-desc">${item.errorExplanation}</div>
        <div style="margin-top: 0.75rem; font-weight: 700; color: #34d399;">💎 黃金法則：${item.rule}</div>
      `;
    } else {
      btnElement.classList.add('selected-wrong');
      window.soundEngine.wrong();
      fbContainer.className = 'feedback-box wrong';
      fbContainer.innerHTML = `
        <div class="feedback-title">⚠️ 掉入陷阱！正確答案是: <strong style="color:#6ee7b7;">${correct}</strong></div>
        <div class="feedback-desc">${item.errorExplanation}</div>
        <div style="margin-top: 0.75rem; font-weight: 700; color: #fca5a5;">💎 黃金法則：${item.rule}</div>
      `;

      // Add to Mistake Vault
      window.storageManager.addMistake({
        id: item.id,
        type: '語感偵探 (多益金證考點)',
        question: item.sentence,
        yourAnswer: chosen,
        correctAnswer: correct,
        explanation: `${item.errorExplanation} 【法則】${item.rule}`
      });
      this.updateBadges();
    }
  }

  // ==========================================
  // 4. 🎙️ Echo & Speak Coach (發音跟讀評分)
  // ==========================================
  loadEchoDrill() {
    const list = this.practiceData.speechDrills;
    if (!list || list.length === 0) return;

    const item = list[Math.floor(Math.random() * list.length)];
    this.currentSpeechItem = item;
    const area = document.getElementById('echo-content-area');

    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <span class="level-tag-pill">🎙️ ${item.category}</span>
          <div class="action-tool-btns">
            <button class="tool-mini-btn" title="慢速 0.8x" onclick="window.speechEngine.speak('${item.sentence.replace(/'/g, "\\'")}', {rate: 0.8})">🐢 0.8x</button>
            <button class="tool-mini-btn" title="標準 1.0x" onclick="window.speechEngine.speak('${item.sentence.replace(/'/g, "\\'")}', {rate: 1.0})">🔊 1.0x</button>
          </div>
        </div>

        <div class="drill-prompt-text" style="font-size: 1.45rem; line-height: 1.6; margin: 1.25rem 0;">
          "${item.sentence}"
        </div>

        <div style="font-family: monospace; font-size: 0.95rem; color: #38bdf8; margin-bottom: 0.5rem;">
          ${item.ipaGuide}
        </div>
        <div style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
          中譯：${item.meaning}
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.85rem; color: var(--accent-gold); font-weight: 700;">💡 母語發音與節奏技巧</div>
          <div style="font-size: 0.88rem; color: var(--text-highlight);">${item.focusTip}</div>
        </div>

        <!-- Speech Interaction Area -->
        <div class="speech-coach-container">
          <button class="mic-pulse-btn" id="btn-mic-record" onclick="app.toggleSpeechRecording()">
            <span>🎤</span>
          </button>
          <div class="speech-status-text" id="speech-status-msg">點擊麥克風開始大聲跟讀...</div>

          <div class="recognized-transcript-box" id="speech-transcript-box" style="display: none;">
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.3rem;">辨識結果：</div>
            <div id="speech-transcript-text" style="font-weight: 600; color: #fff;"></div>
          </div>

          <div id="speech-result-score-box" style="display: none; width: 100%;"></div>
        </div>
      </div>
    `;
  }

  toggleSpeechRecording() {
    const micBtn = document.getElementById('btn-mic-record');
    const statusMsg = document.getElementById('speech-status-msg');
    const transBox = document.getElementById('speech-transcript-box');
    const transText = document.getElementById('speech-transcript-text');

    if (window.speechEngine.isListening) {
      window.speechEngine.stopListening();
      micBtn.classList.remove('recording');
      statusMsg.textContent = '評分中...';
      return;
    }

    micBtn.classList.add('recording');
    statusMsg.textContent = '🔴 正在聆聽... 請清晰大聲朗讀以上句子！';
    transBox.style.display = 'block';
    transText.textContent = '...';

    window.soundEngine.playTone(600, 'sine', 0.1, 0.08);

    const success = window.speechEngine.startListening(
      (result) => {
        transText.textContent = result.final || result.interim;
        if (result.final) {
          this.evaluateUserSpeech(result.final);
        }
      },
      () => {
        micBtn.classList.remove('recording');
        statusMsg.textContent = '錄音結束';
      },
      (err) => {
        micBtn.classList.remove('recording');
        statusMsg.textContent = `提示：${err} (若未開啟麥克風權限請於瀏覽器網址列啟用)`;
      }
    );

    if (!success) {
      micBtn.classList.remove('recording');
      statusMsg.textContent = '您的瀏覽器暫不支援麥克風語音辨識 (建議使用 Chrome/Edge/Safari)。您仍可使用朗讀功能強化聽力！';
    }
  }

  evaluateUserSpeech(spokenText) {
    const item = this.currentSpeechItem;
    if (!item) return;

    const evalResult = window.speechEngine.evaluatePronunciation(spokenText, item.sentence);
    const scoreBox = document.getElementById('speech-result-score-box');
    scoreBox.style.display = 'block';

    let scoreColor = '#34d399';
    let comment = '🔥 令人驚豔的流利度與準確度！';
    let xp = 30;

    if (evalResult.score < 50) {
      scoreColor = '#fb7185';
      comment = '加油！再聽一次慢速朗讀，注意連音與重音位置！';
      xp = 10;
    } else if (evalResult.score < 80) {
      scoreColor = '#fbbf24';
      comment = '相當不錯！大部分單字發音清晰！';
      xp = 20;
    }

    scoreBox.innerHTML = `
      <div class="feedback-box ${evalResult.score >= 70 ? 'correct' : 'wrong'}" style="margin-top: 1rem;">
        <div class="feedback-title" style="color: ${scoreColor}; font-size: 1.3rem;">
          發音契合度：${evalResult.score}% ${evalResult.score >= 80 ? '🌟' : ''}
        </div>
        <div class="feedback-desc" style="margin-top: 0.4rem;">
          ${comment}
        </div>
      </div>
    `;

    this.awardXP(xp, true, `口說發音跟讀完成 (+${xp} XP)`);
  }

  // ==========================================
  // 5. 📰 2-Minute Micro-Reading Mode
  // ==========================================
  loadMicroReading() {
    const list = this.practiceData.microReadings;
    if (!list || list.length === 0) return;

    const item = list[Math.floor(Math.random() * list.length)];
    const area = document.getElementById('reading-content-area');

    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <span class="level-tag-pill">📰 ${item.category}</span>
          <span class="level-tag-pill" style="background: rgba(16, 185, 129, 0.15); color: #6ee7b7; border-color: rgba(16, 185, 129, 0.3);">⏱️ ${item.readTime}</span>
        </div>

        <h3 style="font-size: 1.45rem; font-weight: 800; color: #fff; margin: 1rem 0;">${item.title}</h3>

        <div style="font-size: 1.05rem; line-height: 1.8; color: var(--text-highlight); background: rgba(15, 23, 42, 0.7); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 1.5rem; white-space: pre-line;">
          ${item.content}
        </div>

        <div style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 0.5rem;">📚 本篇核心進階詞彙 (Key Vocabulary)</div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
            ${item.vocabList.map(v => `
              <span class="stat-pill" style="cursor: pointer;" onclick="window.speechEngine.speak('${v.word.replace(/'/g, "\\'")}')" title="點擊發音">
                <span>🔊</span> <strong>${v.word}</strong>: ${v.meaning}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Comprehension Question -->
        <div style="margin-top: 1.5rem;">
          <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 1rem;">
            ❓ 理解力挑戰：${item.question.prompt}
          </div>

          <div class="options-stack" id="reading-options-container">
            ${item.question.options.map((opt, idx) => `
              <button class="option-btn" onclick="app.handleReadingAnswer(${idx}, ${item.question.answerIndex}, '${item.id}', this)">
                <span>${opt}</span>
                <span>➔</span>
              </button>
            `).join('')}
          </div>

          <div id="reading-feedback-container" style="display: none;"></div>
        </div>

        <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%); border: 1px solid var(--border-accent); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1.75rem; text-align: center;">
          <div style="font-size: 0.8rem; text-transform: uppercase; color: #a5b4fc; font-weight: 700; margin-bottom: 0.3rem;">✨ 提煉金句 (Golden Quote)</div>
          <div style="font-size: 1.1rem; font-style: italic; color: #fff;">"${item.goldenQuote}"</div>
        </div>
      </div>
    `;
  }

  handleReadingAnswer(selectedIdx, correctIdx, itemId, btnElement) {
    const item = this.practiceData.microReadings.find(r => r.id === itemId);
    const isCorrect = selectedIdx === correctIdx;

    document.querySelectorAll('#reading-options-container .option-btn').forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('selected-correct');
    });

    const fb = document.getElementById('reading-feedback-container');
    fb.style.display = 'block';

    if (isCorrect) {
      btnElement.classList.add('selected-correct');
      this.awardXP(35, true, '短篇閱讀理解挑戰成功！');
      fb.className = 'feedback-box correct';
      fb.innerHTML = `
        <div class="feedback-title">🎉 理解精準！</div>
        <div class="feedback-desc">${item.question.explanation}</div>
      `;
    } else {
      btnElement.classList.add('selected-wrong');
      window.soundEngine.wrong();
      fb.className = 'feedback-box wrong';
      fb.innerHTML = `
        <div class="feedback-title">⚠️ 需再細讀文章細節！</div>
        <div class="feedback-desc">${item.question.explanation}</div>
      `;
    }
  }

  // ==========================================
  // 6. 🥊 3-Turn Dialogue Mode (情境快打對決)
  // ==========================================
  loadDialogue() {
    const list = this.practiceData.dialogues;
    if (!list || list.length === 0) return;

    this.currentDialogue = list[Math.floor(Math.random() * list.length)];
    this.dialogueTurnIndex = 0;
    this.dialogueTotalScore = 0;
    this.renderDialogueTurn();
  }

  renderDialogueTurn() {
    const diag = this.currentDialogue;
    const turn = diag.turns[this.dialogueTurnIndex];
    const area = document.getElementById('dialogue-content-area');

    area.innerHTML = `
      <div class="drill-card">
        <div class="drill-badge-row">
          <span class="level-tag-pill">🥊 ${diag.title}</span>
          <span class="level-tag-pill" style="background: rgba(59, 130, 246, 0.15); color: #93c5fd; border-color: rgba(59, 130, 246, 0.3);">
            回合 ${this.dialogueTurnIndex + 1} / ${diag.turns.length}
          </span>
        </div>

        <div style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem; background: rgba(0,0,0,0.25); padding: 0.75rem 1rem; border-radius: var(--radius-sm);">
          📍 <strong>當前情境：</strong> ${diag.scenario}
        </div>

        <!-- Bot Chat Bubble -->
        <div style="display: flex; gap: 0.85rem; margin-bottom: 1.75rem; align-items: flex-start;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--grad-primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
            🤖
          </div>
          <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-subtle); border-radius: 0 var(--radius-md) var(--radius-md) var(--radius-md); padding: 1.1rem 1.35rem; color: #fff; font-size: 1.15rem; line-height: 1.5; max-width: 85%;">
            <div style="font-size: 0.75rem; color: #818cf8; font-weight: 700; margin-bottom: 0.3rem;">${diag.role}</div>
            "${turn.botSays}"
            <button class="tool-mini-btn" style="display: inline-flex; vertical-align: middle; margin-left: 0.5rem;" onclick="window.speechEngine.speak('${turn.botSays.replace(/'/g, "\\'")}')">🔊</button>
          </div>
        </div>

        <!-- Response Options -->
        <div style="font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 0.75rem;">
          👇 請選擇最具說服力、得體且地道的回應方式：
        </div>

        <div class="options-stack" id="dialogue-options-container">
          ${turn.options.map((opt, idx) => `
            <button class="option-btn" onclick="app.handleDialogueChoice(${idx}, this)">
              <span>"${opt.text}"</span>
              <span>➔</span>
            </button>
          `).join('')}
        </div>

        <div id="dialogue-feedback-container" style="display: none;"></div>
      </div>
    `;
  }

  handleDialogueChoice(choiceIdx, btnElement) {
    const diag = this.currentDialogue;
    const turn = diag.turns[this.dialogueTurnIndex];
    const chosen = turn.options[choiceIdx];

    document.querySelectorAll('#dialogue-options-container .option-btn').forEach(btn => btn.disabled = true);

    this.dialogueTotalScore += chosen.points;
    const isBest = chosen.isBest;

    if (isBest) {
      btnElement.classList.add('selected-correct');
      window.soundEngine.correct();
    } else {
      btnElement.classList.add('selected-wrong');
      window.soundEngine.wrong();
    }

    const fb = document.getElementById('dialogue-feedback-container');
    fb.style.display = 'block';
    fb.className = `feedback-box ${isBest ? 'correct' : 'wrong'}`;
    fb.innerHTML = `
      <div class="feedback-title">${isBest ? '🔥 完美應對！(+10 分)' : `💡 評語 (獲得 ${chosen.points} 分)`}</div>
      <div class="feedback-desc">${chosen.feedback}</div>
      <div style="margin-top: 1rem;">
        <button class="btn-primary" onclick="app.advanceDialogueTurn()">
          ${this.dialogueTurnIndex + 1 < diag.turns.length ? '下一回合 ➔' : '結算對話評分 🏆'}
        </button>
      </div>
    `;
  }

  advanceDialogueTurn() {
    this.dialogueTurnIndex++;
    if (this.dialogueTurnIndex < this.currentDialogue.turns.length) {
      this.renderDialogueTurn();
    } else {
      // Finished
      window.soundEngine.levelUp();
      const xpEarned = this.dialogueTotalScore * 2;
      this.awardXP(xpEarned, true, `完成情境快打對決！獲得 ${this.dialogueTotalScore}/30 分`);

      const area = document.getElementById('dialogue-content-area');
      area.innerHTML = `
        <div class="drill-card" style="text-align: center; padding: 3rem 2rem;">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🏆</div>
          <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">情境快打順利通關！</h2>
          <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">實戰臨場表達能力提升，逐漸形成母語思維本能！</p>
          
          <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-gold); margin-bottom: 0.5rem;">
            總得分：${this.dialogueTotalScore} / 30
          </div>
          <div style="color: var(--accent-emerald); font-weight: 700; margin-bottom: 2rem;">
            +${xpEarned} XP 獎勵入袋！
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem;">
            <button class="btn-primary" onclick="app.loadDialogue()">🥊 挑戰下一情境</button>
            <button class="btn-secondary" onclick="app.showHub()">返回主選單</button>
          </div>
        </div>
      `;
    }
  }

  // ==========================================
  // 7. 📖 GEPT 8,365 Dictionary & Flashcards
  // ==========================================
  loadDictionaryView() {
    const area = document.getElementById('dictionary-content-area');
    area.innerHTML = `
      <div>
        <div class="dict-search-bar">
          <input type="text" class="dict-input" id="dict-search-input" placeholder="🔍 搜尋英文單字或中文釋義 (例如: acknowledge / 承認 / L6)..." oninput="app.filterDictionary(this.value)">
          <div class="difficulty-filter-group" id="dict-filter-group">
            <button class="filter-pill-btn active" data-level="all" onclick="app.setDictLevelFilter('all', this)">全部 (8,365)</button>
            <button class="filter-pill-btn" data-level="中高級" onclick="app.setDictLevelFilter('中高級', this)">中高級 (3,300)</button>
            <button class="filter-pill-btn" data-level="中級" onclick="app.setDictLevelFilter('中級', this)">中級 (2,680)</button>
            <button class="filter-pill-btn" data-level="初級" onclick="app.setDictLevelFilter('初級', this)">初級 (2,385)</button>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          共檢索到 <strong id="dict-count-label" style="color: #a5b4fc;">0</strong> 個單字
        </div>

        <div class="dict-results-list" id="dict-results-container">
          <!-- Rendered dynamically -->
        </div>
      </div>
    `;

    this.currentDictFilter = 'all';
    this.filterDictionary('');
  }

  setDictLevelFilter(level, btn) {
    window.soundEngine.click();
    document.querySelectorAll('#dict-filter-group .filter-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.currentDictFilter = level;
    const query = document.getElementById('dict-search-input')?.value || '';
    this.filterDictionary(query);
  }

  filterDictionary(query) {
    const container = document.getElementById('dict-results-container');
    if (!container) return;

    query = query.toLowerCase().trim();
    let filtered = this.geptData;

    if (this.currentDictFilter !== 'all') {
      filtered = filtered.filter(item => item.l === this.currentDictFilter);
    }

    if (query) {
      filtered = filtered.filter(item => 
        item.w.toLowerCase().includes(query) || 
        item.m.includes(query) ||
        (item.a && item.a.toLowerCase().includes(query))
      );
    }

    document.getElementById('dict-count-label').textContent = filtered.length;

    const displayList = filtered.slice(0, 80); // First 80 for instant rendering

    container.innerHTML = displayList.map(item => `
      <div class="dict-item-card">
        <div class="dict-item-header">
          <span class="dict-word-title">${item.w}</span>
          <div>
            <button class="tool-mini-btn" style="display: inline-flex;" onclick="window.speechEngine.speak('${item.w.replace(/'/g, "\\'")}')" title="朗讀">🔊</button>
            <button class="tool-mini-btn ${window.storageManager.isBookmarked(item.w) ? 'bookmarked' : ''}" style="display: inline-flex;" onclick="app.toggleBookmarkWord('${item.w.replace(/'/g, "\\'")}', this)" title="收藏">⭐</button>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <span class="dict-pos">[${item.p}]</span>
          <span class="level-tag-pill" style="font-size: 0.65rem; padding: 1px 6px;">${item.l}</span>
          ${item.a ? `<span style="font-size: 0.65rem; color: #a855f7; font-family: monospace;">${item.a}</span>` : ''}
        </div>
        <div class="dict-meaning">${item.m}</div>
      </div>
    `).join('');
  }

  // 3D Flashcard Viewer Mode
  startFlashcardViewer() {
    this.flashcardPool = this.getFilteredVocabPool().sort(() => Math.random() - 0.5);
    this.flashcardIndex = 0;
    this.isFlashcardFlipped = false;

    const area = document.getElementById('dictionary-content-area');
    area.innerHTML = `
      <div style="text-align: center;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <button class="btn-secondary" onclick="app.loadDictionaryView()">← 返回詞庫搜尋</button>
          <div style="color: var(--text-secondary); font-size: 0.9rem;" id="flashcard-counter">
            卡片 1 / ${this.flashcardPool.length}
          </div>
          <span class="level-tag-pill">🎴 3D 翻轉閃卡</span>
        </div>

        <div class="flashcard-3d-wrapper" onclick="app.flipFlashcard()">
          <div class="flashcard-inner" id="flashcard-inner-box">
            <!-- Front -->
            <div class="flashcard-face flashcard-front" id="flashcard-front-content">
              <!-- Dynamically filled -->
            </div>
            <!-- Back -->
            <div class="flashcard-face flashcard-back" id="flashcard-back-content">
              <!-- Dynamically filled -->
            </div>
          </div>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
          💡 點擊卡片即可 3D 翻轉看中文釋義
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem;">
          <button class="btn-secondary" onclick="app.prevFlashcard()">上一個</button>
          <button class="btn-primary" onclick="window.speechEngine.speak(app.flashcardPool[app.flashcardIndex].w)">🔊 朗讀發音</button>
          <button class="btn-primary" onclick="app.nextFlashcard()">下一個 ➔</button>
        </div>
      </div>
    `;

    this.renderCurrentFlashcard();
  }

  renderCurrentFlashcard() {
    const card = this.flashcardPool[this.flashcardIndex];
    if (!card) return;

    this.isFlashcardFlipped = false;
    document.getElementById('flashcard-inner-box').classList.remove('flipped');
    document.getElementById('flashcard-counter').textContent = `卡片 ${this.flashcardIndex + 1} / ${this.flashcardPool.length}`;

    document.getElementById('flashcard-front-content').innerHTML = `
      <span class="level-tag-pill" style="margin-bottom: 1rem;">GEPT ${card.l}</span>
      <div style="font-size: 2.4rem; font-weight: 800; color: #fff; margin-bottom: 0.5rem;">${card.w}</div>
      <div style="font-family: monospace; color: #38bdf8; font-size: 1.1rem;">[${card.p}]</div>
    `;

    document.getElementById('flashcard-back-content').innerHTML = `
      <div style="font-size: 1.6rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 0.75rem;">${card.m}</div>
      <div style="font-size: 0.9rem; color: var(--text-secondary);">詞性: ${card.p} | 難度: ${card.l} ${card.a ? `(${card.a})` : ''}</div>
    `;
  }

  flipFlashcard() {
    window.soundEngine.click();
    this.isFlashcardFlipped = !this.isFlashcardFlipped;
    const box = document.getElementById('flashcard-inner-box');
    if (this.isFlashcardFlipped) {
      box.classList.add('flipped');
    } else {
      box.classList.remove('flipped');
    }
  }

  nextFlashcard() {
    if (this.flashcardIndex < this.flashcardPool.length - 1) {
      this.flashcardIndex++;
      this.renderCurrentFlashcard();
      this.awardXP(5, true, '複習了 1 張閃卡 (+5 XP)');
    }
  }

  prevFlashcard() {
    if (this.flashcardIndex > 0) {
      this.flashcardIndex--;
      this.renderCurrentFlashcard();
    }
  }

  // ==========================================
  // 8. 🛡️ Mistake Vault & Bookmarks
  // ==========================================
  openVault(type) {
    this.currentVaultType = type;
    this.showView('view-vault');

    const titleEl = document.getElementById('vault-title');
    const descEl = document.getElementById('vault-desc');
    const area = document.getElementById('vault-content-area');

    if (type === 'mistakes') {
      titleEl.innerHTML = `🛡️ 錯題本 (Mistake Vault) <span style="font-size: 0.9rem; color: var(--accent-rose);">(${window.storageManager.mistakes.length} 題)</span>`;
      descEl.textContent = '專注攻克弱點，消滅中式盲點與易混淆考點！';

      const list = window.storageManager.mistakes;
      if (list.length === 0) {
        area.innerHTML = `
          <div class="drill-card" style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✨</div>
            <h3>目前沒有任何錯題記錄！</h3>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">太棒了，繼續在練習中保持高準確率！</p>
          </div>
        `;
        return;
      }

      area.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${list.map((m, idx) => `
            <div class="drill-card" style="padding: 1.25rem 1.5rem; margin-bottom: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span class="level-tag-pill" style="background: rgba(244, 63, 94, 0.15); color: #fb7185;">${m.type}</span>
                <button class="tool-mini-btn" onclick="app.removeMistakeItem('${m.id}')" title="已掌握並移出錯題本">🗑️ 移除</button>
              </div>
              <div style="font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">
                ${m.question}
              </div>
              <div style="font-size: 0.9rem; color: #fda4af; margin-bottom: 0.25rem;">
                ❌ 你的作答：${m.yourAnswer}
              </div>
              <div style="font-size: 0.9rem; color: #6ee7b7; margin-bottom: 0.5rem;">
                ✅ 正確答案：${m.correctAnswer}
              </div>
              <div style="font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm);">
                💡 解析：${m.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Bookmarks
      titleEl.innerHTML = `⭐ 我的單字與靈感收藏庫 <span style="font-size: 0.9rem; color: var(--accent-gold);">(${window.storageManager.bookmarks.length} 條)</span>`;
      descEl.textContent = '珍藏的高頻單字、地道片語隨時複習！';

      const list = window.storageManager.bookmarks;
      if (list.length === 0) {
        area.innerHTML = `
          <div class="drill-card" style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
            <h3>目前尚未收藏任何單字或片語！</h3>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">在練習中點擊 ⭐ 星號即可收藏至此處隨時翻閱。</p>
          </div>
        `;
        return;
      }

      area.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          ${list.map(b => `
            <div class="dict-item-card">
              <div class="dict-item-header">
                <span class="dict-word-title">${b.w || b.idiom || b.id}</span>
                <div>
                  <button class="tool-mini-btn" onclick="window.speechEngine.speak('${(b.w || b.idiom || b.native || '').replace(/'/g, "\\'")}')" title="朗讀">🔊</button>
                  <button class="tool-mini-btn bookmarked" onclick="app.removeBookmarkItem('${b.w || b.id}')" title="取消收藏">⭐</button>
                </div>
              </div>
              <div class="dict-meaning" style="margin-top: 0.4rem;">
                ${b.m || b.meaning || b.native || ''}
              </div>
              ${b.example ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">"${b.example}"</div>` : ''}
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  removeMistakeItem(id) {
    window.soundEngine.click();
    window.storageManager.removeMistake(id);
    this.updateBadges();
    this.openVault('mistakes');
    this.showToast('已移出錯題本');
  }

  removeBookmarkItem(identifier) {
    window.soundEngine.click();
    window.storageManager.toggleBookmark({ w: identifier, id: identifier });
    this.updateBadges();
    this.openVault('bookmarks');
    this.showToast('已取消收藏');
  }

  toggleBookmarkWord(wordText, btnElement) {
    window.soundEngine.click();
    const item = this.geptData.find(d => d.w === wordText) || { w: wordText };
    const isAdded = window.storageManager.toggleBookmark(item);
    if (btnElement) {
      if (isAdded) btnElement.classList.add('bookmarked');
      else btnElement.classList.remove('bookmarked');
    }
    this.updateBadges();
    this.showToast(isAdded ? `已收藏單字：${wordText}` : `已取消收藏：${wordText}`);
  }

  toggleBookmarkIdiom(idiomId, btnElement) {
    window.soundEngine.click();
    const item = this.practiceData.nativeExpressions.find(d => d.id === idiomId) || { id: idiomId };
    const isAdded = window.storageManager.toggleBookmark(item);
    if (btnElement) {
      if (isAdded) btnElement.classList.add('bookmarked');
      else btnElement.classList.remove('bookmarked');
    }
    this.updateBadges();
    this.showToast(isAdded ? `已收藏地道片語！` : `已取消收藏！`);
  }

  // ==========================================
  // 🏆 Mastery Toast Notification (答題後熟練度提示)
  // ==========================================
  showMasteryToast(word, stars, justMastered) {
    const starInfo = window.storageManager.MASTERY_STARS[stars];
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.style.cssText = `
      border-color: ${justMastered ? '#f59e0b' : '#6366f1'};
      background: ${justMastered ? 'rgba(30, 20, 0, 0.92)' : 'rgba(15, 23, 42, 0.92)'};
      font-size: 0.9rem;
    `;

    if (justMastered) {
      toast.innerHTML = `
        <span style="font-size: 1.3rem;">⭐</span>
        <div>
          <div style="font-weight: 800; color: #fbbf24;">${word} — 完全精通！</div>
          <div style="font-size: 0.78rem; color: #fcd34d;">5 次連續答對，已解鎖進圖鑑！🎉</div>
        </div>
      `;
    } else {
      const starsHtml = window.storageManager.getStarsHTML(stars);
      toast.innerHTML = `
        <span>${starInfo.emoji}</span>
        <div>
          <div style="font-weight: 700; color: #e2e8f0;">${word}</div>
          <div style="font-size: 0.78rem; color: #94a3b8;">${starsHtml} ${starInfo.label}</div>
        </div>
      `;
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, justMastered ? 3500 : 1800);
  }

  // ==========================================
  // 🗺️ Knowledge Map / Mastery Pokédex (知識圖鑑)
  // ==========================================
  loadMasteryMap() {
    this.masteryFilter = this.masteryFilter || 'all';
    this.masterySearch = this.masterySearch || '';
    this.masteryTabFilter = this.masteryTabFilter || 'all_seen'; // 'all_seen' | 'mastered' | 'in_progress'
    this._renderMasteryMap();
  }

  _renderMasteryMap() {
    const stats = window.storageManager.getMasteryStats('all');
    const geptTotal = this.geptData.length;
    const masteryPct = geptTotal > 0 ? Math.round((stats.mastered / geptTotal) * 100) : 0;
    const seenPct = geptTotal > 0 ? Math.round((stats.seen / geptTotal) * 100) : 0;
    const area = document.getElementById('mastery-content-area');

    area.innerHTML = `
      <!-- ===== STATS DASHBOARD ===== -->
      <div class="mastery-stats-dashboard">

        <!-- Overview Ring Stats -->
        <div class="mastery-overview-row">
          <div class="mastery-ring-card">
            <svg class="ring-svg" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" stroke-width="8"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke="#f59e0b" stroke-width="8"
                stroke-dasharray="${(masteryPct / 100) * 201} 201"
                stroke-dashoffset="50" stroke-linecap="round"/>
            </svg>
            <div class="ring-center-text">
              <div class="ring-pct">${masteryPct}%</div>
              <div class="ring-label">已精通</div>
            </div>
            <div class="ring-card-title">⭐ 完全精通</div>
            <div class="ring-card-count">${stats.mastered} / ${geptTotal} 個單字</div>
          </div>

          <div class="mastery-ring-card" style="--ring-color: #818cf8;">
            <svg class="ring-svg" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" stroke-width="8"/>
              <circle cx="40" cy="40" r="32" fill="none" stroke="#818cf8" stroke-width="8"
                stroke-dasharray="${(seenPct / 100) * 201} 201"
                stroke-dashoffset="50" stroke-linecap="round"/>
            </svg>
            <div class="ring-center-text">
              <div class="ring-pct" style="color: #818cf8;">${seenPct}%</div>
              <div class="ring-label">已接觸</div>
            </div>
            <div class="ring-card-title">📖 練習中</div>
            <div class="ring-card-count">${stats.seen} / ${geptTotal} 個單字</div>
          </div>

          <!-- Star-level breakdown bar -->
          <div class="mastery-breakdown-card">
            <div class="breakdown-title">熟練度分佈</div>
            ${window.storageManager.MASTERY_STARS.slice(1).map((s, i) => {
              const count = stats.counts[s.stars] || 0;
              const pct = stats.total > 0 ? Math.round((count / Math.max(1, stats.total)) * 100) : 0;
              return `
                <div class="breakdown-row">
                  <span class="breakdown-emoji">${s.emoji}</span>
                  <span class="breakdown-label">${s.label}</span>
                  <div class="breakdown-bar-bg">
                    <div class="breakdown-bar-fill" style="width: ${pct}%; background: ${s.color};"></div>
                  </div>
                  <span class="breakdown-count">${count}</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Quick Stats -->
          <div class="mastery-quickstats-card">
            <div class="breakdown-title">📊 學習統計</div>
            <div class="quickstat-row"><span>總練習次數</span><strong>${Object.values(window.storageManager.mastery).reduce((s, e) => s + (e.totalSeen || 0), 0)}</strong></div>
            <div class="quickstat-row"><span>累積答對</span><strong style="color: #34d399;">${Object.values(window.storageManager.mastery).reduce((s, e) => s + (e.totalCorrect || 0), 0)}</strong></div>
            <div class="quickstat-row"><span>累積答錯</span><strong style="color: #fb7185;">${Object.values(window.storageManager.mastery).reduce((s, e) => s + (e.totalWrong || 0), 0)}</strong></div>
            <div class="quickstat-row"><span>進行中 (1-4⭐)</span><strong style="color: #818cf8;">${stats.inProgress}</strong></div>
            <div class="quickstat-row"><span>尚未見過</span><strong style="color: #475569;">${geptTotal - stats.seen}</strong></div>
            <div class="quickstat-row"><span>精通比例</span><strong style="color: #f59e0b;">${masteryPct}%</strong></div>
          </div>
        </div>

        <!-- Filter Tabs & Search -->
        <div class="mastery-filter-bar">
          <div class="mastery-tab-group">
            <button class="mastery-tab ${this.masteryTabFilter === 'all_seen' ? 'active' : ''}"
              onclick="app.setMasteryTab('all_seen')">📋 全部已接觸 (${stats.seen})</button>
            <button class="mastery-tab ${this.masteryTabFilter === 'mastered' ? 'active' : ''}"
              onclick="app.setMasteryTab('mastered')">⭐ 已精通 (${stats.mastered})</button>
            <button class="mastery-tab ${this.masteryTabFilter === 'in_progress' ? 'active' : ''}"
              onclick="app.setMasteryTab('in_progress')">🔥 進行中 (${stats.inProgress})</button>
          </div>
          <div class="mastery-level-filter">
            <button class="filter-pill-btn ${this.masteryFilter === 'all' ? 'active' : ''}"
              onclick="app.setMasteryFilter('all')">全部</button>
            <button class="filter-pill-btn ${this.masteryFilter === '中高級' ? 'active' : ''}"
              onclick="app.setMasteryFilter('中高級')">中高級</button>
            <button class="filter-pill-btn ${this.masteryFilter === '中級' ? 'active' : ''}"
              onclick="app.setMasteryFilter('中級')">中級</button>
            <button class="filter-pill-btn ${this.masteryFilter === '初級' ? 'active' : ''}"
              onclick="app.setMasteryFilter('初級')">初級</button>
          </div>
          <input type="text" class="dict-input" placeholder="🔍 搜尋已練習的單字..."
            value="${this.masterySearch || ''}"
            oninput="app.setMasterySearch(this.value)"
            style="max-width: 260px;">
        </div>
      </div>

      <!-- ===== POKÉDEX GRID ===== -->
      <div id="mastery-grid-container">
        ${this._buildMasteryGrid(stats)}
      </div>
    `;
  }

  _buildMasteryGrid(stats) {
    // Determine which entries to show based on tab
    let entries = stats.entries;

    if (this.masteryTabFilter === 'mastered') {
      entries = stats.masteredList;
    } else if (this.masteryTabFilter === 'in_progress') {
      entries = stats.inProgressList;
    }

    // Apply level filter
    if (this.masteryFilter !== 'all') {
      entries = entries.filter(e => e.level === this.masteryFilter);
    }

    // Apply search
    if (this.masterySearch) {
      const q = this.masterySearch.toLowerCase();
      entries = entries.filter(e =>
        (e.word || e.key || '').toLowerCase().includes(q) ||
        (e.meaning || '').toLowerCase().includes(q)
      );
    }

    if (entries.length === 0) {
      return `
        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🌑</div>
          <h3 style="color: var(--text-primary);">這裡還沒有記錄</h3>
          <p>去完成「⚡ 60秒詞彙狂飆」或其他練習，單字就會在這裡留下痕跡！</p>
          <button class="btn-primary" style="margin-top: 1.5rem;" onclick="app.startMode('blitz')">⚡ 立即開始練習</button>
        </div>
      `;
    }

    return `
      <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1rem;">
        顯示 ${entries.length} 個字詞記錄
      </div>
      <div class="mastery-pokemon-grid">
        ${entries.map(entry => this._buildMasteryCard(entry)).join('')}
      </div>
    `;
  }

  _buildMasteryCard(entry) {
    const stars = entry.stars || 0;
    const starInfo = window.storageManager.MASTERY_STARS[stars];
    const streak = entry.streak || 0;
    const starsHtml = window.storageManager.getStarsHTML(stars);
    const isMastered = stars >= 5;
    const accuracy = entry.totalSeen > 0
      ? Math.round((entry.totalCorrect / entry.totalSeen) * 100)
      : 0;

    // Progress towards mastery: streak / 5
    const progressPct = Math.min(100, (streak / 5) * 100);

    return `
      <div class="mastery-card ${isMastered ? 'mastered' : ''}" style="--card-accent: ${starInfo.color};"
        title="${entry.word || entry.key}: ${entry.meaning || ''} | ${starInfo.label}">

        <!-- Glow badge on mastered -->
        ${isMastered ? '<div class="mastered-badge">⭐ 精通</div>' : ''}

        <!-- Star level icon -->
        <div class="mastery-card-icon" style="color: ${starInfo.color};">
          ${starInfo.emoji}
        </div>

        <!-- Word -->
        <div class="mastery-card-word">${entry.word || entry.key}</div>

        <!-- Stars row -->
        <div class="mastery-card-stars">${starsHtml}</div>

        <!-- Meaning (short) -->
        <div class="mastery-card-meaning">${(entry.meaning || '').slice(0, 22)}${(entry.meaning || '').length > 22 ? '…' : ''}</div>

        <!-- Progress bar toward next mastery level -->
        <div class="mastery-card-progress-bg">
          <div class="mastery-card-progress-fill" style="width: ${progressPct}%; background: ${starInfo.color};"></div>
        </div>

        <!-- Stats mini row -->
        <div class="mastery-card-stats">
          <span title="連續答對次數">🔥${streak}/5</span>
          <span title="答題準確率" style="color: ${accuracy >= 70 ? '#34d399' : '#fb7185'};">${accuracy}%</span>
          <button class="tool-mini-btn" style="height: 22px; width: 22px; font-size: 0.75rem;"
            onclick="window.speechEngine.speak('${(entry.word || entry.key || '').replace(/'/g, "\\'")}')">🔊</button>
        </div>
      </div>
    `;
  }

  setMasteryTab(tab) {
    window.soundEngine.click();
    this.masteryTabFilter = tab;
    this._renderMasteryMap();
  }

  setMasteryFilter(level) {
    window.soundEngine.click();
    this.masteryFilter = level;
    this._renderMasteryMap();
  }

  setMasterySearch(query) {
    this.masterySearch = query;
    this._renderMasteryMap();
  }
}

// Instantiate and expose globally
window.addEventListener('DOMContentLoaded', () => {
  window.app = new LinguaPulseApp();
});

