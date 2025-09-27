import { AudioParams } from '@/hooks/useAudioEngine';

export interface Track {
  id: string;
  name: string;
  params: AudioParams;
  muted: boolean;
  solo: boolean;
  volume: number;
  steps: boolean[];
}

export interface TrackPreset {
  name: string;
  params: AudioParams;
  category: 'roland-303' | 'roland-909' | 'custom';
}

export const ROLAND_303_PRESETS: TrackPreset[] = [
  {
    name: '303 Acid Bass',
    category: 'roland-303',
    params: {
      frequency: 55,
      waveform: 'sawtooth',
      volume: 0.8,
      attack: 1,
      decay: 150,
      sustain: 0.4,
      release: 200,
      filterFreq: 800,
      filterQ: 8,
      delay: 0.05,
      reverb: 0.1,
    }
  },
  {
    name: '303 Lead',
    category: 'roland-303',
    params: {
      frequency: 220,
      waveform: 'square',
      volume: 0.7,
      attack: 5,
      decay: 100,
      sustain: 0.6,
      release: 150,
      filterFreq: 1200,
      filterQ: 6,
      delay: 0.08,
      reverb: 0.15,
    }
  },
  {
    name: '303 Squelch',
    category: 'roland-303',
    params: {
      frequency: 110,
      waveform: 'sawtooth',
      volume: 0.9,
      attack: 1,
      decay: 80,
      sustain: 0.2,
      release: 120,
      filterFreq: 400,
      filterQ: 12,
      delay: 0.03,
      reverb: 0.05,
    }
  }
];

export const ROLAND_909_PRESETS: TrackPreset[] = [
  {
    name: '909 Kick',
    category: 'roland-909',
    params: {
      frequency: 80,
      waveform: 'sine',
      volume: 1.2,
      attack: 1,
      decay: 200,
      sustain: 0.1,
      release: 300,
      filterFreq: 120,
      filterQ: 1,
      delay: 0,
      reverb: 0.05,
      isDrum: true,
      noiseLevel: 0.15,
      pitchDecay: 50,
    }
  },
  {
    name: '909 Snare',
    category: 'roland-909',
    params: {
      frequency: 220,
      waveform: 'triangle',
      volume: 1.0,
      attack: 1,
      decay: 100,
      sustain: 0.3,
      release: 150,
      filterFreq: 3000,
      filterQ: 2,
      delay: 0.02,
      reverb: 0.2,
      isDrum: true,
      noiseLevel: 0.7,
      pitchDecay: 20,
    }
  },
  {
    name: '909 Hi-Hat',
    category: 'roland-909',
    params: {
      frequency: 8000,
      waveform: 'square',
      volume: 0.8,
      attack: 1,
      decay: 50,
      sustain: 0.1,
      release: 80,
      filterFreq: 12000,
      filterQ: 3,
      delay: 0.01,
      reverb: 0.1,
      isDrum: true,
      noiseLevel: 0.9,
      pitchDecay: 10,
    }
  },
  {
    name: '909 Open Hat',
    category: 'roland-909',
    params: {
      frequency: 6000,
      waveform: 'square',
      volume: 0.7,
      attack: 1,
      decay: 250,
      sustain: 0.2,
      release: 400,
      filterFreq: 8000,
      filterQ: 2,
      delay: 0.02,
      reverb: 0.25,
      isDrum: true,
      noiseLevel: 0.8,
      pitchDecay: 30,
    }
  },
  {
    name: '909 Deep Bass',
    category: 'roland-909',
    params: {
      frequency: 45,
      waveform: 'sine',
      volume: 1.3,
      attack: 1,
      decay: 350,
      sustain: 0.2,
      release: 500,
      filterFreq: 80,
      filterQ: 1.5,
      delay: 0,
      reverb: 0.08,
      isDrum: true,
      noiseLevel: 0.1,
      pitchDecay: 80,
    }
  },
  {
    name: '909 Sub Bass',
    category: 'roland-909',
    params: {
      frequency: 35,
      waveform: 'sine',
      volume: 1.4,
      attack: 2,
      decay: 400,
      sustain: 0.3,
      release: 600,
      filterFreq: 60,
      filterQ: 2,
      delay: 0,
      reverb: 0.05,
      isDrum: true,
      noiseLevel: 0.05,
      pitchDecay: 100,
    }
  },
  {
    name: '909 Punchy Bass',
    category: 'roland-909',
    params: {
      frequency: 65,
      waveform: 'sine',
      volume: 1.1,
      attack: 1,
      decay: 120,
      sustain: 0.1,
      release: 180,
      filterFreq: 150,
      filterQ: 1,
      delay: 0,
      reverb: 0.03,
      isDrum: true,
      noiseLevel: 0.2,
      pitchDecay: 40,
    }
  },
  {
    name: '909 Boomy Bass',
    category: 'roland-909',
    params: {
      frequency: 55,
      waveform: 'triangle',
      volume: 1.2,
      attack: 3,
      decay: 280,
      sustain: 0.15,
      release: 450,
      filterFreq: 100,
      filterQ: 1.2,
      delay: 0,
      reverb: 0.12,
      isDrum: true,
      noiseLevel: 0.12,
      pitchDecay: 70,
    }
  }
];