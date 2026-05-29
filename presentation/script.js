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
                    hoverBackgroundColor: [
                        'rgba(100, 116, 139, 0.9)', 
                        'rgba(34, 211, 238, 1)'     
                    ],
                    borderColor: [
                        'rgba(100, 116, 139, 1)',
                        'rgba(6, 182, 212, 1)'
                    ],
                    borderWidth: 2,
                    hoverBorderWidth: 4,
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
                onHover: (event, chartElement) => {
                    event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
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

    // --- 5. AI 系統中控台 (對話指令) ---
    const cmdToggleBtn = document.getElementById('cmd-toggle-btn');
    const cmdCloseBtn = document.getElementById('cmd-close-btn');
    const cmdPanel = document.getElementById('cmd-panel');
    const cmdInput = document.getElementById('cmd-input');
    const cmdMessages = document.getElementById('cmd-messages');

    function toggleCmdPanel() {
        if (cmdPanel.classList.contains('hidden')) {
            cmdPanel.classList.remove('hidden');
            setTimeout(() => {
                cmdPanel.classList.add('cmd-panel-active');
                cmdInput.focus();
            }, 10);
        } else {
            cmdPanel.classList.remove('cmd-panel-active');
            setTimeout(() => {
                cmdPanel.classList.add('hidden');
            }, 300);
        }
    }

    cmdToggleBtn.addEventListener('click', toggleCmdPanel);
    cmdCloseBtn.addEventListener('click', toggleCmdPanel);

    function addCmdMessage(text, sender = 'system') {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'cmd-msg-enter';
        
        if (sender === 'user') {
            msgDiv.innerHTML = `<span class="text-gray-400">你:</span> <span class="text-white">${text}</span>`;
        } else {
            msgDiv.innerHTML = `<span class="text-cyan-400">系統:</span> <span class="text-blue-200">${text}</span>`;
        }
        
        cmdMessages.appendChild(msgDiv);
        cmdMessages.scrollTop = cmdMessages.scrollHeight;
    }

    cmdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && cmdInput.value.trim() !== '') {
            const command = cmdInput.value.trim();
            addCmdMessage(command, 'user');
            cmdInput.value = '';
            processCommand(command);
        }
    });

    function processCommand(cmd) {
        const normalizedCmd = cmd.toLowerCase();
        
        // 模擬系統處理延遲，讓對話感更真實
        setTimeout(() => {
            if (normalizedCmd.includes('澆水') || normalizedCmd.includes('缺水') || normalizedCmd.includes('乾')) {
                // 強制救急
                moistureSlider.value = 5;
                rainSlider.value = 20;
                moistureSlider.dispatchEvent(new Event('input')); // 觸發 updateSandbox
                
                document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
                addCmdMessage('💦 收到指令！檢測到極端乾燥，已覆寫沙盤數值，啟動強制救急澆灌機制。');
                
            } else if (normalizedCmd.includes('下雨') || normalizedCmd.includes('預報') || normalizedCmd.includes('攔截')) {
                // 預判攔截
                moistureSlider.value = 20;
                rainSlider.value = 90;
                moistureSlider.dispatchEvent(new Event('input'));
                
                document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
                addCmdMessage('🚫💧 收到指令！已將降雨機率調至 90%，觸發「休眠攔截機制」，為您停止灑水。');
                
            } else if (normalizedCmd.includes('待命') || normalizedCmd.includes('正常') || normalizedCmd.includes('濕潤')) {
                // 待命
                moistureSlider.value = 70;
                rainSlider.value = 20;
                moistureSlider.dispatchEvent(new Event('input'));
                
                document.getElementById('sandbox').scrollIntoView({ behavior: 'smooth' });
                addCmdMessage('🌱 收到指令！沙盤已重置為濕潤狀態，系統進入待命監測。');
                
            } else if (normalizedCmd.includes('成效') || normalizedCmd.includes('數據') || normalizedCmd.includes('結果')) {
                document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
                addCmdMessage('📊 已為您導航至成效分析區塊，展示 14 天實測對決數據。');
                
            } else if (normalizedCmd.includes('動機') || normalizedCmd.includes('問題')) {
                document.getElementById('motivation').scrollIntoView({ behavior: 'smooth' });
                addCmdMessage('🔍 已為您導航至研究動機區塊。');
                
            } else if (normalizedCmd.includes('重置') || normalizedCmd.includes('reset')) {
                moistureSlider.value = 40;
                rainSlider.value = 20;
                moistureSlider.dispatchEvent(new Event('input'));
                addCmdMessage('🔄 系統控制面板已重置為初始狀態。');
                
            } else {
                addCmdMessage('⚠️ 未知的指令。試試輸入：「澆水」、「下雨」、「待命」、「看成效」、「重置」。');
            }
        }, 500); 
    }
});