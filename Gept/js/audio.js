// Web Audio API Sound Effects Synthesizer for LinguaPulse
// Zero network dependencies, instant low-latency auditory feedback

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('linguapulse_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('linguapulse_muted', this.muted);
    return this.muted;
  }

  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Auditory feedbacks:
  click() {
    this.playTone(800, 'triangle', 0.05, 0.04);
  }

  correct() {
    // Joyful major chord chime: C5 -> E5 -> G5 -> C6
    this.playTone(523.25, 'sine', 0.12, 0.12, 0);
    this.playTone(659.25, 'sine', 0.15, 0.14, 0.08);
    this.playTone(783.99, 'sine', 0.2, 0.15, 0.16);
    this.playTone(1046.50, 'sine', 0.35, 0.18, 0.24);
  }

  wrong() {
    // Mild low buzzer: 220Hz -> 180Hz
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.25);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  streakBonus() {
    // Rising arpeggio for combo
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      this.playTone(freq, 'sine', 0.18, 0.15, i * 0.06);
    });
  }

  levelUp() {
    // Grand fanfare
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.12 },
      { f: 783.99, d: 0.15, t: 0.24 },
      { f: 1046.50, d: 0.4, t: 0.38 },
      { f: 1318.51, d: 0.6, t: 0.5 }
    ];
    melody.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, 0.2, n.t);
    });
  }

  tick() {
    this.playTone(1200, 'sine', 0.03, 0.03);
  }
}

window.soundEngine = new SoundEngine();
