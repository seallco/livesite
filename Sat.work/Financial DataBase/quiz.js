
const questions = [
    {
        question: "以下何者不算資料庫？",
        options: ["員工相關資料", "學生成績相關資料", "公司的財務資料", "搜尋引擎所蒐集的網頁"],
        answer: "搜尋引擎所蒐集的網頁"
    },
    {
        question: "下列何者不算資料庫應用系統？",
        options: ["員工打卡系統", "學生選課系統", "小畫家", "員工差勤系統"],
        answer: "小畫家"
    },
    {
        question: "以下何者為真？",
        options: [
            "統計分析是管理者介面的一個重要功能",
            "商品的瀏覽是管理介面的一個重要功能",
            "管理者介面不是必要，要修改重要資料就直接到後台資料庫修改即可",
            "商品資料的增刪修改是使用者介面的重要功能"
        ],
        answer: "統計分析是管理者介面的一個重要功能"
    },
    {
        question: "請問以下何者是物件導向所特有的觀念？",
        options: ["關係", "實體", "屬性", "繼承"],
        answer: "繼承"
    },
    {
        question: "下列何者為真？",
        options: [
            "關係為實體關係模式特有的觀念，關聯模式無法表示關係",
            "物件導向模式裡除了一些特有的觀念如「繼承」外，關聯模式裡的資料表(或稱關聯)的概念也可以表達",
            "檔案模式也可以保持程式資料獨立性",
            "資料庫系統允許先新增資料再定義資料"
        ],
        answer: "物件導向模式裡除了一些特有的觀念如「繼承」外，關聯模式裡的資料表(或稱關聯)的概念也可以表達"
    },
    {
        question: "以下有關三層式資料架構的敘述何者為真？",
        options: [
            "實體綱目是由資料庫應用系統的程式設計師來設計的",
            "DBA可以看到概念綱目",
            "程式設計師一般可以修改實體綱目",
            "外部綱目的存在主要是為了提高查詢效"
        ],
        answer: "DBA可以看到概念綱目"
    },
    {
        question: "以下有關DBMS的演進何者為真？",
        options: [
            "物件導向是早期DBMS常採用的資料模式",
            "目前業界普遍採用分散式的DBMS",
            "純物件導向DBMS雖然因為市場反應不好現在已少見，但物件導向的觀念也被許多現有的DBMS所採用",
            "具有XML功能的DBMS早在1980年代即被提出"
        ],
        answer: "純物件導向DBMS雖然因為市場反應不好現在已少見，但物件導向的觀念也被許多現有的DBMS所採用"
    },
    {
        question: "下列何者不是資料塑模的階段？",
        options: ["功能塑模", "概念塑模", "邏輯塑模", "實體塑模"],
        answer: "功能塑模"
    },
    {
        question: "以下有關實體關係模式的敘述何者為真？",
        options: ["屬性值不可以多值", "屬性值可以有複合值", "兩個實體型態間只能有一個關係型態", "關係型態上不可以有屬性", "一個實體型態上只能有一個關鍵屬性"],
        answer: "屬性值可以有複合值"
    },
    {
        question: "下列有關弱實體型態的敘述何者為非？",
        options: ["弱實體型態在實體關係圖裡是用雙矩形表示", "弱實體型態一定要有識別關係型態", "若一個實體型態(A)在意義上是屬於另一個實體型態(B)，則應該將A表示成弱實體型態，其主實體型態則為B", "弱實體型態的部分鍵在實體關係圖裡的表示法不同於關鍵屬性"],
        answer: "若一個實體型態(A)在意義上是屬於另一個實體型態(B)，則應該將A表示成弱實體型態，其主實體型態則為B"
    },
    {
        question: "有關以下ERD的敘述何者為非？",
        image: "images/11.png",
        options: ["一位會員可以有多筆交易", "交易一定要有會員確認", "會員不一定要有交易", "一筆交易可以為多個會員所確認"],
        answer: "一位會員可以有多筆交易"
    },
    {
        question: "下列有關關聯綱目（Relation Schema）的敘述何者錯誤？",
        options: ["一個關聯一定要有一個相對應的關聯綱目", "關聯綱目包括關聯名稱和屬性的定義", "一個關聯綱目裡只能定義一個關聯鍵", "一個關聯綱目裡只能定義一個主鍵"],
        answer: "一個關聯綱目裡只能定義一個關聯鍵"
    },
    {
        question: "下列有關關聯（Relation）的敘述何者正確？",
        options: ["關聯裡序列值是有次序的", "一個關聯裡不可以有兩筆完全相同的序列值", "關聯裡的屬性值可以是多值", "關聯裡的屬性值可以是複合的"],
        answer: "一個關聯裡不可以有兩筆完全相同的序列值"
    },
    {
        question: "下列何者為語意完整限制？",
        options: ["任兩筆序列值的主鍵值不得相同", "身分證欄位有10個字元", "每一筆購買紀錄裡的商品編號必須存在於商品關聯的編號欄位", "18歲以下的會員不得購買限制級的商品"],
        answer: "18歲以下的會員不得購買限制級的商品"
    },
    {
        question: "下列何者為非？",
        options: ["新增一筆序列值可能會違反參考完整限制", "新增一筆序列值可能會違反關聯鍵限制", "刪除一筆序列值可能會違反參考完整限制", "刪除一筆序列值可能會違反關聯鍵限制"],
        answer: "刪除一筆序列值可能會違反關聯鍵限制"
    },
    {
        question: "ERD轉成關聯綱目時，以下敘述何者為非？",
        options: ["1:1的關係型態通常不需產生額外的關聯綱目", "1:N的關係型態通常不需產生額外的關聯綱目", "M:N的關係型態通常不需產生額外的關聯綱目", "三元關係型態通常必需產生專屬的關聯綱目"],
        answer: "M:N的關係型態通常不需產生額外的關聯綱目"
    },
    {
        question: "圖3-10的四元關係型態最好表達成以下的二元關係型態：",
        image: "images/17.png",
        options: ["(老師, 學生), (學生, 教科書)，(教科書, 課程)", "(老師, 課程)，(課程, 教科書)，(教科書, 學生)", "(老師, 課程)，(課程, 教科書)，(課程，學生)", "(老師, 課程)，(課程, 教科書)，(課程，學生)，(學生，老師)"],
        answer: "(老師, 課程)，(課程, 教科書)，(課程，學生)"
    },
    {
        question: "有關以下圖3-17的ERD何者為非？",
        image: "images/18.png",
        options: ["退貨單上一定要記載客戶", "銷貨明細裡一定要記載產品資訊", "退貨明細裡一定要記載產品資訊", "退貨明細裡一定要記載原銷貨單"],
        answer: "退貨明細裡一定要記載原銷貨單"
    },
    {
        question: "以下SQL資料模式的敘述，何者為非？",
        options: ["可以不定義主鍵", "可以有兩筆記錄是一模一樣的", "資料表中的記錄是沒有次序的", "可以定義次要鍵"],
        answer: "資料表中的記錄是沒有次序的"
    },
    {
        question: "以下何者型態較少被用來定義日期資料？",
        options: ["INT", "CHAR", "DATETIME", "DATE"],
        answer: "INT"
    },
    {
        question: "以下有關定義外部鍵的SQL敘述何者為非？ FOREIGN KEYS (mId, cartTime) REFERENCE Cart",
        options: ["FOREIGN KEYS應改為FOREIGN KEY", "(mId, cartTime)應改為(mId+cartTime)", "REFERENCE 應改為 REFERENCES", "Cart後也可以接欄位名稱(mId, cartTime)"],
        answer: "(mId, cartTime)應改為(mId+cartTime)"
    },
    {
        question: "以下何種語法可以用來刪除一個外部鍵的定義？",
        options: ["DROP TABLE", "DELETE …", "ALTER TABLE …ALTER … DROP …", "ALTER TABLE …DROP CONSTRAINT …"],
        answer: "ALTER TABLE …DROP CONSTRAINT …"
    },
    {
        question: "關於以下SQL的敘述何者正確？ SELECT * FROM Member WHERE address LIKE '_高雄市%'",
        options: ["找出會員地址裡有包括”高雄市”的會員紀錄", "找出會員地址裡開頭即是”高雄市”的會員紀錄", "找出會員地址裡第二個字元開始是”高雄市”的會員紀錄", "找出會員地址裡”高雄市”位於最後的會員紀錄"],
        answer: "找出會員地址裡第二個字元開始是”高雄市”的會員紀錄"
    },
    {
        question: "假設我要找出”所有瀏覽過且購買過「系統分析理論與實務」的會員之會員編號和會員姓名，且不可重複出現”，請問該用以下哪個運算子？",
        options: ["UNION", "UNION ALL", "INTERSECT", "INTERSECT ALL"],
        answer: "INTERSECT"
    },
    {
        question: "以下何者非台灣股票上櫃公司財務報表資料庫？",
        options: ["OTCCOMP", "COMPS", "OTCCOMPO", "OTCCOMPH"],
        answer: "COMPS"
    },
    {
        question: "台灣地區期貨市場統計資料庫 FEX.bnk，原始單位提供者是",
        options: ["保發中心", "台灣期貨交易所", "台灣證券交易所", "證基會"],
        answer: "台灣期貨交易所"
    },
    {
        question: "鮮奶的銷售量可經由以下那個資料庫查詢到？",
        options: ["物價統計", "工業生產", "進出口貿易", "台灣地區批發、零售及餐飲業動態統計資料庫"],
        answer: "工業生產"
    },
    {
        question: "電視機的生產量可經由以下那個資料庫查詢到？",
        options: ["物價統計", "工業生產", "進出口貿易", "台灣地區批發、零售及餐飲業動態統計資料庫"],
        answer: "工業生產"
    },
    {
        question: "請問台灣地區工業生產統計資料庫中，不可能有下列何項資訊？",
        options: ["工業生產指數", "製造業銷售量指數", "公民營工業生產指數", "能源總需要"],
        answer: "能源總需要"
    },
    {
        question: "TEJ「國民經濟動向統計季報資料庫」含有下列那些國家主要經濟指標資料？",
        options: ["南韓", "新加坡", "香港", "以上 三者皆有"],
        answer: "以上 三者皆有"
    },
    {
        question: "依主管機關規定，自然人匯人民幣至大陸地區，於跨境貿易匯款，每人每日透過帳戶買賣金額限制為何？",
        options: ["不得逾新臺幣二萬元", "不得逾新臺幣八萬元", "不得逾人民幣二萬元", "不得逾人民幣八萬元"],
        answer: "不得逾人民幣二萬元"
    },
    {
        question: "如果李四想去希臘旅遊，最好攜帶下列哪一種外幣現鈔，在當地可適用而不會有兌換損失？",
        options: ["日圓", "美金", "英鎊", "歐元"],
        answer: "歐元"
    },
    {
        question: "境外外國金融機構得辦理匯入款項之每筆結匯金額為何？",
        options: ["未達新臺幣五十萬元", "未達五十萬美元", "未達一百萬美元", "不得以匯入款項辦理結售"],
        answer: "不得以匯入款項辦理結售"
    },
    {
        question: "依外匯收支或交易申報辦法規定，個人辦理出口貨品結匯於多少金額以上，應確認相關證明文件後始得辦理？",
        options: ["一萬美元", "二萬美元", "五十萬美元", "一百萬美元"],
        answer: "五十萬美元"
    },
    {
        question: "有關我國國民在國際機場分行簡化結匯手續之規定，下列何者為錯誤？",
        options: ["每筆限等值美金一萬元 5000元", "需出示出、入境證照", "免填身分證統一編號或護照號碼", "不必申報國別及結匯性質"],
        answer: "每筆限等值美金一萬元 5000元"
    },
    {
        question: "下列何種雲端運算的部署模型是由擁有相近利益、關注相同議題、或是屬於相同產業的企業組織，且多因為有 安全性的考量而組成的？",
        options: ["公有雲", "社群雲", "私有雲", "混合雲"],
        answer: "社群雲"
    },
    {
        question: "消費者自己掌控運作的應用程式，由雲端供應商提供應用程式運作時所需的執行環境、作業系統及硬體，是下 列何種雲端運算的服務模式？",
        options: ["基礎架構即服務", "平台即服務", "軟體即服務", "資料即服務"],
        answer: "平台即服務"
    },
    {
        question: "下列何項個人資料項目屬臺灣個人資料保護法中定義的特種個資？",
        options: ["身分證字號", "電話號碼", "護照號碼", "健康檢查"],
        answer: "健康檢查"
    },
    {
        question: "區塊鏈技術已發展出智能合約的功能，請問智能合約置放於下列何處，無法被竄改？",
        options: ["錢包軟體上", "礦工節點上", "錢包地址上", "區塊鏈上"],
        answer: "區塊鏈上"
    },
    {
        question: "公認最早將雲端運算商業化的公司為下列何者？",
        options: ["IBM", "Amazon", "Microsoft", "Google"],
        answer: "Amazon"
    },
    {
        question: "除了公有雲、私有雲、混合雲三種部署模型，美國國家標準局與技術研究院(National Insitute of Standards and Technology, NIST)還定義了下列哪一種雲？",
        options: ["社群雲", "社會雲", "國家雲", "世界雲"],
        answer: "社群雲"
    },
    {
        question: "下列何者非屬網際網路興起後的支付模式？",
        options: ["電子資金轉帳", "純網路銀行", "電子商務支付系統", "加密貨幣"],
        answer: "電子資金轉帳"
    },
    {
        question: "政府為了防止民眾遭受網路詐騙，成立哪個網站，公布假網站、假帳號及最新詐騙手法供民眾參考？",
        options: ["1999 反詐騙資訊網", "110 反詐平台", "165 全民防騙網", "168 反詐騙網"],
        answer: "165 全民防騙網"
    },
    {
        question: "下列何種雲端運算的部署模型是由協力廠商雲端服務提供者所擁有及運作，透過網際網路來使用伺服器及儲存 體等運算資源？",
        options: ["公有雲", "特有雲", "私有雲", "混合雲"],
        answer: "公有雲"
    },
    {
        question: "雲端運算對於企業的效益眾多，下列敘述何者錯誤？",
        options: ["大部分雲端服務提供商透過大量資安強化措施的宣傳及說明，來獲取使用者的信任，企業據以減少資訊安全的投資", "雲端服務可以讓企業 IT 人員將時間花在企業的核心應用或服務上，達成商業目標", "採用雲端服務後，企業可以依據使用量多寡支付多少費用，不致造成企業過大的負擔", "採用雲端服務的企業，通常可以在幾分鐘內快速大量的佈署所需的資源，讓資源配置更有效率及靈活性"],
        answer: "大部分雲端服務提供商透過大量資安強化措施的宣傳及說明，來獲取使用者的信任，企業據以減少資訊安全的投資"
    },
    {
        question: "有關結構化(Structured)的大數據資料，下列敘述何者錯誤？",
        options: ["結構化資料是指採用特定規格組成的數據資料", "結構化資料中的每筆資料都有固定的欄位、大小及格式", "結構化資料的每個欄位經過特別設計，不同意義的資料會存在同一個欄位中", "一般存在傳統資料庫裡的資料，大多都是以結構化資料方式存在"],
        answer: "結構化資料的每個欄位經過特別設計，不同意義的資料會存在同一個欄位中"
    },
    {
        question: "針對 2016 世界經濟論壇(WEF)提到影響金融業的七項新興科技，下列應用敘述何者正確？",
        options: ["「分析用戶消費習慣」屬於生物科技應用", "「從自動提款機器中提款」屬於機器學習應用", "「手機藍牙 GPS 定位技術」屬於機器人學(Robotics)應用", "「將資訊系統放入遠端虛擬伺服器」屬於雲端運算應用"],
        answer: "「將資訊系統放入遠端虛擬伺服器」屬於雲端運算應用"
    },
    {
        question: "雲端服務提供商將所有運算資源（如: 儲存空間, 記憶體, CPU 等）匯整起來，並依據使用者的需求，提供給使 用者，我們稱為三大服務模式的何種？",
        options: ["基礎架構即服務(IaaS)", "平台即服務(PaaS)", "軟體即服務(SaaS)", "訊息即服務(MaaS)"],
        answer: "基礎架構即服務(IaaS)"
    },
    {
        question: "消費者直接使用雲端業者開發完成的應用程式，完全不用理會該應用程式的技術架構、作業系統及硬體，是下列何種雲端運算的服務模式？",
        options: ["基礎架構即服務", "平台即服務", "軟體即服務", "資料即服務"],
        answer: "軟體即服務"
    },
    {
        question: "在非結構化(Unstructured)的大數據分析中，下列敘述何者錯誤？",
        options: ["非結構化資料中，資料本身格式相對不固定，資料型態也較為多元", "非結構化資料很容易以數位化直接處理及運用", "新聞資料通常屬於非結構化資料", "非結構化資料的表達及呈現較為直覺清楚，例如：影片、音樂"],
        answer: "非結構化資料很容易以數位化直接處理及運用"
    },
    {
        question: "國際數據資訊有限公司(IDC)預期未來有超過 85% 的台灣企業將規畫雲的相關部署，其中超過五成企業將部署 下列何種雲端運算的部署模型？",
        options: ["公有雲", "社群雲", "私有雲", "混合雲"],
        answer: "混合雲"
    },
    {
        question: "資料處理若存在偏差，例如貸款信用評分資訊可能會歧視貧窮人獲得貸款，這對下列何者將產生不良影響？",
        options: ["金融普惠", "金融融通", "金融發行", "金融兌換"],
        answer: "金融普惠"
    },
    {
        question: "比特幣(主網路)屬於何種形式的區塊鏈？",
        options: ["聯盟鏈", "公有鏈", "私有鏈", "混合鏈"],
        answer: "公有鏈"
    }
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let score = 0;

function loadQuiz() {
    score = 0;
    document.getElementById('quiz').innerHTML = '';
    document.getElementById('result').textContent = '';
    shuffle(questions);

    const quizDiv = document.getElementById('quiz');
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = 'question';
        const title = document.createElement('h3');
        title.textContent = `${index + 1}. ${q.question}`;
        div.appendChild(title);


        if (q.image) {
            const img = document.createElement('img');
            img.src = q.image;
            img.className = 'question-image';
            div.appendChild(img);
        }

        const optsDiv = document.createElement('div');
        optsDiv.className = 'options';
        const options = [...q.options];
        shuffle(options);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.textContent = opt;
            btn.onclick = () => {

                if (opt === q.answer) {
                    score++;
                } else {

                    btn.classList.add('wrong');
                }

                Array.from(optsDiv.children).forEach(b => b.disabled = true);
                Array.from(optsDiv.children).find(b => b.textContent === q.answer).classList.add('correct');

                const percentage = Math.round((score / questions.length) * 100);
                document.getElementById('result').textContent = `答對：${score} 題 / 共 ${questions.length} 題 (得分：${percentage} 分)`;
            };
            optsDiv.appendChild(btn);
        });

        div.appendChild(optsDiv);
        quizDiv.appendChild(div);
    });

}


document.getElementById('restart').onclick = loadQuiz;
loadQuiz();