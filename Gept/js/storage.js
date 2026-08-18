// Storage and Gamification Manager for LinguaPulse
// Manages XP, Levels, Streaks, Mistake Vault, Bookmarks, User History & Mastery Tracker

class StorageManager {
  constructor() {
    this.KEY_DATA = 'linguapulse_user_data';
    this.KEY_MISTAKES = 'linguapulse_mistakes';
    this.KEY_BOOKMARKS = 'linguapulse_bookmarks';
    this.KEY_SETTINGS = 'linguapulse_settings';
    this.KEY_MASTERY = 'linguapulse_mastery';

    // Mastery config: 5 consecutive correct = mastered, wrong = drop 1 level (min 1)
    this.MASTERY_REQUIRED_STREAK = 5;
    this.MASTERY_STARS = [
      { stars: 0, label: '未見過',   emoji: '🌑', color: '#334155', desc: '從未練習過這個單字' },
      { stars: 1, label: '初次接觸', emoji: '🌒', color: '#64748b', desc: '見過 1 次，還很陌生' },
      { stars: 2, label: '初步認識', emoji: '🌓', color: '#818cf8', desc: '連續答對 2 次，逐漸熟悉中' },
      { stars: 3, label: '熟悉中',   emoji: '🌔', color: '#a78bfa', desc: '連續答對 3 次，記憶成形' },
      { stars: 4, label: '掌握中',   emoji: '🌕', color: '#fbbf24', desc: '連續答對 4 次，幾乎掌握！' },
      { stars: 5, label: '已精通',   emoji: '⭐', color: '#f59e0b', desc: '連續答對 5 次，完全掌握！' }
    ];

    this.LEVEL_RANKS = [
      { lvl: 1, title: "English Explorer (英語探索者)", minXp: 0, badge: "🌱", toeic: "TOEIC 350~450 (初級啟蒙)" },
      { lvl: 2, title: "Sentence Builder (語感啟蒙)", minXp: 1000, badge: "🧩", toeic: "TOEIC 450~550 (基礎穩固)" },
      { lvl: 3, title: "Fluent Rookie (初露鋒芒)", minXp: 3000, badge: "⚡", toeic: "TOEIC 550~650 (綠證門檻)" },
      { lvl: 4, title: "Workplace Communicator (職場實戰)", minXp: 7000, badge: "💼", toeic: "TOEIC 650~750 (藍證門檻)" },
      { lvl: 5, title: "Advanced Specialist (進階專家)", minXp: 14000, badge: "🔷", toeic: "TOEIC 750~850 (GEPT中級高標)" },
      { lvl: 6, title: "TOEIC Gold Aspirant (金證獵手)", minXp: 25000, badge: "🏅", toeic: "TOEIC 860+ (金色證書起步)" },
      { lvl: 7, title: "GEPT High-Intermediate (中高級達人)", minXp: 40000, badge: "💎", toeic: "TOEIC 900+ (GEPT中高級)" },
      { lvl: 8, title: "Executive Communicator (高管商務家)", minXp: 55000, badge: "👑", toeic: "TOEIC 950+ (頂尖高管)" },
      { lvl: 9, title: "Near-Native Fluency (神級語感)", minXp: 70000, badge: "🔥", toeic: "TOEIC 980+ (母語流利)" },
      { lvl: 10, title: "Native Master Mind (母語頂峰大師)", minXp: 88000, badge: "🌌", toeic: "TOEIC 990 滿分 ✕ 全庫支配" }
    ];

    this.init();
  }

  init() {
    this.userData = this.loadJSON(this.KEY_DATA, {
      xp: 0,
      totalPractices: 0,
      correctCount: 0,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyPractices: 0,
      dailyGoal: 3,
      history: []
    });

    this.KEY_JOURNEY = 'linguapulse_journey_progress';

    this.mistakes = this.loadJSON(this.KEY_MISTAKES, []);
    this.bookmarks = this.loadJSON(this.KEY_BOOKMARKS, []);
    this.settings = this.loadJSON(this.KEY_SETTINGS, {
      difficulty: '中高級',
      soundFx: true,
      speechSpeed: 1.0,
      voiceAccent: 'en-US'
    });
    // mastery: { [wordKey]: { stars, streak, totalSeen, totalCorrect, totalWrong, masteredAt, lastSeen } }
    this.mastery = this.loadJSON(this.KEY_MASTERY, {});
    // journey: { currentStageId: 't1_s1', stages: { 't1_s1': { progress: 0, completed: false }, ... } }
    this.journey = this.loadJSON(this.KEY_JOURNEY, {
      currentStageId: 't1_s1',
      stages: {}
    });

    this.checkAndUpdateStreak();
  }

