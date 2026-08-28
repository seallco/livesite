document.addEventListener('DOMContentLoaded', () => {
    // 1. 初始化頁面資訊
    document.title = siteConfig.siteName;
    document.getElementById('site-name').textContent = siteConfig.siteName;
    document.getElementById('page-desc').textContent = siteConfig.siteDescription;
    document.getElementById('site-footer').textContent = siteConfig.footerText;

    const contentContainer = document.getElementById('content-container');
    const sidebarNav = document.getElementById('sidebar-nav');

    // 2. 渲染函數 (Render)
    function renderContent(filterText = "") {
        contentContainer.innerHTML = ""; // 清空
        sidebarNav.innerHTML = "";       // 清空側邊欄導航

        // 建立側邊欄：獨立應用直達 (Direct Featured Apps)
        if (filterText === "") {
            const directGroupTitle = document.createElement('div');
            directGroupTitle.className = 'nav-group-title';
            directGroupTitle.innerHTML = '<i class="fa-solid fa-star"></i> 核心應用直達';
            sidebarNav.appendChild(directGroupTitle);

            // 提取所有帶有標籤或重要直連項目
            const featuredItems = [
                { title: "產線良率統計", link: "./統計工具/index.html", icon: "fa-solid fa-industry", tag: "New", tagClass: "badge-new" },
                { title: "LinguaPulse 英語", link: "./Gept/index.html", icon: "fa-solid fa-bolt", tag: "Hot", tagClass: "badge-hot" },
                { title: "智慧精準灌溉", link: "./presentation/index.html", icon: "fa-solid fa-droplet", tag: "Featured", tagClass: "badge-featured" }
            ];

            featuredItems.forEach(item => {
                const a = document.createElement('a');
                a.href = item.link;
                a.className = 'nav-featured';
                a.innerHTML = `
                    <span class="nav-left">
                        <i class="${item.icon}" style="color: var(--primary);"></i>
                        <span>${item.title}</span>
                    </span>
                    <span class="nav-badge-pill ${item.tagClass}">${item.tag}</span>
                `;
                sidebarNav.appendChild(a);
            });

            const categoryGroupTitle = document.createElement('div');
            categoryGroupTitle.className = 'nav-group-title';
            categoryGroupTitle.innerHTML = '<i class="fa-solid fa-layer-group"></i> 專案分類目錄';
            sidebarNav.appendChild(categoryGroupTitle);
        }

        siteConfig.sections.forEach((section, index) => {
            // 搜尋過濾邏輯
            const filteredItems = section.items.filter(item => 
                item.title.toLowerCase().includes(filterText.toLowerCase()) ||
                item.desc.toLowerCase().includes(filterText.toLowerCase())
            );

            if (filteredItems.length === 0 && filterText !== "") return;

            // 建立區塊標題
            const sectionId = `section-${index}`;
            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'section-title';
            sectionTitle.innerHTML = `<i class="${section.icon}"></i> ${section.title}`;
            sectionTitle.id = sectionId;
            contentContainer.appendChild(sectionTitle);

            // 加入側邊欄連結
            const navLink = document.createElement('a');
            navLink.href = `#${sectionId}`;
            navLink.innerHTML = `
                <span class="nav-left">
                    <i class="${section.icon}"></i>
                    <span>${section.title}</span>
                </span>
                <i class="fa-solid fa-angle-right" style="font-size: 11px; opacity: 0.5;"></i>
            `;
            sidebarNav.appendChild(navLink);

            // 建立內容容器 (Card 或 List)
            if (section.type === 'list') {
                const listGroup = document.createElement('div');
                listGroup.className = 'list-container';
                
                filteredItems.forEach(item => {
                    const a = document.createElement('a');
                    a.className = 'list-item';
                    a.href = item.link;
                    a.target = item.link.startsWith('http') ? '_blank' : '_self';
                    a.innerHTML = `
                        <span class="list-title"><b>${item.title}</b></span>
                        <span class="list-desc">${item.desc}</span>
                    `;
                    listGroup.appendChild(a);
                });
                contentContainer.appendChild(listGroup);

            } else {
                // Card Style (預設)
                const grid = document.createElement('div');
                grid.className = 'grid-container';

                filteredItems.forEach(item => {
                    const a = document.createElement('a');
                    a.className = 'card';
                    a.href = item.link;
                    a.target = item.link.startsWith('http') ? '_blank' : '_self';
                    const iconClass = item.icon || 'fa-regular fa-folder-open';
                    a.innerHTML = `
                        <div class="card-top">
                            <i class="${iconClass}" style="color:var(--primary); font-size: 1.25rem;"></i>
                            ${item.tag ? `<span class="tag">${item.tag}</span>` : ''}
                        </div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    `;
                    grid.appendChild(a);
                });
                contentContainer.appendChild(grid);
            }
        });
    }

    // 3. 初始渲染
    renderContent();

    // 4. 綁定搜尋功能
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        renderContent(e.target.value);
    });
});