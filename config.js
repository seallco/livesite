const siteConfig = {
    // 網站標題與資訊
    siteName: "周淵凱的學習歷程",
    siteDescription: "Tamkang University - Full Stack Developer Journey",
    footerText: "© 2026 Designed for Efficiency.",

    // 這裡定義你的連結分類
    // type: 'card' (卡片式) | 'list' (列表式，適合放很多小連結)
    sections: [
        {
            title: "應用與日常專案",
            icon: "fa-solid fa-code",
            type: "card", 
            items: [
                { title: "綜藝派對遊戲大廳 (12-in-1)", desc: "綜藝派對闖關神器！含「第一關：翻注音現場找物」、「第二關：童話與電影畫畫接力」等 12 款互動遊戲", link: "./綜藝遊戲/index.html", tag: "Hot", icon: "fa-solid fa-gamepad" },
                { title: "產線數量與良率統計工作台", desc: "時間段點數・當班良率計算・交接人員紀錄與 I 欄位標記", link: "./統計工具/index.html", tag: "New", icon: "fa-solid fa-industry" },
                { title: "LinguaPulse 靈感英語", desc: "GEPT 中高級 ✕ 多益金證 8,365 詞彙庫隨想隨練", link: "./Gept/index.html", tag: "Hot", icon: "fa-solid fa-language" },
                { title: "智慧精準灌溉系統", desc: "氣象預報聯動之節水攔截機制 (GSAP + 3D 動畫)", link: "./presentation/index.html", tag: "Featured", icon: "fa-solid fa-droplet" },
                { title: "政昕電腦比較", desc: "文書與專業電腦配置方案分析比較", link: "./ChengHsin/computer.html", tag: "", icon: "fa-solid fa-laptop" },
                { title: "政昕尾牙小遊戲", desc: "互動式尾牙即時競賽小遊戲", link: "./ChengHsin/annual.html", tag: "", icon: "fa-solid fa-dice" },
                { title: "師大菸害防制問卷", desc: "菸害防制新法知識站與問卷系統", link: "./Tobacco-Control/Tobacco-Control.html", tag: "", icon: "fa-solid fa-ban-smoking" },
                { title: "大阪京都自由行", desc: "2/21-2/25 大阪京都 5 天 4 夜精美行程", link: "./japan/index.html", tag: "", icon: "fa-solid fa-plane" },
                { title: "大阪研究室自由行", desc: "1/23-1/27 大阪行程指南", link: "./japan/osaka.html", tag: "", icon: "fa-solid fa-map-location-dot" },
                { title: "大阪自由行午餐美食", desc: "2/24 日本精選午餐清單與推薦", link: "./japan/lunch.html", tag: "", icon: "fa-solid fa-utensils" }
            ]
        },
        {
            title: "課程與測驗專案",
            icon: "fa-solid fa-graduation-cap",
            type: "card",
            items: [
                { title: "無線感測網路 (WSN) 測驗系統", desc: "IEEE 802.15.4、LEACH、物聯網感測互動刷題", link: "./wsn-quiz-system/index.html", tag: "New", icon: "fa-solid fa-tower-broadcast" },
                { title: "網際網路期末模考", desc: "全隨機適配考前衝刺測驗系統", link: "./Sat.work/Internet/FinalMock.html", tag: "Quiz", icon: "fa-solid fa-pen-nib" },
                { title: "網際網路期中模考", desc: "無限網際網路期中考模擬試題練習", link: "./Sat.work/Internet/quiz.html", tag: "Quiz", icon: "fa-solid fa-file-lines" },
                { title: "財金資料庫期中模考", desc: "財金資料庫期中考模擬試卷", link: "./Sat.work/Financial DataBase/quiz.html", tag: "Important", icon: "fa-solid fa-coins" },
                { title: "財金資料庫期末報告", desc: "房地合一稅 2.0 互動數據分析與計算機", link: "./Sat.work/Financial DataBase/report.html", tag: "Report", icon: "fa-solid fa-chart-pie" }
            ]
        },
        {
            title: "External Links (外部資源)",
            icon: "fa-solid fa-link",
            type: "list", // 列表模式，比較緊湊
            items: [
                { title: "MDN Web Docs", link: "https://developer.mozilla.org", desc: "Web 開發技術文件" },
                { title: "Font Awesome", link: "https://fontawesome.com", desc: "向量圖示庫" },
                { title: "iClass 學習平台", link: "https://iclass.tku.edu.tw/iportal#/", desc: "淡江大學課程作業系統" }
            ]
        }
    ]
};