  saveJourney() {
    this.saveJSON(this.KEY_JOURNEY, this.journey);
  }

  getJourneyProgress() {
    return this.journey;
  }

  getAllJourneyStagesList() {
    if (!window.JOURNEY_TIERS) return [];
    const list = [];
    window.JOURNEY_TIERS.forEach(t => {
      t.stages.forEach(s => {
        list.push({ ...s, tierTitle: t.title, tierRank: t.targetRank });
      });
    });
    return list;
  }

  recordJourneyAction(stageMode, isCorrect = true, explicitStageId = null) {
    const allStages = this.getAllJourneyStagesList();
    if (!allStages || allStages.length === 0) return { passed: false, targetGoal: 80 };

    // 優先使用指定關卡或當前挑戰關卡
    let targetStage = null;
    if (explicitStageId) {
      targetStage = allStages.find(s => s.id === explicitStageId);
    }
    if (!targetStage) {
      const currentStageId = this.journey.currentStageId || allStages[0].id;
      targetStage = allStages.find(s => s.id === currentStageId);
    }
    // 若當前關卡模式不符，則自動尋找最接近該模式的未完成關卡
    if (!targetStage || (stageMode && targetStage.mode !== stageMode)) {
      targetStage = allStages.find(s => s.mode === stageMode && !this.journey.stages[s.id]?.completed) || allStages.find(s => s.mode === stageMode) || allStages[0];
    }
    if (!targetStage) return { passed: false, targetGoal: 80 };

    if (!this.journey.stages[targetStage.id]) {
      this.journey.stages[targetStage.id] = { progress: 0, completed: false, currentStreak: 0, maxStreak: 0 };
    }

    const stageData = this.journey.stages[targetStage.id];
    
    if (isCorrect) {
      stageData.currentStreak = (stageData.currentStreak || 0) + 1;
      stageData.progress = stageData.currentStreak;
      if (stageData.currentStreak > (stageData.maxStreak || 0)) {
        stageData.maxStreak = stageData.currentStreak;
      }
    } else {
      // 答錯連擊歸零（考驗真正連續掌握度）
      stageData.currentStreak = 0;
      stageData.progress = 0;
    }

    let justPassed = false;
    if (stageData.progress >= targetStage.targetGoal && !stageData.completed) {
      stageData.completed = true;
      justPassed = true;
      // Unlock next stage in sequence
      const currentIndex = allStages.findIndex(s => s.id === targetStage.id);
      if (currentIndex !== -1 && currentIndex + 1 < allStages.length) {
        this.journey.currentStageId = allStages[currentIndex + 1].id;
      }
    }

    this.saveJourney();
    return {
      justPassed,
      isCorrect,
      stage: targetStage,
      currentStreak: stageData.currentStreak || 0,
      currentProgress: stageData.progress,
      targetGoal: targetStage.targetGoal,
      remaining: Math.max(0, targetStage.targetGoal - stageData.progress),
      nextStageId: this.journey.currentStageId
    };
  }

