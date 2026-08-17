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
      { lvl: 1, title: "English Explorer (英語探索者)", minXp: 0, badge: "🌱", toeic: "TOEIC 400" },
      { lvl: 2, title: "Sentence Builder (語感啟蒙)", minXp: 100, badge: "🧩", toeic: "TOEIC 550" },
      { lvl: 3, title: "Fluent Rookie (初露鋒芒)", minXp: 250, badge: "⚡", toeic: "TOEIC 650 (GEPT初級)" },
      { lvl: 4, title: "Workplace Communicator (職場實戰)", minXp: 500, badge: "💼", toeic: "TOEIC 750 (GEPT中級)" },
      { lvl: 5, title: "TOEIC Blue Star (藍證菁英)", minXp: 850, badge: "🔷", toeic: "TOEIC 800" },
      { lvl: 6, title: "TOEIC Gold Aspirant (金證獵手)", minXp: 1300, badge: "🏅", toeic: "TOEIC 860+ (金證起步)" },
      { lvl: 7, title: "GEPT High-Intermediate (中高級達人)", minXp: 1900, badge: "💎", toeic: "TOEIC 900+ (GEPT中高)" },
      { lvl: 8, title: "Executive Communicator (高管商務家)", minXp: 2700, badge: "👑", toeic: "TOEIC 950+" },
      { lvl: 9, title: "Near-Native Fluency (神級語感)", minXp: 3700, badge: "🔥", toeic: "TOEIC 980+" },
      { lvl: 10, title: "Native Master Mind (母語頂峰大師)", minXp: 5000, badge: "🌌", toeic: "TOEIC 990 滿分" }
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

    this.checkAndUpdateStreak();
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
    this.userData.xp += points;
    this.userData.totalPractices += 1;
    if (isCorrect) this.userData.correctCount += 1;
    this.userData.dailyPractices += 1;

    const today = new Date().toISOString().split('T')[0];
    this.userData.lastActiveDate = today;

    const newLevelInfo = this.getLevelInfo(this.userData.xp);
    const leveledUp = newLevelInfo.lvl > prevLevel;

    this.saveUserData();

    return {
      addedXp: points,
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
    // item: { type, question, yourAnswer, correctAnswer, explanation, date }
    const exists = this.mistakes.find(m => m.id === item.id || (m.question === item.question && m.type === item.type));
    if (!exists) {
      item.savedAt = new Date().toLocaleDateString();
      this.mistakes.unshift(item);
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
  // 🏆 Mastery Tracking System (知識圖鑑熟練度)
  // =============================================

  /**
   * Record an answer for a vocabulary/practice item.
   * @param {string} key   - Unique identifier (word or item id)
   * @param {boolean} correct - Whether the user answered correctly
   * @param {object} meta  - { word, meaning, pos, level, type } for display
   * @returns {{ newStars, prevStars, justMastered, currentStreak }}
   */
  recordAnswer(key, correct, meta = {}) {
    if (!this.mastery[key]) {
      this.mastery[key] = {
        stars: 0,
        streak: 0,       // current consecutive correct streak
        totalSeen: 0,
        totalCorrect: 0,
        totalWrong: 0,
        masteredAt: null,
        lastSeen: null,
        ...meta           // word, meaning, pos, level, type
      };
    }

    const entry = this.mastery[key];
    const prevStars = entry.stars;
    entry.totalSeen += 1;
    entry.lastSeen = new Date().toISOString();

    if (correct) {
      entry.totalCorrect += 1;
      entry.streak = (entry.streak || 0) + 1;

      // Stars increase with each correct up to the required streak
      const newStars = Math.min(this.MASTERY_REQUIRED_STREAK, entry.streak);
      entry.stars = newStars;

      if (newStars >= this.MASTERY_REQUIRED_STREAK && prevStars < this.MASTERY_REQUIRED_STREAK) {
        entry.masteredAt = new Date().toISOString();
      }
    } else {
      entry.totalWrong += 1;
      // Reset streak on wrong; drop 1 star (minimum 1 if already seen, 0 if never correct)
      entry.streak = 0;
      if (entry.stars > 1) {
        entry.stars = entry.stars - 1;
      } else if (entry.stars === 1) {
        entry.stars = 1; // stay at 1, don't drop to 0 once seen
      } else {
        entry.stars = 1; // first interaction but wrong - mark as seen
      }
      entry.masteredAt = null; // un-master if wrong after mastery
    }

    this.saveJSON(this.KEY_MASTERY, this.mastery);

    return {
      newStars: entry.stars,
      prevStars,
      justMastered: entry.stars >= this.MASTERY_REQUIRED_STREAK && prevStars < this.MASTERY_REQUIRED_STREAK,
      currentStreak: entry.streak
    };
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
