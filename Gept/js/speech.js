// Web Speech API Integration for LinguaPulse
// Text-to-Speech (TTS) & Speech Recognition (STT)

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.selectedVoice = null;
    this.recognition = null;
    this.isListening = false;
    this.preferredAccent = 'en-US'; // 'en-US' | 'en-GB' | 'en-AU'
    this.initVoices();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }

    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return;

    this.allVoices = voices;
    this.updateSelectedVoice();
  }

  setAccent(accentLang = 'en-US') {
    this.preferredAccent = accentLang;
    this.updateSelectedVoice();
  }

  updateSelectedVoice() {
    if (!this.allVoices || this.allVoices.length === 0) {
      if (this.synth) this.allVoices = this.synth.getVoices();
    }
    const voices = this.allVoices || [];
    const accent = this.preferredAccent || 'en-US';

    // 1. 優先精確符合目前選擇口音（例如 en-US / en-GB / en-AU）
    const matchedAccentVoices = voices.filter(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(accent.toLowerCase())
    );

    // 2. 針對各作業系統（macOS / iOS / Windows / ChromeOS）選擇最自然的真人語音
    const premiumKeywords = ['Natural', 'Siri', 'Premium', 'Google', 'Samantha', 'Karen', 'Daniel', 'Ava', 'Allison', 'Zira', 'George'];
    
    let bestVoice = null;

    if (matchedAccentVoices.length > 0) {
      for (const kw of premiumKeywords) {
        bestVoice = matchedAccentVoices.find(v => v.name.includes(kw));
        if (bestVoice) break;
      }
      if (!bestVoice) bestVoice = matchedAccentVoices[0];
    } else {
      // 若該口音無專屬庫，退回任何英文語音
      const anyEn = voices.filter(v => v.lang.startsWith('en'));
      bestVoice = anyEn[0] || voices[0];
    }

    this.selectedVoice = bestVoice;
    console.log(`[SpeechEngine] Active voice: ${this.selectedVoice?.name} (${this.selectedVoice?.lang})`);
  }

  speak(text, options = {}) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = options.voice || this.selectedVoice;
    utterance.rate = options.rate || this.rate;
    utterance.pitch = options.pitch || this.pitch;
    utterance.lang = options.lang || 'en-US';

    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  startListening(onResult, onEnd, onError) {
    if (!this.recognition) {
      if (onError) onError('Your browser does not support Speech Recognition. Try Chrome or Edge.');
      return false;
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          final: finalTranscript.trim(),
          interim: interimTranscript.trim(),
          confidence: event.results[0] && event.results[0][0] ? event.results[0][0].confidence : 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Speech recognition start error:', e);
      this.isListening = false;
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Calculate similarity score between spoken and target text (0 to 100%)
  evaluatePronunciation(spoken, target) {
    if (!spoken) return { score: 0, matchedWords: [] };

    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

    if (cleanTarget.length === 0) return { score: 100, matchedWords: [] };

    let matches = 0;
    const wordStatuses = cleanTarget.map(targetWord => {
      const isMatched = cleanSpoken.includes(targetWord);
      if (isMatched) matches++;
      return { word: targetWord, matched: isMatched };
    });

    const score = Math.min(100, Math.round((matches / cleanTarget.length) * 100));
    return {
      score,
      wordStatuses,
      spoken,
      target
    };
  }
}

window.speechEngine = new SpeechEngine();
