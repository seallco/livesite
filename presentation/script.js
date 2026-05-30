document.addEventListener('DOMContentLoaded', () => {

    // --- 0. 封面體驗動畫 ---
    const introCover = document.getElementById('intro-cover');
    const introStartBtn = document.getElementById('intro-start-btn');
    const introRain = document.getElementById('intro-rain');
    const introWetBg = document.getElementById('intro-wet-bg');
    const introSky = document.getElementById('intro-sky');
    const introSun = document.getElementById('intro-sun');
    const introClouds = document.getElementById('intro-clouds');
    const introGrass = document.getElementById('intro-grass');

    const introTitle = document.getElementById('intro-title');
    const introTitleHighlight = document.getElementById('intro-title-highlight');
    const introDesc = document.getElementById('intro-desc');

    if (introCover && introStartBtn) {
        introStartBtn.addEventListener('click', () => {
            // 1. 按鈕消失，切換文案，準備下雨
            introStartBtn.style.opacity = '0';
            introStartBtn.style.pointerEvents = 'none';

            introDesc.innerText = "系統偵測土壤乾燥，分析氣象預報降雨機率...";

            // 天空變暗，烏雲出現，太陽隱藏
            if (introSky) {
                introSky.classList.remove('from-orange-400', 'via-orange-200', 'to-orange-100');
                introSky.classList.add('from-gray-700', 'via-gray-600', 'to-gray-500');
            }
            if (introSun) {
                introSun.style.transform = 'translateY(50px) scale(0.8)';
                introSun.style.opacity = '0';
            }
            if (introClouds) {
                introClouds.style.opacity = '1';
                introClouds.style.transform = 'translateY(0)';
            }

            // 2. 開始下雨，土地變濕潤
            setTimeout(() => {
                if (introRain) introRain.style.opacity = '1';
                if (introDesc) introDesc.innerText = "偵測到下雨，啟動攔截機制，暫停灑水。";
                if (introWetBg) introWetBg.style.opacity = '1'; // 土地變濕

                // 字體顏色轉白，適應下雨天
                if (introTitle) {
                    introTitle.classList.remove('text-[#4a2e15]');
                    introTitle.classList.add('text-white');
                }
            }, 1500);

            // 3. 雨停，天空放晴，長出草叢
            setTimeout(() => {
                if (introRain) introRain.style.opacity = '0';
                if (introClouds) {
                    introClouds.style.opacity = '0';
                    introClouds.style.transform = 'translateY(-10px)';
                }

                // 天空變回晴朗藍天
                if (introSky) {
                    introSky.classList.remove('from-gray-700', 'via-gray-600', 'to-gray-500');
                    introSky.classList.add('from-blue-400', 'via-blue-300', 'to-blue-100');
                }

                // 太陽重新升起 (溫和的陽光)
                if (introSun) {
                    introSun.style.transform = 'translateY(0) scale(1)';
                    introSun.style.opacity = '1';
                    const sunGlow = document.getElementById('intro-sun-glow');
                    if (sunGlow) {
                        sunGlow.classList.remove('from-yellow-100', 'to-orange-500', 'shadow-[0_0_120px_40px_rgba(249,115,22,0.9)]');
                        sunGlow.classList.add('from-yellow-50', 'to-yellow-300', 'shadow-[0_0_100px_30px_rgba(253,224,71,0.8)]');
                    }
                }

                // 草叢長出
                if (introGrass) introGrass.style.transform = 'translateY(0)';

                // 文字轉為綠色生機
                if (introTitle) {
                    introTitle.classList.remove('text-white');
                    introTitle.classList.add('text-green-900');
                }
                if (introTitleHighlight) {
                    introTitleHighlight.classList.remove('text-red-600');
                    introTitleHighlight.classList.add('text-green-600');
                }

                if (introDesc) {
                    introDesc.classList.remove('text-orange-900');
                    introDesc.classList.add('text-green-800');
                    introDesc.innerText = "土壤達到最適濕度，智慧省水達 43.9%！";
                }
            }, 4000);

            // 4. 收起封面，正式進入系統
            setTimeout(() => {
                if (introCover) introCover.style.transform = 'translateY(-100%)';
                document.body.classList.remove('intro-active');
            }, 7000);

            // 5. 播放主畫面的「節水率成長動畫」並清理 DOM
            setTimeout(() => {
                if (introCover) introCover.remove();
                if (typeof playHeroAnimation === 'function') playHeroAnimation();
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            }, 8500);
        });
    } else {
        // 若無封面直接播放
        if (typeof playHeroAnimation === 'function') setTimeout(playHeroAnimation, 500);
    }

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

    // 數字跑動特效 (43.9%) - 獨立為函數以在封面動畫結束後觸發
    window.playHeroAnimation = function () {
        gsap.to({ val: 0 }, {
            val: 43.9,
            duration: 3,
            ease: "power2.out",
            onUpdate: function () {
                const el = document.getElementById("hero-number");
                if (el) el.innerText = this.targets()[0].val.toFixed(1);
            }
        });
    };

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


    // --- 3. 互動沙盤邏輯 (雙因子決策演算法 - 實驗室版本) ---
    const moistureSlider = document.getElementById('moisture-slider');
    const rainSlider = document.getElementById('rain-slider');
    const moistureVal = document.getElementById('moisture-val');
    const rainVal = document.getElementById('rain-val');

    // 實驗室 UI 元素
    const labSky = document.getElementById('lab-sky');
    const labSun = document.getElementById('lab-sun');
    const labClouds = document.getElementById('lab-clouds');
    const labRain = document.getElementById('lab-rain');
    const labEarthCracked = document.getElementById('lab-earth-cracked');
    const labEarthWet = document.getElementById('lab-earth-wet');
    const labPlant = document.getElementById('lab-plant');
    const labWaterPool = document.getElementById('lab-water-pool');
    const hudMoisture = document.getElementById('hud-moisture');
    const hudRain = document.getElementById('hud-rain');
    const statusText = document.getElementById('status-text');

    const navStatus = document.getElementById('nav-status');
    const navStatusMobile = document.getElementById('nav-status-mobile');

    function updateSandbox() {
        const m = parseInt(moistureSlider.value);
        const r = parseInt(rainSlider.value);

        moistureVal.innerText = m + "%";
        rainVal.innerText = r + "%";
        if (hudMoisture) hudMoisture.innerText = `M_SENSOR: ${m}%`;
        if (hudRain) hudRain.innerText = `API_FCST: ${r}%`;

        // 漸變式：土壤乾燥度與裂痕
        let crackedOpacity = Math.max(0, (40 - m) / 40); // 40%開始出現裂痕，0%時最深
        labEarthCracked.style.opacity = crackedOpacity;

        // 漸變式：植物狀態
        if (m < 15) {
            labPlant.style.transform = 'scaleY(0.7) rotate(15deg)';
            labPlant.style.filter = 'grayscale(80%) hue-rotate(30deg)';
        } else if (m < 30) {
            labPlant.style.transform = 'scaleY(0.85) rotate(5deg)';
            labPlant.style.filter = 'grayscale(40%)';
        } else {
            labPlant.style.transform = 'scaleY(1) rotate(0deg)';
            labPlant.style.filter = 'grayscale(0%)';
        }

        // 漸變式：烏雲密佈與天空變暗
        let cloudOpacity = Math.max(0, (r - 20) / 60); // 降雨機率20%開始聚集，80%最暗
        labClouds.style.opacity = cloudOpacity;

        if (r > 50) {
            labSky.className = "absolute top-0 left-0 w-full h-full transition-colors duration-[2000ms] bg-gradient-to-b from-gray-700 to-gray-500";
            labSun.style.opacity = 0;
        } else {
            labSky.className = "absolute top-0 left-0 w-full h-full transition-colors duration-[2000ms] bg-gradient-to-b from-blue-300 to-blue-100";
            labSun.style.opacity = 1 - (r / 50);
        }

        let newStatusText = "";
        let newStatusClass = "";

        // 重置暫時的動畫狀態
        labRain.style.opacity = 0;
        labEarthWet.style.opacity = 0;
        labWaterPool.style.height = '0%';

        // 雙因子決策邏輯
        if (m < 10) {
            // 極端跌破：強制救急
            statusText.innerText = "🚨 系統警告：極度乾燥，強制降水";
            statusText.className = "text-sm md:text-base font-bold tracking-wide text-amber-400 bg-black/80 px-4 py-2 rounded-lg border border-amber-500/50 font-mono shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all duration-300";

            // 緊急降水特效
            labRain.style.opacity = 1;
            labEarthWet.style.opacity = 1;

            // 從地表生出一點點的水，讓土地變得濕潤
            labWaterPool.style.height = '15%';
            labEarthCracked.style.opacity = 0.1; // 水覆蓋裂痕

            // 植物開始稍微恢復
            labPlant.style.transform = 'scaleY(0.9) rotate(0deg)';
            labPlant.style.filter = 'grayscale(10%)';

            newStatusText = "救急中";
            newStatusClass = "text-amber-400 font-bold";
        }
        else if (m < 30 && r < 70) {
            // 正常精準澆水
            statusText.innerText = "💧 啟動水泵：精準補水";
            statusText.className = "text-sm md:text-base font-bold tracking-wide text-blue-400 bg-black/80 px-4 py-2 rounded-lg border border-blue-500/50 font-mono shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300";

            labEarthWet.style.opacity = 0.8;
            labWaterPool.style.height = '8%'; // 稍微有些水分累積
            labEarthCracked.style.opacity = 0.2;

            newStatusText = "澆水區";
            newStatusClass = "text-blue-400 font-bold";
        }
        else if (m < 30 && r >= 70) {
            // 預判攔截
            statusText.innerText = "☁️ 預報攔截：即將降雨，暫停水泵";
            statusText.className = "text-sm md:text-base font-bold tracking-wide text-red-400 bg-black/80 px-4 py-2 rounded-lg border border-red-500/50 font-mono shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300";

            // 保持乾燥，天空強制變更暗
            labClouds.style.opacity = 1;
            labSky.className = "absolute top-0 left-0 w-full h-full transition-colors duration-[2000ms] bg-gradient-to-b from-gray-800 to-gray-600";
            labSun.style.opacity = 0;

            newStatusText = "攔截中";
            newStatusClass = "text-red-400 font-bold";
        }
        else {
            // 系統待命
            statusText.innerText = "🟢 系統待命：環境數據正常";
            statusText.className = "text-sm md:text-base font-bold tracking-wide text-green-400 bg-black/80 px-4 py-2 rounded-lg border border-green-500/50 font-mono shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-300";

            if (m > 60) {
                labEarthWet.style.opacity = (m - 60) / 40; // 如果濕度超高，土壤也顯示漸漸濕潤
            }

            newStatusText = "監測中";
            newStatusClass = "text-cyan-300 font-bold";
        }

        // 同步導覽列狀態
        navStatus.innerText = newStatusText;
        navStatus.className = newStatusClass;
        if (navStatusMobile) {
            navStatusMobile.innerText = newStatusText;
            navStatusMobile.className = newStatusClass;
        }
    }

    moistureSlider.addEventListener('input', updateSandbox);
    rainSlider.addEventListener('input', updateSandbox);

    // 初始化沙盤狀態
    updateSandbox();

    // 自動模擬序列腳本
    const autoSimBtn = document.getElementById('auto-sim-btn');
    if (autoSimBtn) {
        autoSimBtn.addEventListener('click', async () => {
            autoSimBtn.disabled = true;
            autoSimBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> 模擬進行中...';
            autoSimBtn.classList.replace('bg-cyan-600', 'bg-gray-600');

            // 滑桿平滑漸變函數
            const animateSlider = (slider, targetValue, duration) => {
                return new Promise(resolve => {
                    const startValue = parseInt(slider.value);
                    const startTime = performance.now();

                    const step = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease In Out
                        const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                        slider.value = startValue + (targetValue - startValue) * easeProgress;
                        slider.dispatchEvent(new Event('input'));

                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            resolve();
                        }
                    };
                    requestAnimationFrame(step);
                });
            };

            // 【劇情腳本開始】

            // 1. 系統預設狀態 (濕潤，天氣晴朗)
            await animateSlider(moistureSlider, 60, 1000);
            await animateSlider(rainSlider, 20, 1000);
            await new Promise(r => setTimeout(r, 1000));

            // 2. 土地漸漸乾燥，植物枯萎 (濕度降至 25%)
            await animateSlider(moistureSlider, 25, 3000);
            await new Promise(r => setTimeout(r, 1500));

            // 3. 天氣預報改變，烏雲密佈 (降雨機率升至 85%) -> 觸發攔截機制
            await animateSlider(rainSlider, 85, 3000);
            await new Promise(r => setTimeout(r, 2500));

            // 4. 經過漫長等待，遲遲未下雨，極度乾燥 (濕度跌至 8%) -> 觸發緊急降水
            await animateSlider(moistureSlider, 8, 2500);

            // 欣賞緊急降水與地表稍微積水漸變的過程
            await new Promise(r => setTimeout(r, 3500));

            // 5. 危機解除，土地變回濕潤，雲層散去
            animateSlider(rainSlider, 20, 2000);
            await animateSlider(moistureSlider, 80, 3000);

            // 【劇情腳本結束】

            autoSimBtn.disabled = false;
            autoSimBtn.innerHTML = '▶️ 執行完整氣候模擬序列';
            autoSimBtn.classList.replace('bg-gray-600', 'bg-cyan-600');
        });
    }

    // --- 4. 動態水柱圖表 ---
    let waterRendered = false;

    ScrollTrigger.create({
        trigger: "#results",
        start: "top center",
        onEnter: () => {
            if (!waterRendered) {
                renderWaterTanks();
                waterRendered = true;
            }
        }
    });

    function renderWaterTanks() {
        const fills = document.querySelectorAll('.water-fill');
        const labels = document.querySelectorAll('.water-label');
        const streams = document.querySelectorAll('.water-pour-stream');

        fills.forEach((fill, index) => {
            const targetHeight = fill.getAttribute('data-target');
            setTimeout(() => {
                fill.style.height = targetHeight + '%';
            }, 100);
        });

        streams.forEach(stream => {
            stream.style.opacity = '1';
            setTimeout(() => {
                stream.style.transition = 'opacity 0.5s ease';
                stream.style.opacity = '0';
            }, 3000);
        });

        labels.forEach(label => {
            const targetValue = parseFloat(label.getAttribute('data-value'));
            gsap.to({ val: 0 }, {
                val: targetValue,
                duration: 3,
                ease: "power2.out",
                onUpdate: function () {
                    label.innerText = this.targets()[0].val.toFixed(1) + " L";
                }
            });
        });
    }

    // 手機版卡片點擊翻轉 (解決無 hover 狀態的問題)
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', function () {
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
                addCmdMessage('🔄 實驗已重置為初始狀態。');

            } else {
                addCmdMessage('⚠️ 未知的指令。試試輸入：「澆水」、「下雨」、「待命」、「看成效」、「重置」。');
            }
        }, 500);
    }
});