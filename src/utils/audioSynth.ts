// Web Audio API Procedural Spiritual Ambiance Synthesizer
class SpiritualAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private bellInterval: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public start() {
    this.init();
    if (!this.ctx || this.isRunning) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isRunning = true;

    // Tanpura Drone Fundamental (Root Sa / Pa harmonics)
    const now = this.ctx.currentTime;

    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc2 = this.ctx.createOscillator();

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.08, now);

    this.droneOsc1.type = 'sine';
    this.droneOsc1.frequency.setValueAtTime(136.1, now); // 136.1 Hz (OM / C# Frequency)

    this.droneOsc2.type = 'triangle';
    this.droneOsc2.frequency.setValueAtTime(204.15, now); // Pa (Fifth)

    this.droneOsc1.connect(droneGain);
    this.droneOsc2.connect(droneGain);
    droneGain.connect(this.masterGain!);

    this.droneOsc1.start(now);
    this.droneOsc2.start(now);

    // Periodic Temple Bell chime sound
    this.triggerBell();
    this.bellInterval = window.setInterval(() => {
      if (this.isRunning) {
        this.triggerBell();
      }
    }, 7000);
  }

  public updateMoodForTime(time: number) {
    if (!this.ctx || !this.isRunning || !this.droneOsc1 || !this.droneOsc2) return;
    const now = this.ctx.currentTime;

    // Dynamically modulate frequency based on story chapter mood
    if (time <= 9) {
      // Dawn (136.1 Hz OM)
      this.droneOsc1.frequency.setTargetAtTime(136.1, now, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(204.15, now, 0.5);
    } else if (time > 9 && time <= 23) {
      // Mahishasura & Indralok Fall (Lower Deep Crimson Frequency 108 Hz)
      this.droneOsc1.frequency.setTargetAtTime(108.0, now, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(162.0, now, 0.5);
    } else if (time > 23 && time <= 45) {
      // Durga Awakening (Bright Radiant Frequency 144 Hz)
      this.droneOsc1.frequency.setTargetAtTime(144.0, now, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(216.0, now, 0.5);
    } else if (time > 45 && time <= 64) {
      // Battle (Resonant Frequency 153.2 Hz)
      this.droneOsc1.frequency.setTargetAtTime(153.2, now, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(229.8, now, 0.5);
    } else {
      // Bisorjon / Dawn Peace (136.1 Hz OM)
      this.droneOsc1.frequency.setTargetAtTime(136.1, now, 0.5);
      this.droneOsc2.frequency.setTargetAtTime(204.15, now, 0.5);
    }
  }

  public triggerBell() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High temple bell harmonic frequency
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1080 + Math.random() * 120, now);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 3.6);
  }

  public pause() {
    if (!this.ctx || !this.isRunning) return;
    this.isRunning = false;

    if (this.droneOsc1) {
      try { this.droneOsc1.stop(); } catch { }
    }
    if (this.droneOsc2) {
      try { this.droneOsc2.stop(); } catch { }
    }
    if (this.bellInterval) {
      clearInterval(this.bellInterval);
    }
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(val * 0.2, this.ctx.currentTime);
    }
  }
}

export const spiritualAudioEngine = new SpiritualAudioEngine();
