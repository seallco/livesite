const siteConfig = {
    // 網站標題與資訊
    siteName: "周淵凱的學習歷程",
    siteDescription: "Tamkang University - Full Stack Developer Journey",
    footerText: "© 2026 Designed for Efficiency.",

    // 這裡定義你的連結分類
    // type: 'card' (卡片式) | 'list' (列表式，適合放很多小連結)
    sections: [
        {
            title: "網頁連結",
            icon: "fa-solid fa-code",
            type: "card", 
            items: [
                { title: "政昕電腦比較", desc: "政昕電腦比較", link: "./ChengHsin/computer.html", tag: "" },
                { title: "菸害防制問卷", desc: "師大菸害防制問卷", link: "./Tobacco-Control/Tobacco-Control.html", tag: "" },
                { title: "大阪京都自由行", desc: "2/21-2/25大阪自由行", link: "./japan/index.html", tag: "" },
                { title: "大阪自由行", desc: "1/23-1/27研究室自由行", link: "./japan/osaka.html", tag: "" }
            ]
        },
        {
            title: "二上課程專案",
            icon: "fa-solid fa-graduation-cap",
            type: "card",
            items: [
                {  title: "網際網路期末模考", desc: "期末模考練習", link: "./Sat.work/Internet/FinalMock.html", tag: ""  },
                {  title: "網際網路期中模考", desc: "期中模考練習", link: "./Sat.work/Internet/quiz.html", tag: ""  },{ title: "財金資料庫期中模考", desc: "期中考模擬試題", link: "./Sat.work/Financial DataBase/quiz.html", tag: "Important" },
            {  title: "財金資料庫期末報告", desc: "房地合一稅2.0", link: "./Sat.work/Financial DataBase/report.html", tag: ""  },
        ]
        },
        {
            title: "External Links (外部資源)",
            icon: "fa-solid fa-link",
            type: "list", // 列表模式，比較緊湊
            items: [
                { title: "MDN Web Docs", link: "https://developer.mozilla.org", desc: "Web 開發聖經" },
                { title: "Font Awesome", link: "https://fontawesome.com", desc: "圖示庫" },
                { title: "Google Classroom", link: "https://classroom.google.com", desc: "課程作業繳交" },
            ]
        }
    ]
};