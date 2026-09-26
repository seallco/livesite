function stopAllGameTimersAndSounds() {
      // 停止 Game 2 Tempo 節拍
      if (typeof g2Interval !== 'undefined' && g2Interval) {
        clearInterval(g2Interval);
        g2Interval = null;
      }
      if (typeof g2Running !== 'undefined') g2Running = false;
      const g2Btn = document.getElementById('g2-btn-toggle');
      if (g2Btn) g2Btn.textContent = '▶️ 開始節拍';
      for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`b-${i}`);
        if (dot) dot.classList.remove('active');
      }

      // 停止 Game 3 大電視計時
      if (typeof g3Timer !== 'undefined' && g3Timer) {
        clearInterval(g3Timer);
        g3Timer = null;
      }

      // 停止 Game 4 默契倒數
      if (typeof g4CountdownTimer !== 'undefined' && g4CountdownTimer) {
        clearInterval(g4CountdownTimer);
        g4CountdownTimer = null;
      }
      const g4Display = document.getElementById('g4-countdown-display');
      if (g4Display) g4Display.textContent = '';

      // 停止 Game 6 炸彈計時
      if (typeof g6BombTimer !== 'undefined' && g6BombTimer) {
        clearInterval(g6BombTimer);
        g6BombTimer = null;
      }
      if (typeof g6BombRunning !== 'undefined') g6BombRunning = false;
      const g6Status = document.getElementById('g6-bomb-status');
      if (g6Status) {
        g6Status.textContent = '💣 炸彈狀態：未啟動（請點擊下方開始）';
        g6Status.style.color = '#ff3366';
      }

      // 停止 Game 7 快問快答計時
      if (typeof g7PanicTimer !== 'undefined' && g7PanicTimer) {
        clearInterval(g7PanicTimer);
        g7PanicTimer = null;
      }
      const g7TimerText = document.getElementById('g7-timer-text');
      if (g7TimerText) g7TimerText.textContent = '⏱️ 3.0 秒';
      const g7TimerFill = document.getElementById('g7-timer-fill');
      if (g7TimerFill) g7TimerFill.style.width = '100%';

      // 停止 Game 10 傳話筒計時
      if (typeof g10Timer !== 'undefined' && g10Timer) {
        clearInterval(g10Timer);
        g10Timer = null;
      }

      // 停止 Game 11 注音找物計時
      if (typeof g11Timer !== 'undefined' && g11Timer) {
        clearInterval(g11Timer);
        g11Timer = null;
      }

      // 停止 Game 12 接力計時
      if (typeof g12Timer !== 'undefined' && g12Timer) {
        clearInterval(g12Timer);
        g12Timer = null;
      }
      if (typeof g12ViewTimer !== 'undefined' && g12ViewTimer) {
        clearInterval(g12ViewTimer);
        g12ViewTimer = null;
      }
    }

    function switchView(viewName) {
      stopAllGameTimersAndSounds();
      document.querySelectorAll('.game-view').forEach(v => v.classList.remove('active'));
      const lobby = document.getElementById('view-lobby');

      if (viewName === 'lobby') {
        lobby.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        lobby.style.display = 'none';
        const target = document.getElementById(`view-game-${viewName}`);
        if (target) {
          target.classList.add('active');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (viewName === '1' && typeof g1DrawnCount !== 'undefined' && g1DrawnCount === 0) {
            drawGame1();
          }
          if (viewName === '2' && typeof g2DrawnCount !== 'undefined' && g2DrawnCount === 0) {
            applyNextG2Topic();
          }
          if (viewName === '3' && typeof g3DrawnCount !== 'undefined' && g3DrawnCount === 0) {
            nextG3Word();
          }
          if (viewName === '4' && typeof g4DrawnCount !== 'undefined' && g4DrawnCount === 0) {
            applyNextG4Question();
          }
          if (viewName === '5' && typeof g5DrawnCount !== 'undefined' && g5DrawnCount === 0) {
            const startBtn = document.getElementById('g5-btn-start');
            if (startBtn) startBtn.click();
          }
          if (viewName === '6' && typeof g6DrawnCount !== 'undefined' && g6DrawnCount === 0) {
            applyNextG6Topic();
          }
          if (viewName === '7' && typeof g7DrawnCount !== 'undefined' && g7DrawnCount === 0) {
            applyNextG7Question();
          }
          if (viewName === '8' && typeof g8DrawnCount !== 'undefined' && g8DrawnCount === 0) {
            applyNextG8Word();
          }
          if (viewName === '9') {
            if (typeof initG9 === 'function') initG9();
          }
          if (viewName === '10' && typeof g10DrawnCount !== 'undefined' && g10DrawnCount === 0) {
            applyNextG10Sentence();
          }
          if (viewName === '11') {
            if (typeof g11DrawnCount !== 'undefined' && g11DrawnCount === 0) {
              drawNextG11Card();
            }
          }
          if (viewName === '12') {
            if (typeof g12DrawnCount !== 'undefined' && g12DrawnCount === 0) {
              drawNextG12Topic();
            }
            if (typeof initG12Canvas === 'function') {
              setTimeout(initG12Canvas, 60);
            }
          }
          if (viewName === '13') {
            if (typeof initG13 === 'function') {
              initG13();
            }
          }
        }
      }
    }

    document.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => {
        const gameId = card.dataset.game;
        switchView(gameId);
      });
    });

    document.getElementById('btn-home-nav').addEventListener('click', () => switchView('lobby'));
    document.getElementById('btn-goto-lobby').addEventListener('click', () => switchView('lobby'));

    /* ==========================================================
       3. 全域比分與搶答管理系統 (橋接 partyHub 高度自由自訂系統)
       ========================================================== */
    function confettiEffect() {
      if (window.confetti) confetti({ particleCount: 45, spread: 65, origin: { y: 0.75 } });
    }
    window.confettiEffect = confettiEffect;

    function modifyPlayerScore(pId, delta) {
      if (typeof partyHub !== 'undefined') {
        partyHub.modifyScore('player', pId, delta);
      }
    }

    function modifyTeamScore(teamId, delta) {
      if (typeof partyHub !== 'undefined') {
        partyHub.modifyScore('team', teamId, delta);
      }
    }

    function resetAllScores() {
      if (typeof partyHub !== 'undefined') {
        partyHub.resetScores();
      }
    }

    const resetScoreBtn = document.getElementById('btn-reset-scores');
    if (resetScoreBtn) {
      resetScoreBtn.addEventListener('click', resetAllScores);
    }

    function triggerBuzzer(targetId) {
      if (typeof partyHub !== 'undefined') {
        partyHub.triggerBuzzer(targetId);
      }
    }

    window.triggerBuzzer = triggerBuzzer;
    window.modifyPlayerScore = modifyPlayerScore;
    window.modifyTeamScore = modifyTeamScore;
    window.resetAllScores = resetAllScores;
    window.switchView = switchView;

    // 彈窗開關綁定
    const scoreDrawerModal = document.getElementById('modal-score-drawer');
    const btnScoreDrawer = document.getElementById('btn-score-drawer');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');

    if (btnScoreDrawer) {
      btnScoreDrawer.addEventListener('click', () => {
        if (scoreDrawerModal) {
          scoreDrawerModal.classList.add('open');
          if (typeof partyHub !== 'undefined') partyHub.render();
        }
      });
    }

    if (btnCloseDrawer && scoreDrawerModal) {
      btnCloseDrawer.addEventListener('click', () => {
        scoreDrawerModal.classList.remove('open');
      });
      scoreDrawerModal.addEventListener('click', (e) => {
        if (e.target === scoreDrawerModal) scoreDrawerModal.classList.remove('open');
      });
    }



    // 空白鍵抽卡監聽 (Game 1 & Game 11)
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        const g1 = document.getElementById('view-game-1');
        if (g1 && g1.classList.contains('active')) {
          e.preventDefault();
          drawGame1();
        }
        const g11 = document.getElementById('view-game-11');
        if (g11 && g11.classList.contains('active')) {
          e.preventDefault();
          drawNextG11Card();
        }
      }
    });

    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    if (btnSoundToggle) {
      btnSoundToggle.addEventListener('click', () => {
        audio.enabled = !audio.enabled;
        const icon = document.getElementById('sound-icon');
        if (icon) icon.textContent = audio.enabled ? '🔊' : '🔇';
      });
    }