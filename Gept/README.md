# ⚡ LinguaPulse 靈感英語 (隨想隨練微學習系統)

專為**「零碎時間隨開即練」**、**「衝刺多益金色證書 (TOEIC Gold 860+) / 全民英檢中高級 (GEPT High-Intermediate)」** 與 **「掌握母語者地道口語思維」** 量身打造的現代化 Web 應用程式。

---

## 🌟 核心特色 (Core Features)

1. **📚 GEPT 完整 8,365 詞庫深度整合**：
   - 完整收錄 `GEPT_High-Intermediate.pdf` 全量詞彙（包含中高級 3,300+ 核心字、中級 2,680+ 實用字、初級 2,385+ 基礎字）。
   - 支援詞性分類、學術字彙標記 (Academic Word List L1~L10) 與即時發音。
2. **⚡ 詞彙特訓狂飆 (Word Blitz)**：
   - 嚴格同詞性選項鑑別（題目為動詞則選項全為動詞，名詞對名詞、形容詞對形容詞），徹底解決跨詞性鑑別度失真的問題。
   - 支援「♾️ 無限刷題」與「⏱️ 60秒限時挑戰」自由切換。
   - 點擊「🏁 結束並查看總整理」後，自動生成本次練習全單字清單，包含情境示範例句、逐字對照拆解翻譯與記憶小撇步！
3. **☕ 地道表達 vs. 課本英語 (Native Expressions)**：
   - 「母語者怎麼說」對比「死板課本句」，掌握 *wiped out*, *on the same page*, *play it by ear*, *touch base* 等高頻俚語與商務慣用語。
4. **🕵️ 語感找碴偵探 (TOEIC Gold 860+ Traps)**：
   - 直擊多益 Part 5 & 6 必考陷阱（易混淆字、搭配介系詞、假設語氣、倒裝句、分詞構句）。
5. **🎙️ 口說回音發音教練 (Echo & Speak)**：
   - Web Speech API 語音合成 (TTS 可調 0.8x/1.0x 語速) ✕ 麥克風語音辨識 (STT)，即時提供契合度百分比評分。
6. **📰 2分鐘短篇微閱讀 (Micro-Reading Bite)**：
   - 科技、心理學與外商談判短文，點擊單字隨時發音查意，強化閱讀思維。
7. **🥊 情境快打對決 (3-Turn Dialogue)**：
   - 3 回合真實情境對抗（紐約咖啡店客製點餐、外商會議高情商異議、國際科技酒會社交破冰）。
8. **📖 詞庫大字典與 3D 翻轉閃卡**：
   - 隨意檢索 8,000+ 字詞，並可一鍵進入 3D 翻轉卡片隨機抽測。
9. **🎮 遊戲化升級與錯題管理**：
   - Streak 連續登入天數、XP 經驗值成長、Level 1~10 等級梯隊（直通 TOEIC 990 滿分大師）、專屬錯題本與單字收藏庫。

---

## 🚀 快速啟動 (How to Run)

本系統為純前端架構，無須安裝複雜後端：
1. 可以在瀏覽器中直接開啟 `index.html`：
   ```bash
   open /Users/zhou/Documents/android-studio/english-mastery-app/index.html
   ```
2. 或使用任何輕量本機 HTTP 伺服器（例如 Python 或 Vite）：
   ```bash
   python3 -m http.server 8080 --directory /Users/zhou/Documents/android-studio/english-mastery-app
   ```
   接著在瀏覽器打開 `http://localhost:8080` 即可暢快練習！
