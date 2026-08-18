// LinguaPulse 10-Tier Grand English Mastery Campaign (頂峰大師段位闖關體系)
// 涵蓋多益 400 ~ 990 滿分、GEPT 初級至中高級之完整段位晉級考驗

window.JOURNEY_TIERS = [
  {
    tier: 1,
    title: "🌱 段位 I：英語探索者 (English Explorer)",
    targetRank: "GEPT 初級基礎 ✕ 多益 400 起步啟蒙",
    desc: "從 2,385 個初級核心字庫中高密度隨機抽驗！完成 100 題單字精準辨析、25 道語法骨架與 20 組日常地道片語。",
    stages: [
      {
        id: "t1_s1",
        name: "關卡 1-1：初級核心單字特訓 (2,385 詞庫抽測)",
        mode: "blitz",
        targetGoal: 100,
        unitName: "題單字辨析",
        introTip: "從初級 2,385 詞庫中高頻抽驗，建立『見字知義、同詞性快速辨析』的直覺反應！",
        rewardXP: 300
      },
      {
        id: "t1_s2",
        name: "關卡 1-2：基礎句型結構與主動被動",
        mode: "grammar",
        targetGoal: 25,
        unitName: "題文法陷阱",
        introTip: "看清句子的主要主詞與動詞，拆解基本句子架構與被動語態。",
        rewardXP: 350
      },
      {
        id: "t1_s3",
        name: "關卡 1-3：生活高頻習慣表達",
        mode: "native",
        targetGoal: 20,
        unitName: "個地道片語",
        introTip: "學習母語者生活中的高頻自然表達，告別生硬直翻。",
        rewardXP: 400
      }
    ]
  },
  {
    tier: 2,
    title: "💼 段位 II：職場實戰菁英 (Workplace Communicator)",
    targetRank: "GEPT 中級 ✕ 多益 650 綠證實力",
    desc: "解鎖中級 2,680+ 實用商用詞庫！攻克 200 題商務詞彙辨析、多益 Part 5 必考文法與微閱讀！",
    stages: [
      {
        id: "t2_s1",
        name: "關卡 2-1：中級商務與日常高頻詞 (2,680 詞庫抽測)",
        mode: "blitz",
        targetGoal: 200,
        unitName: "題單字辨析",
        introTip: "涵蓋中級 2,680 詞庫，專注於職場常用動詞、名詞與形容詞的精準運用！",
        rewardXP: 600
      },
      {
        id: "t2_s2",
        name: "關卡 2-2：多益常考連接詞與假設語氣",
        mode: "grammar",
        targetGoal: 35,
        unitName: "題文法陷阱",
        introTip: "擊破多益 Part 5 最容易失分的轉折詞與假設倒裝陷阱。",
        rewardXP: 650
      },
      {
        id: "t2_s3",
        name: "關卡 2-3：2分鐘短篇商業微閱讀",
        mode: "reading",
        targetGoal: 10,
        unitName: "篇商業短文",
        introTip: "訓練快速掃讀首尾句抓取主旨與數據細節的能力！",
        rewardXP: 700
      },
      {
        id: "t2_s4",
        name: "關卡 2-4：職場標準語音連音跟讀",
        mode: "echo",
        targetGoal: 15,
        unitName: "次發音跟讀 (80%+)",
        introTip: "聽清楚連音（Linking Words）與重音，大聲自信跟讀！",
        rewardXP: 700
      }
    ]
  },
  {
    tier: 3,
    title: "🏅 段位 III：多益金證獵手 (TOEIC Gold Aspirant)",
    targetRank: "GEPT 中高級 ✕ 多益 860+ 金色證書",
    desc: "攻入 3,300+ 中高級學術字彙庫 (AWL)！完成 350 題高難度詞彙、高情商商務談判與深度長文理解！",
    stages: [
      {
        id: "t3_s1",
        name: "關卡 3-1：GEPT 中高級 860+ 核心衝刺 (3,300 詞庫)",
        mode: "blitz",
        targetGoal: 350,
        unitName: "題單字辨析",
        introTip: "直擊學術字彙（AWL）與高階抽象詞彙，強化大腦敏銳度！",
        rewardXP: 1000
      },
      {
        id: "t3_s2",
        name: "關卡 3-2：金證專屬高難度語法攻堅",
        mode: "grammar",
        targetGoal: 50,
        unitName: "題語法考點",
        introTip: "分詞構句、倒裝句與易混淆形容詞的最後驗收！",
        rewardXP: 1100
      },
      {
        id: "t3_s3",
        name: "關卡 3-3：商務談判與高情商習慣用語",
        mode: "native",
        targetGoal: 30,
        unitName: "個高階片語",
        introTip: "掌握外商主管常用俚語與委婉表達技巧。",
        rewardXP: 1200
      },
      {
        id: "t3_s4",
        name: "關卡 3-4：科技趨勢與商業深度微閱讀",
        mode: "reading",
        targetGoal: 15,
        unitName: "篇深度短文",
        introTip: "精準理解複雜長難句與邏輯推論題型。",
        rewardXP: 1300
      }
    ]
  },
  {
    tier: 4,
    title: "🌌 段位 IV：母語頂峰大師 (Native Master Mind)",
    targetRank: "全量 8,365 詞庫精通 ✕ 多益 990 滿分",
    desc: "全量 8,365 GEPT 詞庫隨機大亂鬥！500 題極限盲測、母語聲學跟讀與全情境實戰對決！",
    stages: [
      {
        id: "t4_s1",
        name: "關卡 4-1：全量 8,365 詞庫極限特訓",
        mode: "blitz",
        targetGoal: 500,
        unitName: "題詞彙特訓",
        introTip: "從全量 8,365 詞庫隨機出題，在不限時高壓下保持 90% 以上正確率！",
        rewardXP: 2000
      },
      {
        id: "t4_s2",
        name: "關卡 4-2：母語者語調抑揚頓挫影子跟讀",
        mode: "echo",
        targetGoal: 25,
        unitName: "次高分評測",
        introTip: "挑戰 85% 以上契合度，將口腔肌肉記憶推向極致！",
        rewardXP: 2200
      },
      {
        id: "t4_s3",
        name: "關卡 4-3：全情境多輪對決大師終局之戰",
        mode: "dialogue",
        targetGoal: 5,
        unitName: "場完勝對決",
        introTip: "在複雜談判、破冰社交與高情商應對中取得大師滿分評價！",
        rewardXP: 3000
      }
    ]
  }
];
