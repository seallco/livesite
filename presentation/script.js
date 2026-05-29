document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. 導覽列與首頁數字動畫 ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
        });
    });

    // 數字跑動特效 (43.9%)
    gsap.to({ val: 0 }, {
        val: 43.9,
        duration: 2.5,
        ease: "power2.out",
        onUpdate: function() {
            document.getElementById("hero-number").innerText = this.targets()[0].val.toFixed(1);
        },
        scrollTrigger: {
            trigger: "#hero",
            start: "top center",
        }
    });

    // --- 2. GSAP 滾動視差動畫 ---
    gsap.registerPlugin(ScrollTrigger);

    // 漸顯往上
    gsap.utils.toArray('.gsap-fade-up').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: element.style.getPropertyValue('--delay') ? parseFloat(element.style.getPropertyValue('--delay')) : 0
        });
    });

    // 左側滑入
    gsap.utils.toArray('.gsap-fade-left').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 右側滑入
    gsap.utils.toArray('.gsap-fade-right').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: "top 80%",
            },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // 放大顯現
    gsap.from('.gsap-scale-up', {
        scrollTrigger: {
            trigger: '.gsap-scale-up',
            start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    });


    // --- 3. 互動沙盤邏輯 (雙因子決策演算法) ---
    const moistureSlider = document.getElementById('moisture-slider');
    const rainSlider = document.getElementById('rain-slider');
    const moistureVal = document.getElementById('moisture-val');
    const rainVal = document.getElementById('rain-val');
    
    const displayBox = document.getElementById('sandbox-display');
    const statusIcon = document.getElementById('status-icon');
    const statusText = document.getElementById('status-text');
    const statusDesc = document.getElementById('status-desc');
    const waterAnim = document.getElementById('water-animation');
    const rainAnim = document.getElementById('rain-animation');
    
    const navStatus = document.getElementById('nav-status');
    const navStatusMobile = document.getElementById('nav-status-mobile');

    function updateSandbox() {
        const m = parseInt(moistureSlider.value);
        const r = parseInt(rainSlider.value);

        moistureVal.innerText = m + "%";
        rainVal.innerText = r + "%";

        // 動畫基礎重置
        waterAnim.style.height = '0%';
        rainAnim.style.opacity = '0';
        displayBox.className = "bg-slate-900 rounded-2xl p-6 md:p-8 border border-white/10 h-64 md:h-80 flex flex-col justify-center items-center text-center relative overflow-hidden transition-colors duration-500";

        let newStatusText = "";
        let newStatusClass = "";

        // 決策邏輯
        if (m < 10) {
            // 極端跌破：強制救急
            statusIcon.innerText = "🚑";
            statusText.innerText = "強制救急澆灌";
            statusText.className = "text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-wide text-amber-400";
            statusDesc.innerText = "土壤極度乾燥，無視預報直接補水";
            displayBox.classList.add("border-amber-500", "shadow-[0_0_30px_rgba(245,158,11,0.2)]");
            waterAnim.style.height = '50%';
            waterAnim.className = "absolute bottom-0 left-0 w-full bg-amber-500/30 transition-all duration-500";
            
            newStatusText = "救急中";
            newStatusClass = "text-amber-400 font-bold";
        } 
        else if (m < 30 && r < 70) {
            // 正常澆水
            statusIcon.innerText = "🌊";
            statusText.innerText = "精準澆灌中";
            statusText.className = "text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-wide text-blue-400";
            statusDesc.innerText = "土壤缺水且無大雨，啟動水泵";
            displayBox.classList.add("border-blue-500", "shadow-[0_0_30px_rgba(59,130,246,0.2)]");
            waterAnim.style.height = '40%';
            waterAnim.className = "absolute bottom-0 left-0 w-full bg-blue-500/30 transition-all duration-500";
            
            newStatusText = "澆水區";
            newStatusClass = "text-blue-400 font-bold";
        }
        else if (m < 30 && r >= 70) {
            // 預判攔截
            statusIcon.innerText = "🚫💧";
            statusText.innerText = "休眠攔截中";
            statusText.className = "text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-wide text-red-400";
            statusDesc.innerText = "預報即將降雨，停止水泵避免浪費";
            displayBox.classList.add("border-red-500", "shadow-[0_0_30px_rgba(239,68,68,0.2)]");
            rainAnim.style.opacity = '1'; // 模擬下雨
            
            newStatusText = "攔截中";
            newStatusClass = "text-red-400 font-bold";
        }
        else {
            // 待命
            statusIcon.innerText = "🌱";
            statusText.innerText = "待命中";
            statusText.className = "text-2xl md:text-3xl font-black mb-1 md:mb-2 tracking-wide text-white";
            statusDesc.innerText = "土壤濕潤，不需澆灌";
            
            newStatusText = "監測中";
            newStatusClass = "text-cyan-300 font-bold";
        }

        // Sync both Desktop and Mobile navigation status
        navStatus.innerText = newStatusText;
        navStatus.className = newStatusClass;
        if (navStatusMobile) {
            navStatusMobile.innerText = newStatusText;
            navStatusMobile.className = newStatusClass;
        }
    }

    moistureSlider.addEventListener('input', updateSandbox);
    rainSlider.addEventListener('input', updateSandbox);

    // --- 4. Chart.js 成效圖表 ---
    let chartRendered = false;
    
    ScrollTrigger.create({
        trigger: "#results",
        start: "top center",
        onEnter: () => {
            if(!chartRendered) {
                renderChart();
                chartRendered = true;
            }
        }
    });

    function renderChart() {
        const ctx = document.getElementById('resultsChart').getContext('2d');
        Chart.defaults.color = '#cbd5e1';
        Chart.defaults.font.family = "'Noto Sans TC', sans-serif";

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['對照組 (傳統)', '實驗組 (本系統)'],
                datasets: [{
                    label: '總耗水量 (公升)',
                    data: [56.0, 31.4],
                    backgroundColor: [
                        'rgba(100, 116, 139, 0.6)', // Slate
                        'rgba(6, 182, 212, 0.8)'    // Cyan
                    ],
                    borderColor: [
                        'rgba(100, 116, 139, 1)',
                        'rgba(6, 182, 212, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '耗水量 (L)',
                            color: '#94a3b8'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    }

    // 手機版卡片點擊翻轉 (解決無 hover 狀態的問題)
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
});