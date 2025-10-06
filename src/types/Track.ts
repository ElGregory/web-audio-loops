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
  category: 'roland-303' | 'roland-808' | 'roland-909' | 'bass' | 'lead' | 'pad' | 'custom';
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
    }
  }
];

export const ROLAND_808_PRESETS: TrackPreset[] = [
  {
    name: '808 Kick',
    category: 'roland-808',
    params: {
      frequency: 60,
      waveform: 'sine',
      volume: 1.0,
      attack: 1,
      decay: 400,
      sustain: 0.1,
      release: 600,
      filterFreq: 150,
      filterQ: 1,
      isDrum: true,
      noiseLevel: 0.15,
      pitchDecay: 120,
    }
  },
  {
    name: '808 Snare',
    category: 'roland-808',
    params: {
      frequency: 180,
      waveform: 'triangle',
      volume: 0.9,
      attack: 1,
      decay: 120,
      sustain: 0.2,
      release: 180,
      filterFreq: 4000,
      filterQ: 2,
      isDrum: true,
      noiseLevel: 0.8,
      pitchDecay: 25,
    }
  },
  {
    name: '808 Clap',
    category: 'roland-808',
    params: {
      frequency: 1000,
      waveform: 'square',
      volume: 0.85,
      attack: 1,
      decay: 80,
      sustain: 0.15,
      release: 120,
      filterFreq: 3500,
      filterQ: 2.5,
      isDrum: true,
      noiseLevel: 0.95,
      pitchDecay: 15,
    }
  },
  {
    name: '808 Cowbell',
    category: 'roland-808',
    params: {
      frequency: 540,
      waveform: 'square',
      volume: 0.8,
      attack: 1,
      decay: 200,
      sustain: 0.3,
      release: 300,
      filterFreq: 2000,
      filterQ: 4,
      isDrum: true,
      noiseLevel: 0.2,
      pitchDecay: 30,
    }
  },
  {
    name: '808 Rim Shot',
    category: 'roland-808',
    params: {
      frequency: 320,
      waveform: 'triangle',
      volume: 0.75,
      attack: 1,
      decay: 60,
      sustain: 0.1,
      release: 100,
      filterFreq: 5000,
      filterQ: 3,
      isDrum: true,
      noiseLevel: 0.5,
      pitchDecay: 10,
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
      volume: 1.0,
      attack: 1,
      decay: 200,
      sustain: 0.1,
      release: 300,
      filterFreq: 200,
      filterQ: 1,
      isDrum: true,
      noiseLevel: 0.25,
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
      volume: 1.0,
      attack: 1,
      decay: 350,
      sustain: 0.2,
      release: 500,
      filterFreq: 120,
      filterQ: 1.2,
      isDrum: true,
      noiseLevel: 0.15,
      pitchDecay: 80,
    }
  },
  {
    name: '909 Sub Bass',
    category: 'roland-909',
    params: {
      frequency: 35,
      waveform: 'sine',
      volume: 1.0,
      attack: 2,
      decay: 400,
      sustain: 0.3,
      release: 600,
      filterFreq: 80,
      filterQ: 1.5,
      isDrum: true,
      noiseLevel: 0.1,
      pitchDecay: 100,
    }
  },
  {
    name: '909 Punchy Bass',
    category: 'roland-909',
    params: {
      frequency: 65,
      waveform: 'sine',
      volume: 1.0,
      attack: 1,
      decay: 120,
      sustain: 0.1,
      release: 180,
      filterFreq: 180,
      filterQ: 1,
      isDrum: true,
      noiseLevel: 0.25,
      pitchDecay: 40,
    }
  },
  {
    name: '909 Boomy Bass',
    category: 'roland-909',
    params: {
      frequency: 55,
      waveform: 'triangle',
      volume: 1.0,
      attack: 3,
      decay: 280,
      sustain: 0.15,
      release: 450,
      filterFreq: 150,
      filterQ: 1.2,
      isDrum: true,
      noiseLevel: 0.2,
      pitchDecay: 70,
    }
  }
];

export const BASS_PRESETS: TrackPreset[] = [
  {
    name: 'Reese Bass',
    category: 'bass',
    params: {
      frequency: 55,
      waveform: 'sawtooth',
      volume: 0.9,
      attack: 5,
      decay: 300,
      sustain: 0.8,
      release: 400,
      filterFreq: 600,
      filterQ: 4,
    }
  },
  {
    name: 'Moog Bass',
    category: 'bass',
    params: {
      frequency: 65,
      waveform: 'sawtooth',
      volume: 0.85,
      attack: 3,
      decay: 180,
      sustain: 0.6,
      release: 250,
      filterFreq: 400,
      filterQ: 6,
    }
  },
  {
    name: 'Sub Bass',
    category: 'bass',
    params: {
      frequency: 40,
      waveform: 'sine',
      volume: 1.0,
      attack: 5,
      decay: 500,
      sustain: 0.9,
      release: 600,
      filterFreq: 100,
      filterQ: 1,
    }
  },
  {
    name: 'FM Bass',
    category: 'bass',
    params: {
      frequency: 80,
      waveform: 'square',
      volume: 0.8,
      attack: 1,
      decay: 150,
      sustain: 0.4,
      release: 200,
      filterFreq: 800,
      filterQ: 5,
    }
  }
];

export const LEAD_PRESETS: TrackPreset[] = [
  {
    name: 'Saw Lead',
    category: 'lead',
    params: {
      frequency: 440,
      waveform: 'sawtooth',
      volume: 0.7,
      attack: 10,
      decay: 100,
      sustain: 0.7,
      release: 200,
      filterFreq: 2500,
      filterQ: 4,
    }
  },
  {
    name: 'Square Lead',
    category: 'lead',
    params: {
      frequency: 440,
      waveform: 'square',
      volume: 0.65,
      attack: 8,
      decay: 120,
      sustain: 0.65,
      release: 180,
      filterFreq: 2000,
      filterQ: 3,
    }
  },
  {
    name: 'Pluck Synth',
    category: 'lead',
    params: {
      frequency: 880,
      waveform: 'triangle',
      volume: 0.75,
      attack: 1,
      decay: 80,
      sustain: 0.3,
      release: 100,
      filterFreq: 3000,
      filterQ: 6,
    }
  },
  {
    name: 'Rave Stab',
    category: 'lead',
    params: {
      frequency: 220,
      waveform: 'sawtooth',
      volume: 0.85,
      attack: 5,
      decay: 150,
      sustain: 0.5,
      release: 250,
      filterFreq: 1500,
      filterQ: 8,
    }
  }
];

export const PAD_PRESETS: TrackPreset[] = [
  {
    name: 'Warm Pad',
    category: 'pad',
    params: {
      frequency: 220,
      waveform: 'sawtooth',
      volume: 0.5,
      attack: 200,
      decay: 300,
      sustain: 0.8,
      release: 800,
      filterFreq: 1200,
      filterQ: 2,
    }
  },
  {
    name: 'String Pad',
    category: 'pad',
    params: {
      frequency: 330,
      waveform: 'sawtooth',
      volume: 0.55,
      attack: 250,
      decay: 400,
      sustain: 0.85,
      release: 1000,
      filterFreq: 1800,
      filterQ: 2.5,
    }
  },
  {
    name: 'Noise Sweep',
    category: 'pad',
    params: {
      frequency: 1000,
      waveform: 'square',
      volume: 0.6,
      attack: 100,
      decay: 500,
      sustain: 0.6,
      release: 600,
      filterFreq: 500,
      filterQ: 10,
      isDrum: true,
      noiseLevel: 0.7,
    }
  }
];