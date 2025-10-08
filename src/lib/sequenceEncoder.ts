import { Track } from "@/types/Track";
import { AudioParams } from "@/hooks/useAudioEngine";

// Compact format with bit-packed steps and compressed parameters
export const encodeSequenceToCompact = (tracks: Track[], bpm: number): string => {
  const defaultParams: AudioParams = {
    frequency: 60,
    waveform: 'sine' as OscillatorType,
    volume: 0.8,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.5,
    filterFreq: 2000,
    filterQ: 1,
    isDrum: false,
    noiseLevel: 0,
    pitchDecay: 0
  };

  const compactData = {
    ...(bpm !== 130 && { b: bpm }),
    t: tracks.filter(track => track.steps.some(step => step))
      .map(track => {
        const stepsHex = track.steps.reduce((acc, step, i) => 
          step ? acc | (1 << i) : acc, 0).toString(16);
        
        const params: any = {};
        const p = track.params;
        
        if (Math.abs(p.frequency - 60) > 5) params.f = Math.round(p.frequency);
        if (p.waveform !== 'sine') params.w = p.waveform[0];
        if (Math.abs(p.volume - 0.8) > 0.05) params.v = Math.round(p.volume * 100) / 100;
        if (p.attack > 0.02) params.a = Math.round(p.attack * 1000) / 1000;
        if (p.decay > 0.15) params.d = Math.round(p.decay * 100) / 100;
        if (Math.abs(p.sustain - 0.3) > 0.05) params.s = Math.round(p.sustain * 100) / 100;
        if (p.release > 0.6) params.r = Math.round(p.release * 100) / 100;
        if (Math.abs(p.filterFreq - 2000) > 100) params.ff = Math.round(p.filterFreq);
        if (Math.abs(p.filterQ - 1) > 0.1) params.fq = Math.round(p.filterQ * 10) / 10;
        if (p.isDrum) params.dr = 1;
        if (p.noiseLevel && p.noiseLevel > 0.01) params.nl = Math.round(p.noiseLevel * 100) / 100;
        if (p.pitchDecay && p.pitchDecay > 0.01) params.pd = Math.round(p.pitchDecay * 100) / 100;

        const result: any = {
          n: track.name.slice(0, 8),
          s: stepsHex
        };
        
        if (Object.keys(params).length > 0) result.p = params;
        if (track.muted) result.m = 1;
        if (track.solo) result.o = 1;
        if (Math.abs(track.volume - 0.8) > 0.05) result.v = Math.round(track.volume * 100) / 100;

        return result;
      })
  };

  try {
    return btoa(JSON.stringify(compactData).replace(/"/g, "'"));
  } catch (error) {
    console.error('Failed to encode sequence:', error);
    throw error;
  }
};

export const decodeSequenceFromCompact = (compact: string): { tracks: Track[], bpm: number } | null => {
  try {
    const data = JSON.parse(atob(compact).replace(/'/g, '"'));
    const bpm = data.b || 130;
    
    const defaultParams: AudioParams = {
      frequency: 60,
      waveform: 'sine' as OscillatorType,
      volume: 0.8,
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.5,
      filterFreq: 2000,
      filterQ: 1,
      isDrum: false,
      noiseLevel: 0,
      pitchDecay: 0
    };

    if (!Array.isArray(data.t)) {
      throw new Error('Invalid track data');
    }

    const tracks: Track[] = data.t.map((t: any) => {
      const stepsHex = parseInt(t.s, 16);
      const steps = Array.from({ length: 16 }, (_, i) => Boolean(stepsHex & (1 << i)));
      
      const params = { ...defaultParams };
      if (t.p) {
        Object.entries(t.p).forEach(([key, value]) => {
          if (key === 'f') params.frequency = value as number;
          else if (key === 'w') {
            const waveformMap: Record<string, OscillatorType> = {
              's': 'sine',
              'q': 'square', 
              'a': 'sawtooth',
              't': 'triangle'
            };
            params.waveform = waveformMap[value as string] || 'sine';
          }
          else if (key === 'v') params.volume = value as number;
          else if (key === 'a') params.attack = value as number;
          else if (key === 'd') params.decay = value as number;
          else if (key === 's') params.sustain = value as number;
          else if (key === 'r') params.release = value as number;
          else if (key === 'ff') params.filterFreq = value as number;
          else if (key === 'fq') params.filterQ = value as number;
          else if (key === 'dr') params.isDrum = Boolean(value);
          else if (key === 'nl') params.noiseLevel = value as number;
          else if (key === 'pd') params.pitchDecay = value as number;
        });
      }

      return {
        id: crypto.randomUUID(),
        name: t.n || 'Track',
        params,
        muted: Boolean(t.m),
        solo: Boolean(t.o),
        volume: t.v || 0.8,
        steps
      };
    });

    return { tracks, bpm };
  } catch (error) {
    console.error('Failed to decode compact sequence:', error);
    return null;
  }
};

export const encodeSequenceToEmbedUrl = (tracks: Track[], bpm: number) => {
  const compact = encodeSequenceToCompact(tracks, bpm);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('c', compact);
  return url.toString();
};

export const decodeSequenceFromUrl = (): { tracks: Track[], bpm: number } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const compact = urlParams.get('c');
  if (compact) {
    const result = decodeSequenceFromCompact(compact);
    if (result) return result;
  }
  
  return null;
};
