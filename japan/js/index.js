document.addEventListener('DOMContentLoaded', function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }

    // 2. 統一宣告變數
    const elements = {
        menuToggle: document.getElementById('menuToggle'),
        navWrapper: document.getElementById('navWrapper'),
        navLinks: document.querySelectorAll('.nav-link'),
        sections: document.querySelectorAll('.day-card'),
        navIndicator: document.getElementById('navBarIndicator')
    };

    // 3. 封裝選單切換邏輯 (保留原邏輯並修正)
    function toggleMenu(forceClose = false) {
        if (!elements.menuToggle || !elements.navWrapper) return;
        
        const icon = elements.menuToggle.querySelector('i');
        
        if (forceClose) {
            elements.navWrapper.classList.remove('active');
            if (icon) icon.classList.replace('fa-times', 'fa-bars');
        } else {
            // 切換 active 狀態
            const isActive = elements.navWrapper.classList.toggle('active');
            if (icon) {
                if (isActive) {
                    icon.classList.replace('fa-bars', 'fa-times');
                } else {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        }
    }

    // 監聽按鈕點擊
    if (elements.menuToggle) {
        elements.menuToggle.addEventListener('click', function(e) {
            e.preventDefault(); // 預防預設行為
            console.log("Menu Toggle Clicked"); // 除錯用：點擊時 F12 應該要看到這行
            toggleMenu();
        });
    }

    // 4. 進度條與 Active Link 邏輯 (保留)
    function handleScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (elements.navIndicator) {
            const scrolled = (scrollTop / scrollHeight) * 100;
            elements.navIndicator.style.width = scrolled + '%';
        }

        let currentSectionId = '';
        elements.sections.forEach(section => {
            if (scrollTop >= section.offsetTop - 120) {
                currentSectionId = section.getAttribute('id');
            }
        });

        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // 5. 點擊連結事件 (平滑滾動 + 關閉選單)
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                toggleMenu(true); // 點擊後收起選單

                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(handleScrollEffects);
    });

    handleScrollEffects();
});