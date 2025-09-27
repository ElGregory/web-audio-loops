import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioParams {
  frequency: number;
  waveform: OscillatorType;
  volume: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  filterFreq: number;
  filterQ: number;
  delay: number;
  reverb: number;
  isDrum?: boolean;
  noiseLevel?: number;
  pitchDecay?: number;
}

export const useAudioEngine = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const analyserRef = useRef<AnalyserNode>();
  const masterGainRef = useRef<GainNode>();
  const delayRef = useRef<DelayNode>();
  const reverbRef = useRef<ConvolverNode>();
  const filterRef = useRef<BiquadFilterNode>();

  const initializeAudio = useCallback(async () => {
    if (audioContext) return;

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Ensure context is running (some browsers create it suspended)
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        console.log('[AudioEngine] Initialized AudioContext state:', ctx.state);
      } catch (e) {
        console.warn('[AudioEngine] Failed to resume AudioContext on init', e);
      }
      
      // Create audio nodes
      const analyser = ctx.createAnalyser();
      const masterGain = ctx.createGain();
      const delay = ctx.createDelay(1.0);
      const filter = ctx.createBiquadFilter();
      
      // Configure analyser
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      
      // Configure master
      masterGain.gain.value = 1.0;
      
      // Configure filter
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;
      
      // Set up audio chain
      masterGain.connect(filter);
      filter.connect(delay);
      // Add a dry path to analyser to avoid silent output if delay behaves unexpectedly
      filter.connect(analyser);
      delay.connect(analyser);
      analyser.connect(ctx.destination);
      
      // Store references
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
      delayRef.current = delay;
      filterRef.current = filter;
      
      setAudioContext(ctx);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }, [audioContext]);

  const createNoiseBuffer = useCallback((duration: number) => {
    if (!audioContext) return null;
    
    const bufferSize = audioContext.sampleRate * duration;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    return noiseBuffer;
  }, [audioContext]);

  const playTone = useCallback((params: AudioParams, duration: number = 0.5) => {
    if (!audioContext || !masterGainRef.current) return;

    // Ensure context is running before playing (safety on some browsers)
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {
        console.warn('[AudioEngine] Resume failed inside playTone');
      });
    }

    const now = audioContext.currentTime;
    const attackTime = params.attack / 1000;
    const decayTime = params.decay / 1000;
    const releaseTime = params.release / 1000;

    if (params.isDrum) {
      // Drum synthesis with noise + oscillator
      const noiseBuffer = createNoiseBuffer(duration);
      if (!noiseBuffer) return;

      const noiseSource = audioContext.createBufferSource();
      const oscillator = audioContext.createOscillator();
      const noiseGain = audioContext.createGain();
      const oscGain = audioContext.createGain();
      const mixerGain = audioContext.createGain();
      const drumFilter = audioContext.createBiquadFilter();

      // Configure noise
      noiseSource.buffer = noiseBuffer;
      noiseSource.connect(noiseGain);
      
      // Configure oscillator with pitch envelope for kicks
      oscillator.type = params.waveform;
      oscillator.frequency.setValueAtTime(params.frequency, now);
      if (params.pitchDecay) {
        oscillator.frequency.exponentialRampToValueAtTime(
          params.frequency * 0.3, 
          now + (params.pitchDecay / 1000)
        );
      }
      oscillator.connect(oscGain);

      // Configure filter for drum character
      drumFilter.type = 'bandpass';
      drumFilter.frequency.setValueAtTime(params.filterFreq, now);
      drumFilter.Q.setValueAtTime(params.filterQ, now);

      // Set gain levels with drum boost
      const drumBoost = 2.5; // Boost drums to compete with other sounds
      const noiseLevel = params.noiseLevel || 0;
      const oscLevel = 1 - noiseLevel;
      
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(noiseLevel * params.volume * drumBoost, now + attackTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration * 0.8);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(oscLevel * params.volume * drumBoost, now + attackTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      // Connect audio graph
      noiseGain.connect(mixerGain);
      oscGain.connect(mixerGain);
      mixerGain.connect(drumFilter);
      drumFilter.connect(masterGainRef.current);

      // Start sources
      noiseSource.start(now);
      noiseSource.stop(now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration);

      // Cleanup
      const cleanup = () => {
        try { noiseSource.disconnect(); } catch {}
        try { oscillator.disconnect(); } catch {}
        try { noiseGain.disconnect(); } catch {}
        try { oscGain.disconnect(); } catch {}
        try { mixerGain.disconnect(); } catch {}
        try { drumFilter.disconnect(); } catch {}
      };
      
      noiseSource.onended = cleanup;
      
      console.log('[AudioEngine] playDrum', { freq: params.frequency, noiseLevel, duration });
      return noiseSource;
    } else {
      // Regular oscillator synthesis
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Configure oscillator
      oscillator.type = params.waveform;
      oscillator.frequency.setValueAtTime(params.frequency, audioContext.currentTime);
      
      // Configure envelope
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(params.volume, now + attackTime);
      gainNode.gain.linearRampToValueAtTime(params.sustain * params.volume, now + attackTime + decayTime);
      // Guard against negative time when duration < release
      const sustainHoldTime = Math.max(now, now + duration - releaseTime);
      gainNode.gain.setValueAtTime(params.sustain * params.volume, sustainHoldTime);
      gainNode.gain.linearRampToValueAtTime(0, now + duration);
      
      // Update filter parameters
      if (filterRef.current) {
        filterRef.current.frequency.setValueAtTime(params.filterFreq, now);
        filterRef.current.Q.setValueAtTime(params.filterQ, now);
      }
      
      // Update delay
      if (delayRef.current) {
        delayRef.current.delayTime.setValueAtTime(params.delay, now);
      }
      
      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current);
      
      // Cleanup after stop
      oscillator.onended = () => {
        try { oscillator.disconnect(); } catch {}
        try { gainNode.disconnect(); } catch {}
      };
      
      // Start and stop
      oscillator.start(now);
      oscillator.stop(now + duration);
      
      console.log('[AudioEngine] playTone', { freq: params.frequency, waveform: params.waveform, duration });
      return oscillator;
    }
  }, [audioContext, createNoiseBuffer]);

  const updateMasterVolume = useCallback((volume: number) => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(volume, audioContext?.currentTime || 0);
    }
  }, [audioContext]);

  useEffect(() => {
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  return {
    audioContext,
    analyser: analyserRef.current,
    isInitialized,
    initializeAudio,
    playTone,
    updateMasterVolume
  };
};