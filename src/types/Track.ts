import { AudioParams } from '@/hooks/useAudioEngine';

export interface Track {
  id: string;
  name: string;
  params: AudioParams;
  muted: boolean;
  solo: boolean;
  volume: number;
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
      frequency: 60,
      waveform: 'sine',
      volume: 1.0,
      attack: 1,
      decay: 200,
      sustain: 0.1,
      release: 300,
      filterFreq: 150,
      filterQ: 2,
      delay: 0,
      reverb: 0.05,
    }
  },
  {
    name: '909 Snare',
    category: 'roland-909',
    params: {
      frequency: 200,
      waveform: 'square',
      volume: 0.8,
      attack: 1,
      decay: 100,
      sustain: 0.3,
      release: 150,
      filterFreq: 2000,
      filterQ: 3,
      delay: 0.02,
      reverb: 0.2,
    }
  },
  {
    name: '909 Hi-Hat',
    category: 'roland-909',
    params: {
      frequency: 1200,
      waveform: 'square',
      volume: 0.6,
      attack: 1,
      decay: 50,
      sustain: 0.1,
      release: 80,
      filterFreq: 8000,
      filterQ: 5,
      delay: 0.01,
      reverb: 0.1,
    }
  },
  {
    name: '909 Open Hat',
    category: 'roland-909',
    params: {
      frequency: 1000,
      waveform: 'square',
      volume: 0.5,
      attack: 1,
      decay: 250,
      sustain: 0.2,
      release: 400,
      filterFreq: 6000,
      filterQ: 4,
      delay: 0.02,
      reverb: 0.25,
    }
  }
];