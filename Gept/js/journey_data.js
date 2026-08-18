// LinguaPulse 8-Tier Grand English Mastery Campaign (頂峰大師 8 大精細段位體系)
// 涵蓋多益 350 ~ 990 滿分、GEPT 初級至中高級之完整段位晉級考驗

window.JOURNEY_TIERS = [
  {
    tier: 1,
    title: "🌱 段位 I：青銅探索者 (Bronze Explorer)",
    targetRank: "TOEIC 350~450 (GEPT 初級啟蒙)",
    desc: "打好第一步！從初級核心 2,385 詞庫中辨析 15 題、建立基本五大句型直覺與生活打招呼習慣用語。",
    stages: [
      {
        id: "t1_s1",
        name: "關卡 1-1：初級核心基礎詞彙 (15 題抽測)",
        mode: "blitz",
        targetGoal: 15,
        unitName: "題單字辨析",
        introTip: "專注於名詞與動詞的直覺反應，累積答對 15 題即可通關（進度隨時自動保存）！",
        rewardXP: 250
      },
      {
        id: "t1_s2",
        name: "關卡 1-2：主詞動詞一致與基本句型",
        mode: "grammar",
        targetGoal: 10,
        unitName: "題文法陷阱",
        introTip: "看清單複數主詞與對應動詞，穩固基本句構！",
        rewardXP: 300
      },
      {
        id: "t1_s3",
        name: "關卡 1-3：生活高頻破冰表達",
        mode: "native",
        targetGoal: 8,
        unitName: "個地道片語",
        introTip: "學習母語者生活中的高頻自然表達，告別生硬直翻。",
        rewardXP: 350
      }
    ]
  },
  {
    tier: 2,
    title: "🧩 段位 II：白銀啟蒙者 (Silver Builder)",
    targetRank: "TOEIC 450~550 (GEPT 初級穩固)",
    desc: "加強時態變化與被動語態！完成 20 題中初級詞彙抽測與發音跟讀啟蒙。",
    stages: [
      {
        id: "t2_s1",
        name: "關卡 2-1：初級高頻生活詞擴充",
        mode: "blitz",
        targetGoal: 20,
        unitName: "題單字辨析",
        introTip: "擴充生活情境、交通、餐飲高頻單字肌肉記憶！",
        rewardXP: 400
      },
      {
        id: "t2_s2",
        name: "關卡 2-2：被動語態與完成式時態",
        mode: "grammar",
        targetGoal: 12,
        unitName: "題文法考點",
        introTip: "掌握 have + p.p. 與 be + p.p. 的核心邏輯！",
        rewardXP: 450
      },
      {
        id: "t2_s3",
        name: "關卡 2-3：初級發音與單詞連音跟讀",
        mode: "echo",
        targetGoal: 6,
        unitName: "次發音評測",
        introTip: "大聲跟讀，訓練嘴部肌肉習慣英語發音節奏！",
        rewardXP: 450
      }
    ]
  },
  {
    tier: 3,
    title: "💼 段位 III：黃金溝通者 (Gold Communicator)",
    targetRank: "TOEIC 550~650 (GEPT 中級起步 / 綠證)",
    desc: "跨入職場與商務語境！解鎖中級 2,680 詞庫、掌握多益常見辦公室書信與轉折詞彙。",
    stages: [
      {
        id: "t3_s1",
        name: "關卡 3-1：初階商務與職場通用詞",
        mode: "blitz",
        targetGoal: 20,
        unitName: "題單字辨析",
        introTip: "掌握辦公室、會議、行政常考中級核心詞彙！",
        rewardXP: 550
      },
      {
        id: "t3_s2",
        name: "關卡 3-2：連接詞與副詞子句辨析",
        mode: "grammar",
        targetGoal: 15,
        unitName: "題語法陷阱",
        introTip: "辨析 although, despite, however 的用法與詞性！",
        rewardXP: 600
      },
      {
        id: "t3_s3",
        name: "關卡 3-3：1分鐘商務短篇微閱讀",
        mode: "reading",
        targetGoal: 5,
        unitName: "篇商業短文",
        introTip: "訓練快速掃讀公告與電子郵件抓取核心訊息！",
        rewardXP: 650
      }
    ]
  },
  {
    tier: 4,
    title: "🔷 段位 IV：白金職場菁英 (Platinum Professional)",
    targetRank: "TOEIC 650~750 (GEPT 中級 / 藍證門檻)",
    desc: "攻克中級商務考點字、外商會議高頻片語與 3 回合情境對決！",
    stages: [
      {
        id: "t4_s1",
        name: "關卡 4-1：中級商務與專業動詞深造",
        mode: "blitz",
        targetGoal: 25,
        unitName: "題單字辨析",
        introTip: "強化 allocate, accommodate, negotiate 等核心商務動詞！",
        rewardXP: 750
      },
      {
        id: "t4_s2",
        name: "關卡 4-2：職場慣用語與口語表達",
        mode: "native",
        targetGoal: 12,
        unitName: "個高階片語",
        introTip: "掌握 touch base, bite the bullet 等北美高頻俚語！",
        rewardXP: 800
      },
      {
        id: "t4_s3",
        name: "關卡 4-3：情境快打對決：紐約點餐與生活溝通",
        mode: "dialogue",
        targetGoal: 2,
        unitName: "場高分對決",
        introTip: "在真實咖啡點餐情境中選出最高情商母語句型！",
        rewardXP: 850
      }
    ]
  },
  {
    tier: 5,
    title: "💎 段位 V：藍鑽進階獵手 (Diamond Achiever)",
    targetRank: "TOEIC 750~850 (GEPT 中級高標)",
    desc: "直指金色證書門檻！中高級詞彙、假設語氣與科技趨勢深度短文。",
    stages: [
      {
        id: "t5_s1",
        name: "關卡 5-1：中高級過渡核心字庫",
        mode: "blitz",
        targetGoal: 30,
        unitName: "題單字辨析",
        introTip: "挑戰詞性多變與抽象商業名詞，提升反應速度！",
        rewardXP: 950
      },
      {
        id: "t5_s2",
        name: "關卡 5-2：假設語氣與要求建議動詞倒裝",
        mode: "grammar",
        targetGoal: 15,
        unitName: "題語法考點",
        introTip: "精通 recommend that S (should) V 與倒裝句型！",
        rewardXP: 1000
      },
      {
        id: "t5_s3",
        name: "關卡 5-3：商務談判與心理學深度微閱讀",
        mode: "reading",
        targetGoal: 6,
        unitName: "篇深度短文",
        introTip: "精準理解長難句與文章背後的邏輯推論文意！",
        rewardXP: 1050
      }
    ]
  },
  {
    tier: 6,
    title: "🏅 段位 VI：多益金證大師 (TOEIC Gold Master)",
    targetRank: "TOEIC 860~920 (GEPT 中高級 / 金證)",
    desc: "攻入 3,300+ 學術詞彙庫 (AWL)！金證字彙、分詞構句與高情商商務談判！",
    stages: [
      {
        id: "t6_s1",
        name: "關卡 6-1：AWL 學術與金證專屬詞庫",
        mode: "blitz",
        targetGoal: 35,
        unitName: "題單字辨析",
        introTip: "攻克 3,300 中高級學術字彙，消滅所有生疏詞！",
        rewardXP: 1200
      },
      {
        id: "t6_s2",
        name: "關卡 6-2：分詞構句與易混淆形容詞攻堅",
        mode: "grammar",
        targetGoal: 18,
        unitName: "題金證陷阱",
        introTip: "徹底搞懂 economical vs economic、分詞主被動關係！",
        rewardXP: 1300
      },
      {
        id: "t6_s3",
        name: "關卡 6-3：情境快打對決：外商主管會議高情商抗辯",
        mode: "dialogue",
        targetGoal: 2,
        unitName: "場滿分對決",
        introTip: "展現頂級商務情商，提出建設性替代方案！",
        rewardXP: 1400
      },
      {
        id: "t6_s4",
        name: "關卡 6-4：母語級語速影子跟讀評測",
        mode: "echo",
        targetGoal: 8,
        unitName: "次高分評測",
        introTip: "跟上 1.0x 標準母語語速，掌握連音與抑揚頓挫！",
        rewardXP: 1400
      }
    ]
  },
  {
    tier: 7,
    title: "👑 段位 VII：卓越高管領導 (Executive Leader)",
    targetRank: "TOEIC 920~970 (GEPT 中高級高標)",
    desc: "深度詞彙盲測、高階商務慣用語與國際酒會社交破冰全通關！",
    stages: [
      {
        id: "t7_s1",
        name: "關卡 7-1：中高級高階抽象詞彙大閱兵",
        mode: "blitz",
        targetGoal: 35,
        unitName: "題單字辨析",
        introTip: "在高壓隨機抽測下保持高精準度！",
        rewardXP: 1800
      },
      {
        id: "t7_s2",
        name: "關卡 7-2：外商高管與談判協商慣用語",
        mode: "native",
        targetGoal: 15,
        unitName: "個高階片語",
        introTip: "熟練掌握 see eye to eye, right up my alley 等高級表達！",
        rewardXP: 1900
      },
      {
        id: "t7_s3",
        name: "關卡 7-3：情境快打對決：國際科技酒會 Small Talk",
        mode: "dialogue",
        targetGoal: 3,
        unitName: "場完美交流",
        introTip: "自信主動建立跨國專業人脈連結與自然 Small Talk！",
        rewardXP: 2000
      }
    ]
  },
  {
    tier: 8,
    title: "🌌 段位 VIII：母語頂峰大師 (Native Master Mind)",
    targetRank: "TOEIC 990 滿分 ✕ 全量 8,365 詞庫完全支配",
    desc: "終極榮耀！從全量 8,365 詞庫盲測、高契合度母語發音跟讀與全情境大滿貫！",
    stages: [
      {
        id: "t8_s1",
        name: "關卡 8-1：全量 8,365 詞庫極限大亂鬥",
        mode: "blitz",
        targetGoal: 40,
        unitName: "題極限盲測",
        introTip: "挑戰全庫隨機盲測，直覺反應時間小於 1 秒！",
        rewardXP: 3000
      },
      {
        id: "t8_s2",
        name: "關卡 8-2：母語聲學音調與語流極限評測",
        mode: "echo",
        targetGoal: 10,
        unitName: "次頂尖跟讀",
        introTip: "發音契合度達 80% 以上，達到母語發音直覺！",
        rewardXP: 3200
      },
      {
        id: "t8_s3",
        name: "關卡 8-3：全情境快打對決大師終局之戰",
        mode: "dialogue",
        targetGoal: 3,
        unitName: "場完勝對決",
        introTip: "在所有職場、社交與談判對話中取得高分評價！",
        rewardXP: 4000
      }
    ]
  }
];
