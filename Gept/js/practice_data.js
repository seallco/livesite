// Practice Data for LinguaPulse
// TOEIC Gold (860+), Native Expressions, Grammar Traps, Micro-Readings, and Dialogues

window.PRACTICE_DATA = {
  // 1. Native Expressions vs. Textbook English
  nativeExpressions: [
    {
      id: "ne_1",
      category: "Daily Life",
      textbook: "I am very tired today.",
      native: "I'm completely wiped out today.",
      idiom: "wiped out",
      meaning: "累癱了、精疲力竭",
      explanation: "母語者在極度疲勞時很少只說 'very tired'，更常使用 'wiped out'、'exhausted' 或 'beat'。",
      example: "After working a 12-hour shift, I'm completely wiped out.",
      situation: "下班或運動後形容自己累透了"
    },
    {
      id: "ne_2",
      category: "Social & Chat",
      textbook: "Let's meet and talk sometime.",
      native: "Let's catch up soon!",
      idiom: "catch up",
      meaning: "敘舊、聊聊彼此近況",
      explanation: "當朋友之間有一段時間沒見面時，用 'catch up' 比單純的 'meet and talk' 自然百倍。",
      example: "It's been ages! We definitely need to catch up over coffee.",
      situation: "跟老朋友約見面敘舊"
    },
    {
      id: "ne_3",
      category: "Business",
      textbook: "I understand what you mean.",
      native: "I hear you. / I'm on the same page.",
      idiom: "on the same page",
      meaning: "達成共識、完全理解彼此想法",
      explanation: "在職場討論或商務會議中，'on the same page' 是表達團隊默契與共識的最高頻片語。",
      example: "Let's have a quick sync to make sure we're all on the same page before the client pitch.",
      situation: "確認團隊進度與看法一致"
    },
    {
      id: "ne_4",
      category: "Business",
      textbook: "I am very busy right now.",
      native: "I'm swamped with work right now.",
      idiom: "swamped",
      meaning: "忙得不可開交、事情堆積如山 (像被淹沒)",
      explanation: "Swamp 原本指沼澤，當形容詞 'swamped' 形容被工作或任務淹沒，是職場最地道的說法之一。",
      example: "Can I get back to you this afternoon? I'm absolutely swamped with emails.",
      situation: "委婉表達手頭工作過多"
    },
    {
      id: "ne_5",
      category: "Decisions",
      textbook: "I haven't decided yet.",
      native: "I'm on the fence about it.",
      idiom: "on the fence",
      meaning: "猶豫不決、還在觀望",
      explanation: "像坐在籬笆上不知道該跳向哪一邊，形容對某個決定保持中立或拿不定主意。",
      example: "I'm still on the fence about whether to take the new job offer in Tokyo.",
      situation: "面臨選擇尚未下定決心"
    },
    {
      id: "ne_6",
      category: "Daily Life",
      textbook: "Let's stop working for today.",
      native: "Let's call it a day.",
      idiom: "call it a day",
      meaning: "今天就到此為止吧、收工",
      explanation: "下班、會議結束或練習結束時，母語者幾乎每天都會說 'Let's call it a day'。",
      example: "We've made great progress on the slides. Let's call it a day!",
      situation: "宣布結束今天的工作或活動"
    },
    {
      id: "ne_7",
      category: "Business",
      textbook: "We will decide as things happen without a plan.",
      native: "Let's just play it by ear.",
      idiom: "play it by ear",
      meaning: "隨機應變、看情況再說",
      explanation: "源自音樂即興演奏不看樂譜。日常與商業交流中非常實用，指暫時不定死計畫，見機行事。",
      example: "We don't know the exact schedule yet, so let's just play it by ear.",
      situation: "計畫尚未明朗時保持彈性"
    },
    {
      id: "ne_8",
      category: "Conversation",
      textbook: "I will make the long story shorter.",
      native: "Long story short, we got the contract.",
      idiom: "long story short",
      meaning: "長話短說、總而言之",
      explanation: "省略瑣碎背景直奔結論時的必備轉折詞，比起 'In conclusion' 在口語中更具親和力。",
      example: "Long story short, our flight was delayed but we still made it in time.",
      situation: "向他人簡潔交代事情結局"
    },
    {
      id: "ne_9",
      category: "Emotion",
      textbook: "I feel slightly sick.",
      native: "I'm feeling a bit under the weather.",
      idiom: "under the weather",
      meaning: "身體微恙、不太舒服",
      explanation: "不是大病，而是感覺小感冒、疲憊或無精打采時的地道表達。",
      example: "I think I might skip the gym today; I'm feeling slightly under the weather.",
      situation: "向同事或朋友請假/解釋狀態不好"
    },
    {
      id: "ne_10",
      category: "Business",
      textbook: "Contact me later to give an update.",
      native: "Let's touch base next Monday.",
      idiom: "touch base",
      meaning: "保持聯繫、簡短碰頭交換進度",
      explanation: "北美商務英語 No.1 高頻詞彙，指簡短對接一下最新情況，不一定是正式開會。",
      example: "I'll review the draft this weekend and touch base with you first thing Monday morning.",
      situation: "約定後續簡短更新進度"
    },
    {
      id: "ne_11",
      category: "Courage",
      textbook: "I will do this difficult thing now.",
      native: "I guess I just have to bite the bullet.",
      idiom: "bite the bullet",
      meaning: "咬緊牙關硬著頭皮去做、勇於面對難關",
      explanation: "源自古代戰場手術咬子彈忍痛，現指下定決心面對不可避免的困難任務。",
      example: "Tuition is expensive, but I need to bite the bullet and invest in my education.",
      situation: "下決心做一件艱難但必要的決定"
    },
    {
      id: "ne_12",
      category: "Memory",
      textbook: "I don't know the exact number immediately.",
      native: "Off the top of my head, I'd say around twenty.",
      idiom: "off the top of my head",
      meaning: "憑直覺/不假思索/隨口一想",
      explanation: "未經詳細查證、僅憑腦海現有記憶給出估計時的黃金句型。",
      example: "Off the top of my head, our Q3 revenue grew by roughly 15%.",
      situation: "開會被問到數據時做初步估算"
    },
    {
      id: "ne_13",
      category: "Secrets",
      textbook: "Don't tell anyone about the surprise.",
      native: "Keep it under wraps for now.",
      idiom: "under wraps",
      meaning: "保密、暫不公開",
      explanation: "形容某個新產品、驚喜或消息還在保密狀態中。",
      example: "The marketing team is keeping the new product design under wraps until the keynote.",
      situation: "叮嚀團隊對未公開資訊保密"
    },
    {
      id: "ne_14",
      category: "Strategy",
      textbook: "Think in a very new and creative way.",
      native: "We really need to think outside the box.",
      idiom: "think outside the box",
      meaning: "跳脫框架思考、發揮創新思維",
      explanation: "無論在多益聽力閱讀還是外商頭腦風暴 (Brainstorming)，這是最常出現的創新表達。",
      example: "Traditional marketing won't work here; we need to think outside the box to attract Gen Z.",
      situation: "鼓勵團隊提出顛覆傳統的點子"
    },
    {
      id: "ne_15",
      category: "Negotiation",
      textbook: "We agree on this topic.",
      native: "We see eye to eye on this proposal.",
      idiom: "see eye to eye",
      meaning: "看法一致、意見相同",
      explanation: "常用於協商與討論中，常與否定句合用 (e.g. They rarely see eye to eye).",
      example: "Although we have different backgrounds, my manager and I see eye to eye on key priorities.",
      situation: "表達雙方觀點不謀而合"
    }
  ],

  // 2. TOEIC Gold (860+) & High-Intermediate Grammar & Trap Detective
  grammarTraps: [
    {
      id: "gt_1",
      topic: "搭配介系詞 (Collocations & Prepositions)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "All employees must comply _____ the new safety protocols immediately.",
      correct: "with",
      options: ["with", "to", "for", "at"],
      errorExplanation: "【考點解析】'comply with' 是多益極高頻商務搭配詞，意為『遵守、符合』。注意易混淆：conform to / adhere to / abide by 也是『遵守』，但搭配的介系詞各不相同！",
      rule: "comply with = conform to = adhere to = abide by (遵守)"
    },
    {
      id: "gt_2",
      topic: "易混淆字 (Confusing Words)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "The new tax policy will directly _____ our company's profit margins.",
      correct: "affect",
      options: ["affect", "effect", "effective", "affection"],
      errorExplanation: "【考點解析】'affect' 多作動詞（影響）；'effect' 多作名詞（效果、影響）。本句在助動詞 will 後需要填入動詞原形，故選 'affect'。",
      rule: "affect (v.) 影響 vs. effect (n.) 效果、影響 (have an effect on)"
    },
    {
      id: "gt_3",
      topic: "假設語氣與要求動詞 (Subjunctive Mood)",
      targetLevel: "TOEIC 900+ / GEPT 中高級",
      sentence: "The board recommended that the CEO _____ the quarterly financial report in person.",
      correct: "deliver",
      options: ["deliver", "delivers", "delivered", "delivering"],
      errorExplanation: "【考點解析】recommend / suggest / insist / demand + that + S + (should) + V原形。此處省略 should，動詞必須維持原形 deliver，不可加 s 或用過去式！",
      rule: "S + recommend/insist/suggest + that + S + (should) + V(原形)"
    },
    {
      id: "gt_4",
      topic: "倒裝句型 (Inversion Structure)",
      targetLevel: "TOEIC 900+ / GEPT 中高級",
      sentence: "Rarely _____ such dedication and professionalism in a newly hired intern.",
      correct: "have we seen",
      options: ["have we seen", "we have seen", "we saw", "did we saw"],
      errorExplanation: "【考點解析】否定副詞 (Rarely, Seldom, Hardly, Scarcely, Never) 置於句首時，句子需部分倒裝（助動詞/be動詞提到主詞前面）。",
      rule: "否定副詞 + 助動詞/be + 主詞 + 主要動詞..."
    },
    {
      id: "gt_5",
      topic: "經濟性與節約 (Confusing Adjectives)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "Driving a hybrid vehicle is much more _____ in the long run due to fuel savings.",
      correct: "economical",
      options: ["economical", "economic", "economics", "economize"],
      errorExplanation: "【考點解析】'economical' 意思是『經濟實惠的、省錢的』；而 'economic' 是『經濟學上的、經濟體系的』。省油省錢應使用 economical。",
      rule: "economical (省錢划算的) vs. economic (經濟上的/國家經濟的)"
    },
    {
      id: "gt_6",
      topic: "分詞構句 (Participle Clauses)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "_____ by the sudden market fluctuation, the investors decided to diversify their portfolios.",
      correct: "Alarmed",
      options: ["Alarmed", "Alarming", "To alarm", "Alarms"],
      errorExplanation: "【考點解析】主詞 the investors（投資者）是被市場波動所『驚嚇/驚動』，與動作為被動關係，因此分詞構句需使用過去分詞 Alarmed (Being alarmed)。",
      rule: "被動主詞使用過去分詞 (P.P.) 開頭做分詞構句"
    },
    {
      id: "gt_7",
      topic: "連接詞與介系詞辨析 (Preposition vs. Conjunction)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "The team completed the product launch ahead of schedule _____ severe resource constraints.",
      correct: "despite",
      options: ["despite", "although", "even though", "in spite"],
      errorExplanation: "【考點解析】後方為名詞短語 'severe resource constraints'，需接介系詞 despite (或 in spite of)。although / even though 後方必須接完整子句 (S+V)。",
      rule: "despite + N / V-ing vs. although/even though + S + V"
    },
    {
      id: "gt_8",
      topic: "專案分配與動詞搭配 (Academic & Business Vocabulary)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "The management decided to _____ a substantial portion of the budget to AI research.",
      correct: "allocate",
      options: ["allocate", "alleviate", "advocate", "abdicate"],
      errorExplanation: "【考點解析】allocate (分配、撥出經費) to... 是多益商業管理的核心動詞。alleviate 是緩和減輕，advocate 是提倡擁護，abdicate 是退位。",
      rule: "allocate [resources/funds] to [project/purpose] (撥出資源/款項給...)"
    },
    {
      id: "gt_9",
      topic: "時間與順序副詞/介系詞 (Advanced Time Expressions)",
      targetLevel: "TOEIC 900+ / GEPT 中高級",
      sentence: "_____ to joining our firm, Ms. Larson served as Chief Financial Officer at Zenith Corp.",
      correct: "Prior",
      options: ["Prior", "Beforehand", "Previous", "Ahead"],
      errorExplanation: "【考點解析】'Prior to + N/V-ing' 是非常正式且高頻的商務用法，等同於 'Before'。Previous 通常作形容詞，需搭配 'previous to' 但罕用於句首引導片語；Beforehand 為副詞不可後接 to。",
      rule: "Prior to + N / V-ing = Before (在...之前)"
    },
    {
      id: "gt_10",
      topic: "互補 vs 稱讚 (Confusing Pairs)",
      targetLevel: "TOEIC 860+ / GEPT 中高級",
      sentence: "The new automated software perfectly _____ the existing inventory tracking system.",
      correct: "complements",
      options: ["complements", "compliments", "complaints", "complexes"],
      errorExplanation: "【考點解析】complement (拼寫帶 e) = 互補、使完整；compliment (拼寫帶 i) = 讚美、恭維。此處軟體與現有系統相輔相成，故用 complements。",
      rule: "complement (v./n. 互補、相得益彰) vs. compliment (v./n. 讚美、稱讚)"
    }
  ],

  // 3. 3-Turn Smart Situational Dialogues (情境快打對決)
  dialogues: [
    {
      id: "diag_1",
      title: "☕ Local Coffee Shop Customization (像母語者一樣點咖啡)",
      role: "Barista (咖啡師)",
      scenario: "你正在紐約一家精品咖啡店點餐，需要點一杯燕麥奶拿鐵並調整甜度與冰塊。",
      turns: [
        {
          botSays: "Hey there! Welcome to Brew & Co. What can I get started for you today?",
          options: [
            {
              text: "Can I get an iced oat latte, light ice, with an extra shot please?",
              feedback: "🔥 完美！非常自然地道的點餐句型，流暢且精準掌握細節。",
              points: 10,
              isBest: true
            },
            {
              text: "I want to buy one iced coffee with oat milk and less ice.",
              feedback: "文法沒錯，但在英語系國家點餐用 'Can I get...' 或 'Could I have...' 會更得體。",
              points: 6,
              isBest: false
            },
            {
              text: "Give me oat latte quickly.",
              feedback: "太生硬且不禮貌，在英語文化中可能會顯得粗魯。",
              points: 2,
              isBest: false
            }
          ]
        },
        {
          botSays: "You got it! Would you like any flavored syrup in that, like vanilla or hazelnut?",
          options: [
            {
              text: "Just one pump of vanilla, please. Not too sweet.",
              feedback: "🔥 專業！母語者量化糖漿都用 'pump' (按壓次數)，非常道地。",
              points: 10,
              isBest: true
            },
            {
              text: "Add some sugar water please, 30 percent sugar.",
              feedback: "外國咖啡店通常不講百分比糖度，而是講 'one/two pumps' 或 'light syrup'。",
              points: 5,
              isBest: false
            },
            {
              text: "No sugar. Sugar is bad.",
              feedback: "稍嫌唐突，簡單說 'I'm good without syrup, thanks!' 即可。",
              points: 4,
              isBest: false
            }
          ]
        },
        {
          botSays: "Awesome. That'll be $6.50. Will that be for here or to go, and how would you like to pay?",
          options: [
            {
              text: "To go, please! I'll tap with Apple Pay.",
              feedback: "🔥 滿分！'To go' 與 'tap with Apple Pay' 是現代母語者最高頻日常用語。",
              points: 10,
              isBest: true
            },
            {
              text: "Take away, I pay with my phone.",
              feedback: "美式多說 'To go'（英澳常用 Take away），意思可通但美式口語 To go 更自然。",
              points: 7,
              isBest: false
            },
            {
              text: "I leave now. Take money.",
              feedback: "表達過於碎片化，容易造成誤解。",
              points: 2,
              isBest: false
            }
          ]
        }
      ]
    },
    {
      id: "diag_2",
      title: "💼 Polite Disagreement in a Tech Meeting (外商會議高情商表達異議)",
      role: "Product Lead (產品經理)",
      scenario: "在專案會議中，主管提議將原定兩個月的上線時程壓縮到兩週，你必須得體且有說服力地指出風險。",
      turns: [
        {
          botSays: "To beat our competitor to market, I propose we rush this feature and launch in two weeks instead of two months. Thoughts?",
          options: [
            {
              text: "I see where you're coming from, but I have some reservations about the QA testing timeline.",
              feedback: "🔥 極高情商！先認同對方出發點 ('I see where you're coming from') 再委婉提出疑慮 ('have some reservations')。",
              points: 10,
              isBest: true
            },
            {
              text: "No, that is impossible and a very bad idea.",
              feedback: "過於直接且具對抗性，容易破壞會議氛圍並引發防禦心理。",
              points: 3,
              isBest: false
            },
            {
              text: "Okay, we will try our best without sleep.",
              feedback: "承諾了無法做到的事，在職場中缺乏專業風險評估。",
              points: 4,
              isBest: false
            }
          ]
        },
        {
          botSays: "What specific risks are you worried about if we cut down the testing phase?",
          options: [
            {
              text: "Rushing this could introduce critical bugs that damage user trust. What if we release a core MVP first and iterate?",
              feedback: "🔥 卓越！不僅清晰指出風險 (critical bugs, damage user trust)，還主動提供替代方案 (MVP + iterate)。",
              points: 10,
              isBest: true
            },
            {
              text: "The software will have many errors and customers will be angry.",
              feedback: "意思清楚，但用字較為初階，缺乏商務說服力。",
              points: 6,
              isBest: false
            },
            {
              text: "Everything will be broken.",
              feedback: "誇大其詞，缺乏具體分析。",
              points: 2,
              isBest: false
            }
          ]
        },
        {
          botSays: "That's a valid point. Releasing an MVP sounds like a balanced compromise. Can you draft a quick rollout plan by tomorrow?",
          options: [
            {
              text: "Absolutely. I'll put together an outline with milestone targets and share it before noon tomorrow.",
              feedback: "🔥 滿分商務回應！給予明確時限 (before noon) 與交付內容 (outline with milestone targets)。",
              points: 10,
              isBest: true
            },
            {
              text: "Yes, I will write something for you tomorrow.",
              feedback: "略顯被動模糊，不如明確指出時間點與具體交付物來得專業。",
              points: 6,
              isBest: false
            },
            {
              text: "Maybe if I have time.",
              feedback: "職場大忌，給人不負責任的印象。",
              points: 1,
              isBest: false
            }
          ]
        }
      ]
    },
    {
      id: "diag_3",
      title: "🍸 Networking & Small Talk at a Global Tech Mixer (國際酒會社交破冰)",
      role: "Senior AI Engineer at Google",
      scenario: "你在舊金山一場科技交流會上，正與一位母語工程師進行自然不尷尬的 Small Talk。",
      turns: [
        {
          botSays: "Hey! Mind if I join you? Great turnout tonight, isn't it?",
          options: [
            {
              text: "Not at all, have a seat! Yeah, the energy in the room is fantastic tonight. I'm Alex, by the way.",
              feedback: "🔥 自然熱情！'Not at all' + 'have a seat' + 自我介紹，瞬間拉近社交距離。",
              points: 10,
              isBest: true
            },
            {
              text: "Yes, you can sit. Many people are here.",
              feedback: "課本式回答，文法正確但語氣略顯冷淡。",
              points: 5,
              isBest: false
            },
            {
              text: "No, don't sit here.",
              feedback: "太過拒人於千里之外。",
              points: 1,
              isBest: false
            }
          ]
        },
        {
          botSays: "Nice to meet you, Alex! I'm David. So, what brings you to this summit? Working on anything exciting?",
          options: [
            {
              text: "Nice to meet you, David! I'm currently working on LLM optimizations and wanted to see how other teams tackle latency challenges. How about yourself?",
              feedback: "🔥 黃金對話公式！簡潔介紹自己的亮點 + 將話題拋回給對方 ('How about yourself?')。",
              points: 10,
              isBest: true
            },
            {
              text: "I write computer code in Taiwan. I come here to listen to speeches.",
              feedback: "稍微簡短，沒有提供足夠的延伸話題讓對方接話。",
              points: 5,
              isBest: false
            },
            {
              text: "My boss told me to come here.",
              feedback: "話題終結者，顯得缺乏熱情。",
              points: 3,
              isBest: false
            }
          ]
        },
        {
          botSays: "Latency optimization is huge right now! We're actually running a workshop on speculative decoding tomorrow. Are you planning to drop by?",
          options: [
            {
              text: "That sounds right up my alley! I'd love to check it out. Would you mind if we connected on LinkedIn?",
              feedback: "🔥 完美收尾！'right up my alley' (正合我胃口) 是地道俚語，並主動建立長遠人脈連結。",
              points: 10,
              isBest: true
            },
            {
              text: "I will go if I wake up early. Give me your phone number.",
              feedback: "在商務社交中直接要私人電話略顯突兀，使用 LinkedIn 更專業且自然。",
              points: 5,
              isBest: false
            },
            {
              text: "I am not interested in decoding.",
              feedback: "直接潑冷水，破壞了原本良好的交流氣氛。",
              points: 1,
              isBest: false
            }
          ]
        }
      ]
    }
  ],

  // 4. 2-Minute Micro-Readings (2分鐘短篇閱讀)
  microReadings: [
    {
      id: "mr_1",
      title: "The 'Two-Minute Rule' for Habit Formation",
      category: "Psychology & Productivity",
      readTime: "90 sec",
      level: "GEPT 中高級 / TOEIC 860+",
      content: `When you start a new habit, it should take less than two minutes to do. In his bestselling book *Atomic Habits*, James Clear emphasizes that the key to building consistency is not initial intensity, but rather lowering the barrier to entry.

For example, instead of committing to "read 30 pages of English every day," scale it down to "read just one paragraph." Once you establish the routine of showing up, momentum naturally kicks in. Making a habit effortless at the outset prevents cognitive overload and eliminates procrastination. Ultimately, a habit must be established before it can be improved.`,
      vocabList: [
        { word: "barrier to entry", meaning: "進入門檻 / 障礙" },
        { word: "scale down", meaning: "縮小規模 / 簡化" },
        { word: "momentum", meaning: "動能、推進力" },
        { word: "cognitive overload", meaning: "認知負荷過重" },
        { word: "procrastination", meaning: "拖延、延宕" }
      ],
      question: {
        prompt: "According to the passage, what is the primary purpose of scaling a new habit down to two minutes?",
        options: [
          "To guarantee you never need to practice more than two minutes.",
          "To lower the starting barrier and establish the routine of showing up consistently.",
          "To prove that reading 30 pages a day is completely impossible.",
          "To test your maximum cognitive limits under intense pressure."
        ],
        answerIndex: 1,
        explanation: "文中明確指出：將習慣縮小至兩分鐘的核心目的是『降低進入門檻 (lowering the barrier to entry)』並『建立持之以恆出現的慣性 (establish the routine of showing up)』。"
      },
      goldenQuote: "A habit must be established before it can be improved."
    },
    {
      id: "mr_2",
      title: "The Subtle Art of Negotiating with Silence",
      category: "Business & Communication",
      readTime: "90 sec",
      level: "GEPT 中高級 / TOEIC 900+",
      content: `In high-stakes corporate negotiations, silence is often your most potent weapon. Novice negotiators frequently feel uncomfortable with quiet moments, feeling an overwhelming urge to fill the void with concessions or justifications.

However, seasoned executives leverage deliberate pauses to maintain emotional composure and observe counterparty reactions. When an offer is put on the table, pausing for three to five seconds signals confidence and forces the other side to reveal additional leverage or elaborate further. As the adage goes: in negotiation, the first person to speak after a proposal often surrenders the upper hand.`,
      vocabList: [
        { word: "high-stakes", meaning: "高風險的、至關重要的" },
        { word: "potent", meaning: "強效的、有力的" },
        { word: "concession", meaning: "讓步、妥協" },
        { word: "leverage", meaning: "籌碼、影響力 / 利用" },
        { word: "surrender the upper hand", meaning: "喪失主導優勢" }
      ],
      question: {
        prompt: "Why do experienced executives deliberately utilize silence during business negotiations?",
        options: [
          "Because they forgot what to say next in the presentation.",
          "To demonstrate confidence and prompt the counterparty to reveal more information.",
          "To prolong the meeting until the other party gives up and leaves.",
          "To show disrespect and provoke emotional outbursts."
        ],
        answerIndex: 1,
        explanation: "根據文章第二段，資深談判者運用刻意的停頓來『展現自信 (signals confidence)』並『促使對方透露更多籌碼或進一步說明 (forces the other side to reveal additional leverage)』。"
      },
      goldenQuote: "In negotiation, silence signals confidence; the urge to fill the void often surrenders leverage."
    },
    {
      id: "mr_3",
      title: "How Large Language Models Learn Intuition",
      category: "Tech & Innovation",
      readTime: "100 sec",
      level: "GEPT 中高級 / TOEIC 860+",
      content: `Modern AI architectures do not merely memorize statistical correlations; they construct intricate internal representations of semantic meaning. By ingesting vast corpora of multilingual literature, technical manuals, and dialogues, neural networks develop an approximation of linguistic intuition.

This capability allows AI to generate nuanced phrasing, detect subtle grammatical ambiguities, and adapt conversational tone across distinct social contexts. For English language learners, interacting with AI offers a judgment-free environment to simulate realistic workplace scenarios and receive instantaneous, contextual feedback tailored to individual proficiency levels.`,
      vocabList: [
        { word: "intricate", meaning: "複雜精密的、錯綜複雜的" },
        { word: "corpora", meaning: "語料庫 (corpus 的複數形)" },
        { word: "nuanced", meaning: "具微妙細節差異的" },
        { word: "ambiguity", meaning: "歧義、模稜兩可" },
        { word: "proficiency", meaning: "熟練度、精通程度" }
      ],
      question: {
        prompt: "What major benefit does AI offer English learners according to the article?",
        options: [
          "It forces learners to memorize statistical algorithms.",
          "It replaces all human teachers and eliminates the need for practice.",
          "It provides a safe, judgment-free space to practice realistic scenarios with immediate feedback.",
          "It limits vocabulary learning strictly to technical manuals."
        ],
        answerIndex: 2,
        explanation: "文章結尾指出，AI 能為學習者提供『無評判壓力的環境 (judgment-free environment)』來模擬真實職場情境並獲得『即時個人化回饋 (instantaneous, contextual feedback)』。"
      },
      goldenQuote: "Mastery begins when practice becomes a judgment-free exploration."
    }
  ],

  // 5. Echo & Speak Coach sentences (with phonetics & focus tips)
  speechDrills: [
    {
      id: "sd_1",
      sentence: "Could you walk me through the key takeaways from this morning's briefing?",
      ipaGuide: "/kʊd juː wɔːk miː θruː ðə kiː ˈteɪkəweɪz frəm ðɪs ˈmɔːrnɪŋz ˈbriːfɪŋ/",
      meaning: "你能帶我快速過一遍今天早會的核心重點嗎？",
      focusTip: "連音技巧：'walk me through' 注意 /k/ 與 /m/ 的平滑過渡；'takeaways' 重音在第一音節。",
      category: "Business Daily"
    },
    {
      id: "sd_2",
      sentence: "I'd really appreciate it if you could loop me in on any upcoming updates.",
      ipaGuide: "/aɪd ˈrɪəli əˈpriːʃieɪt ɪt ɪf juː kʊd luːp miː ɪn ɒn ˈɛni ˈʌpˌkʌmɪŋ ˈʌpdeɪts/",
      meaning: "如果後續有任何更新，請務必把我也加入通知（知會我一聲），非常感謝！",
      focusTip: "地道表達：'loop me in' 是外商最高頻郵件/口語，意指將某人加入 CC 或知會清單。",
      category: "Workplace Pro"
    },
    {
      id: "sd_3",
      sentence: "To be completely candid, we might need to pivot our strategy given the current circumstances.",
      ipaGuide: "/tə biː kəmˈpliːtli ˈkændɪd wiː maɪt niːd tə ˈpɪvət ˈaʊər ˈstrætədʒi ˈɡɪvn ðə ˈkɜːrənt ˈsɜːrkəmstænsɪz/",
      meaning: "坦白說，考慮到目前的現狀，我們可能需要調整戰略方向。",
      focusTip: "高級字彙：'candid' (坦率真誠的)、'pivot' (轉向調整)；'given' 作介系詞表『鑑於/考慮到』。",
      category: "Executive English"
    },
    {
      id: "sd_4",
      sentence: "That sounds like a win-win scenario; let's hammer out the final details over lunch.",
      ipaGuide: "/ðæt saʊndz laɪk ə wɪn wɪn səˈnɛrioʊ lɛts ˈhæmər aʊt ðə ˈfaɪnl ˈdiːteɪlz ˈoʊvər lʌntʃ/",
      meaning: "這聽起來是個雙贏的局面；我們午餐時順便敲定最後的細節吧！",
      focusTip: "地道動詞片語：'hammer out' 意思是經過討論反覆敲定協議細節。",
      category: "Negotiation"
    },
    {
      id: "sd_5",
      sentence: "It's always better to err on the side of caution when dealing with compliance issues.",
      ipaGuide: "/ɪts ˈɔːlweɪz ˈbɛtər tuː ɜːr ɒn ðə saɪd əv ˈkɔːʃən wɛn ˈdiːlɪŋ wɪð kəmˈplaɪəns ˈɪʃuːz/",
      meaning: "處理合規性問題時，寧可謹慎行事（過於謹慎也比冒險好）。",
      focusTip: "格言級片語：'err on the side of caution' (寧求穩妥、寧缺毋濫)；發音 'err' 讀作 /ɜːr/。",
      category: "TOEIC Gold Mastery"
    }
  ]
};
