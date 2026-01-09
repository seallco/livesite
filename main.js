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
            navLink.innerHTML = `<i class="${section.icon}"></i> ${section.title.split(' ')[0]}`; // 只取第一個詞當導航
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
                    a.innerHTML = `
                        <div class="card-top">
                            <i class="fa-regular fa-folder-open" style="color:var(--primary)"></i>
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