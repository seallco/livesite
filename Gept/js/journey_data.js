// LinguaPulse 10-Tier Grand English Mastery Campaign (頂峰大師段位闖關體系)
// 涵蓋多益 400 ~ 990 滿分、GEPT 初級至中高級之完整段位晉級考驗

window.JOURNEY_TIERS = [
  {
    tier: 1,
    title: "🌱 段位 I：英語探索者 (English Explorer)",
    targetRank: "TOEIC 400~550 起步",
    desc: "踏出實力建立的第一步！打穩 30 個核心詞彙直覺與 10 組基礎句型。",
    stages: [
      {
        id: "t1_s1",
        name: "關卡 1-1：初級核心單字奠基",
        mode: "blitz",
        targetGoal: 30,
        unitName: "題單字辨析",
        introTip: "專注於詞性與字義的直覺反應，不要死背中文！",
        rewardXP: 150
      },
      {
        id: "t1_s2",
        name: "關卡 1-2：基礎句型與主動被動",
        mode: "grammar",
        targetGoal: 10,
        unitName: "題文法陷阱",
        introTip: "看清句子的主要主詞與動詞，拆解基本句子架構。",
        rewardXP: 200
      },
      {
        id: "t1_s3",
        name: "關卡 1-3：生活高頻習慣表達",
        mode: "native",
        targetGoal: 10,
        unitName: "個地道片語",
        introTip: "學習母語者生活中的高頻自然表達，告別生硬直翻。",
        rewardXP: 250
      }
    ]
  },
  {
    tier: 2,
    title: "💼 段位 II：職場實戰菁英 (Workplace Communicator)",
    targetRank: "TOEIC 650~750 (GEPT 中級)",
    desc: "進入商務與職場語境！擴充 50 個商用詞彙、破解多益必考陷阱與初階商務短文。",
    stages: [
      {
        id: "t2_s1",
        name: "關卡 2-1：中級商務與日常高頻詞",
        mode: "blitz",
        targetGoal: 50,
        unitName: "題單字辨析",
        introTip: "中級單字是職場溝通主力，注意動詞與名詞的詞性切換！",
        rewardXP: 300
      },
      {
        id: "t2_s2",
        name: "關卡 2-2：多益常考連接詞與假設語氣",
        mode: "grammar",
        targetGoal: 15,
        unitName: "題文法陷阱",
        introTip: "擊破多益 Part 5 最容易失分的轉折詞與假設倒裝陷阱。",
        rewardXP: 350
      },
      {
        id: "t2_s3",
        name: "關卡 2-3：2分鐘短篇商業微閱讀",
        mode: "reading",
        targetGoal: 5,
        unitName: "篇商業短文",
        introTip: "訓練快速掃讀首尾句抓取主旨與數據細節的能力！",
        rewardXP: 400
      },
      {
        id: "t2_s4",
        name: "關卡 2-4：職場標準語音連音跟讀",
        mode: "echo",
        targetGoal: 5,
        unitName: "次發音跟讀 (80%+)",
        introTip: "聽清楚連音（Linking Words）與重音，大聲自信跟讀！",
        rewardXP: 400
      }
    ]
  },
  {
    tier: 3,
    title: "🏅 段位 III：多益金證獵手 (TOEIC Gold Aspirant)",
    targetRank: "TOEIC 860+ 金證資格 (GEPT 中高級)",
    desc: "攻克 100 個高難度考點字、高情商商務談判慣用語與科技商業長文深度理解！",
    stages: [
      {
        id: "t3_s1",
        name: "關卡 3-1：GEPT 中高級 860+ 核心衝刺",
        mode: "blitz",
        targetGoal: 80,
        unitName: "題單字辨析",
        introTip: "直擊學術字彙（AWL）與高階抽象詞彙，強化大腦敏銳度！",
        rewardXP: 500
      },
      {
        id: "t3_s2",
        name: "關卡 3-2：金證專屬高難度語法攻堅",
        mode: "grammar",
        targetGoal: 20,
        unitName: "題語法考點",
        introTip: "分詞構句、倒裝句與易混淆形容詞的最後驗收！",
        rewardXP: 550
      },
      {
        id: "t3_s3",
        name: "關卡 3-3：商務談判與高情商習慣用語",
        mode: "native",
        targetGoal: 15,
        unitName: "個高階片語",
        introTip: "掌握外商主管常用俚語與委婉表達技巧。",
        rewardXP: 600
      },
      {
        id: "t3_s4",
        name: "關卡 3-4：科技趨勢與商業深度微閱讀",
        mode: "reading",
        targetGoal: 8,
        unitName: "篇深度短文",
        introTip: "精準理解複雜長難句與邏輯推論題型。",
        rewardXP: 650
      }
    ]
  },
  {
    tier: 4,
    title: "🌌 段位 IV：母語頂峰大師 (Native Master Mind)",
    targetRank: "TOEIC 990 滿分 ✕ 母語流利語感",
    desc: "終極實戰！完成 100 題極限盲測、高契合度影子跟讀與多輪情境快打對抗！",
    stages: [
      {
        id: "t4_s1",
        name: "關卡 4-1：全量 8,365 詞庫極限特訓",
        mode: "blitz",
        targetGoal: 100,
        unitName: "題詞彙特訓",
        introTip: "在不限時高壓下保持 90% 以上正確率，建立母語直覺！",
        rewardXP: 800
      },
      {
        id: "t4_s2",
        name: "關卡 4-2：母語者語調抑揚頓挫影子跟讀",
        mode: "echo",
        targetGoal: 10,
        unitName: "次高分評測",
        introTip: "挑戰 85% 以上契合度，將口腔肌肉記憶推向極致！",
        rewardXP: 850
      },
      {
        id: "t4_s3",
        name: "關卡 4-3：全情境多輪對決大師終局之戰",
        mode: "dialogue",
        targetGoal: 3,
        unitName: "場完勝對決",
        introTip: "在複雜談判、破冰社交與高情商應對中取得大師滿分評價！",
        rewardXP: 1200
      }
    ]
  }
];