  loadJSON(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn('LocalStorage parse error:', e);
      return defaultVal;
    }
  }

  saveJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  saveUserData() {
    this.saveJSON(this.KEY_DATA, this.userData);
  }

  checkAndUpdateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const lastDate = this.userData.lastActiveDate;

    if (!lastDate) {
      this.userData.lastActiveDate = today;
      this.userData.streak = 1;
      this.userData.dailyPractices = 0;
      this.saveUserData();
      return;
    }

    if (lastDate === today) {
      // Same day, streak already counted
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastDate === yesterdayStr) {
      // Active yesterday, maintain and increment streak on next activity
      this.userData.dailyPractices = 0;
    } else {
      // Missed at least one day, reset streak to 1
      this.userData.streak = 1;
      this.userData.dailyPractices = 0;
    }

    this.userData.lastActiveDate = today;
    this.saveUserData();
  }

  addXP(points, isCorrect = true) {
    const prevLevel = this.getLevelInfo(this.userData.xp).lvl;
    
    if (isCorrect) {
      this.userData.xp += points;
      this.userData.correctCount += 1;
    } else {
      // 答錯失誤扣減經驗值（底線為 0），確保每 1 點經驗值都貨真價實
      this.userData.xp = Math.max(0, this.userData.xp - Math.abs(points));
    }
    
    this.userData.totalPractices += 1;
    this.userData.dailyPractices += 1;

    const today = new Date().toISOString().split('T')[0];
    this.userData.lastActiveDate = today;

    const newLevelInfo = this.getLevelInfo(this.userData.xp);
    const leveledUp = newLevelInfo.lvl > prevLevel;

    this.saveUserData();

    return {
      addedXp: isCorrect ? points : -Math.abs(points),
      totalXp: this.userData.xp,
      levelInfo: newLevelInfo,
      leveledUp
    };
  }

  getLevelInfo(xp = this.userData.xp) {
    let currentRank = this.LEVEL_RANKS[0];
    let nextRank = this.LEVEL_RANKS[1];

    for (let i = this.LEVEL_RANKS.length - 1; i >= 0; i--) {
      if (xp >= this.LEVEL_RANKS[i].minXp) {
        currentRank = this.LEVEL_RANKS[i];
        nextRank = this.LEVEL_RANKS[i + 1] || null;
        break;
      }
    }

    let progressPercent = 100;
    if (nextRank) {
      const currentLevelBase = currentRank.minXp;
      const nextLevelBase = nextRank.minXp;
      progressPercent = Math.min(100, Math.max(0, Math.round(((xp - currentLevelBase) / (nextLevelBase - currentLevelBase)) * 100)));
    }

    return {
      ...currentRank,
      nextRank,
      progressPercent
    };
  }

  // Mistake Vault management
  addMistake(item) {
    // item: { id, type, question, yourAnswer, correctAnswer, explanation, targetWord }
    const exists = this.mistakes.find(m => m.id === item.id || (m.question === item.question && m.type === item.type));
    if (!exists) {
      item.savedAt = new Date().toLocaleDateString();
      item.wrongCount = 1;
      this.mistakes.unshift(item);
    } else {
      exists.wrongCount = (exists.wrongCount || 1) + 1;
      exists.lastWrongAt = new Date().toLocaleDateString();
    }
    this.saveJSON(this.KEY_MISTAKES, this.mistakes);
  }

  // 檢查並在完全精通 (5★) 時自動將該單字/題目從錯題庫中安全畢業移除
  checkAndGraduateMasteredMistakes() {
    const beforeCount = this.mistakes.length;
    this.mistakes = this.mistakes.filter(m => {
      if (m.targetWord && this.mastery[m.targetWord]) {
        // 如果該單字在外面的正規練習中已經達到 5 星（完全精通），才准許從錯題庫移除！
        return this.mastery[m.targetWord].stars < this.MASTERY_REQUIRED_STREAK;
      }
      return true;
    });
    if (this.mistakes.length !== beforeCount) {
      this.saveJSON(this.KEY_MISTAKES, this.mistakes);
    }
  }

  removeMistake(id) {
    this.mistakes = this.mistakes.filter(m => m.id !== id);
    this.saveJSON(this.KEY_MISTAKES, this.mistakes);
  }

  clearMistakes() {
    this.mistakes = [];
    this.saveJSON(this.KEY_MISTAKES, this.mistakes);
  }

  // Bookmarks / Word Bank management
  toggleBookmark(item) {
    const idx = this.bookmarks.findIndex(b => b.w === item.w || b.id === item.id);
    if (idx >= 0) {
      this.bookmarks.splice(idx, 1);
      this.saveJSON(this.KEY_BOOKMARKS, this.bookmarks);
      return false; // Removed
    } else {
      item.bookmarkedAt = new Date().toLocaleDateString();
      this.bookmarks.unshift(item);
      this.saveJSON(this.KEY_BOOKMARKS, this.bookmarks);
      return true; // Added
    }
  }

  isBookmarked(identifier) {
    return this.bookmarks.some(b => b.w === identifier || b.id === identifier);
  }

  // Settings
  updateSetting(key, val) {
    this.settings[key] = val;
    this.saveJSON(this.KEY_SETTINGS, this.settings);
  }

  // =============================================
  // 🏆 Dual-Direction Mastery Tracking System (雙向雙考驗精通引擎)
  // =============================================

  /**
   * Record a dual-direction answer for a vocabulary item.
   * A word ONLY becomes 5★ Mastered when BOTH English->Chinese (enToZh) and Chinese->English (zhToEn) are verified!
   * @param {string} key - Unique identifier (word)
   * @param {boolean} correct - Whether user answered correctly
   * @param {string} direction - 'enToZh' (看英選/填中) | 'zhToEn' (看中選/填英)
   * @param {object} meta - { word, meaning, pos, level, type }
   */
  recordDualAnswer(key, correct, direction = 'enToZh', meta = {}) {
    if (!this.mastery[key]) {
      this.mastery[key] = {
        stars: 0,
        streak: 0,
        enToZhCorrect: 0,
        zhToEnCorrect: 0,
        totalSeen: 0,
        totalCorrect: 0,
        totalWrong: 0,
        masteredAt: null,
        lastSeen: null,
        ...meta
      };
    }

    const entry = this.mastery[key];
    const prevStars = entry.stars || 0;
    entry.totalSeen += 1;
    entry.lastSeen = new Date().toISOString();

    if (correct) {
      entry.totalCorrect += 1;
      entry.streak = (entry.streak || 0) + 1;

      if (direction === 'enToZh') {
        entry.enToZhCorrect = (entry.enToZhCorrect || 0) + 1;
      } else {
        entry.zhToEnCorrect = (entry.zhToEnCorrect || 0) + 1;
      }

      // 星級評定階梯：
      // 1★: 接觸答對 1 次
      // 2★: 單向連續答對 2 次
      // 3★: 單向連續答對 3 次
      // 4★: 雙向皆有答對記錄 (enToZh >= 1 且 zhToEn >= 1) 且 streak >= 4
      // 5★ (完全精通): 雙向各至少答對 2 次以上且 streak >= 5
      let newStars = 1;
      if (entry.streak >= 2) newStars = 2;
      if (entry.streak >= 3) newStars = 3;
      if (entry.streak >= 4 && (entry.enToZhCorrect >= 1 && entry.zhToEnCorrect >= 1)) newStars = 4;
      if (entry.streak >= 5 && (entry.enToZhCorrect >= 2 && entry.zhToEnCorrect >= 2)) newStars = 5;

      entry.stars = newStars;

      if (newStars >= 5 && prevStars < 5) {
        entry.masteredAt = new Date().toISOString();
        this.checkAndGraduateMasteredMistakes();
      }
    } else {
      entry.totalWrong += 1;
      entry.streak = 0;
      // 答錯降星
      if (entry.stars > 1) {
        entry.stars = entry.stars - 1;
      } else {
        entry.stars = 1;
      }
      entry.masteredAt = null;
    }

    this.saveJSON(this.KEY_MASTERY, this.mastery);

    return {
      newStars: entry.stars,
      prevStars,
      justMastered: entry.stars >= 5 && prevStars < 5,
      currentStreak: entry.streak,
      enToZhCorrect: entry.enToZhCorrect,
      zhToEnCorrect: entry.zhToEnCorrect
    };
  }

  // Compatible wrapper
  recordAnswer(key, correct, meta = {}) {
    return this.recordDualAnswer(key, correct, meta.direction || 'enToZh', meta);
  }

  /**
   * Get mastery info for a single key.
   */
  getMasteryInfo(key) {
    const entry = this.mastery[key];
    if (!entry) return { stars: 0, streak: 0, totalSeen: 0, totalCorrect: 0, totalWrong: 0 };
    return entry;
  }

  /**
   * Get aggregated mastery statistics for the knowledge map UI.
   * @param {string} levelFilter - '中高級' | '中級' | '初級' | 'all'
   * @returns stats object with counts and full entry list
   */
  getMasteryStats(levelFilter = 'all') {
    const allKeys = Object.keys(this.mastery);
    let entries = allKeys.map(k => ({ key: k, ...this.mastery[k] }));

    if (levelFilter !== 'all') {
      entries = entries.filter(e => e.level === levelFilter);
    }

    const counts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    entries.forEach(e => { counts[e.stars] = (counts[e.stars] || 0) + 1; });

    const mastered = entries.filter(e => e.stars >= 5);
    const inProgress = entries.filter(e => e.stars > 0 && e.stars < 5);
    const notSeen = entries.filter(e => e.stars === 0);

    return {
      total: entries.length,
      mastered: mastered.length,
      inProgress: inProgress.length,
      seen: inProgress.length + mastered.length,
      counts,
      entries: entries.sort((a, b) => b.stars - a.stars || b.totalSeen - a.totalSeen),
      masteredList: mastered,
      inProgressList: inProgress
    };
  }

  /**
   * Get star display HTML for a given star count.
   */
  getStarsHTML(stars) {
    return Array.from({ length: 5 }, (_, i) =>
      `<span style="color: ${i < stars ? '#f59e0b' : '#334155'}; font-size: 0.75rem;">★</span>`
    ).join('');
  }

  /**
   * Smart picker: prioritise items with lower mastery to show more often.
   * Returns a weighted random item from pool (GEPT data array).
   */
  pickWeightedItem(pool) {
    if (!pool || pool.length === 0) return null;
    // Build weights: lower stars = higher weight to appear more often
    const weights = pool.map(item => {
      const key = item.w || item.id;
      const stars = this.mastery[key]?.stars ?? 0;
      // Stars 0 -> weight 8, 1 -> 6, 2 -> 4, 3 -> 3, 4 -> 2, 5 -> 1
      return Math.max(1, 9 - stars * 1.5);
    });
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalWeight;
    for (let i = 0; i < pool.length; i++) {
      rand -= weights[i];
      if (rand <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }
}

window.storageManager = new StorageManager();
