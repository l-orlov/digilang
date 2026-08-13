/**
 * Música ambiental generativa, sintetizada en el navegador con Web Audio
 * API — sin archivo de audio (evita cualquier tema de licencia y pesa 0
 * bytes). Dron cálido (acorde simple raíz/quinta/octava a través de un
 * lowpass con LFO lento) + una melodía pentatónica simple que va tocando
 * notas sueltas de tanto en tanto, con delay para dar atmósfera.
 *
 * El AudioContext solo se crea en start() — nunca antes de un gesto del
 * usuario, como exigen los navegadores.
 */

const ROOT_HZ = 220; // A3
const DRONE_INTERVALS = [0, 7, 12]; // raíz, quinta, octava
const PENTATONIC = [0, 3, 5, 7, 10]; // pentatónica menor

class AmbientAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private delay: DelayNode | null = null;
  private arpTimer: number | null = null;
  playing = false;

  private ensureGraph() {
    if (this.ctx) return this.ctx;

    const ctx = new AudioContext();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.7;
    filter.connect(master);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    DRONE_INTERVALS.forEach((semi, i) => {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = ROOT_HZ * 2 ** (semi / 12);
      osc.detune.value = (Math.random() - 0.5) * 6;
      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.5 : 0.22;
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
    });

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.45;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(master);
    this.delay = delay;

    return ctx;
  }

  private scheduleArp() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.delay) return;

    const playNote = () => {
      if (!this.playing || !this.ctx || !this.master || !this.delay) return;
      const semi = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
      const octaveUp = Math.random() > 0.6 ? 12 : 0;
      const freq = ROOT_HZ * 2 * 2 ** ((semi + octaveUp) / 12);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      osc.connect(gain);
      gain.connect(this.delay);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + 1.2);

      this.arpTimer = window.setTimeout(playNote, 1400 + Math.random() * 900);
    };

    playNote();
  }

  start() {
    const ctx = this.ensureGraph();
    if (ctx.state === 'suspended') ctx.resume();

    const master = this.master!;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5);

    this.playing = true;
    this.scheduleArp();
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;

    this.playing = false;
    if (this.arpTimer !== null) {
      window.clearTimeout(this.arpTimer);
      this.arpTimer = null;
    }

    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setValueAtTime(this.master.gain.value, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    window.setTimeout(() => ctx.state === 'running' && ctx.suspend(), 850);
  }
}

let instance: AmbientAudio | null = null;

export function getAmbientAudio(): AmbientAudio {
  if (!instance) instance = new AmbientAudio();
  return instance;
}
