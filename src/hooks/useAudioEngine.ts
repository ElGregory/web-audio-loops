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
  isDrum?: boolean;
  noiseLevel?: number;
  pitchDecay?: number;
}

const DEBUG_DIRECT_MONITOR = false;

export const useAudioEngine = () => {
  console.log('useAudioEngine: Hook called');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const analyserRef = useRef<AnalyserNode>();
  const masterGainRef = useRef<GainNode>();
  const masterDelayRef = useRef<DelayNode>();
  const masterReverbRef = useRef<ConvolverNode>();
  const masterFilterRef = useRef<BiquadFilterNode>();
  const dryGainRef = useRef<GainNode>();
  const wetGainRef = useRef<GainNode>();

  const initializeAudio = useCallback(async () => {
    if (audioContext && audioContext.state !== 'closed') {
      // Safari: Always try to resume if suspended
      if (audioContext.state === 'suspended') {
        try {
          await audioContext.resume();
          console.log('[AudioEngine] Resumed existing AudioContext for Safari');
        } catch (e) {
          console.warn('[AudioEngine] Failed to resume existing context', e);
        }
      }
      return;
    }

    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Safari: Context starts suspended and requires user gesture to resume
      // We'll try to resume immediately, but it may fail without user interaction
      if (ctx.state === 'suspended') {
        try {
          await ctx.resume();
          console.log('[AudioEngine] Successfully resumed AudioContext on init');
        } catch (e) {
          console.log('[AudioEngine] Context suspended - will resume on first user interaction');
        }
      }
      
      console.log('[AudioEngine] Initialized AudioContext state:', ctx.state);
      
      // Create audio nodes
      const analyser = ctx.createAnalyser();
      const masterGain = ctx.createGain();
      const masterDelay = ctx.createDelay(1.0);
      const masterFilter = ctx.createBiquadFilter();
      const dryGain = ctx.createGain();
      const wetGain = ctx.createGain();
      
      // Configure analyser
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      
      // Configure master nodes
      masterGain.gain.value = 1.0;
      dryGain.gain.value = 0.7; // Dry signal level
      wetGain.gain.value = 0.3; // Wet signal level
      
      // Configure master filter
      masterFilter.type = 'lowpass';
      masterFilter.frequency.value = 20000; // Start fully open
      masterFilter.Q.value = 1;
      
      // Configure master delay
      masterDelay.delayTime.value = 0.1; // 100ms default delay
      
      // Set up master audio chain
      // masterGain -> masterFilter -> [dry path] + [delay -> wet path] -> analyser -> destination
      masterGain.connect(masterFilter);
      masterFilter.connect(dryGain);
      masterFilter.connect(masterDelay);
      masterDelay.connect(wetGain);
      dryGain.connect(analyser);
      wetGain.connect(analyser);
      analyser.connect(ctx.destination);
      
      // Store references
      analyserRef.current = analyser;
      masterGainRef.current = masterGain;
      masterDelayRef.current = masterDelay;
      masterFilterRef.current = masterFilter;
      dryGainRef.current = dryGain;
      wetGainRef.current = wetGain;
      
      setAudioContext(ctx);
      setIsInitialized(true);
      console.log('[AudioEngine] Successfully initialized, masterGain value:', masterGain.gain.value);
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

  const playTone = useCallback(async (params: AudioParams, duration: number = 0.5) => {
    if (!audioContext || !masterGainRef.current) {
      console.error('[AudioEngine] Missing audioContext or masterGain:', { 
        hasContext: !!audioContext, 
        hasMasterGain: !!masterGainRef.current 
      });
      return;
    }

    // Safari critical: Ensure context is running before playing
    if (audioContext.state === 'closed') {
      console.warn('[AudioEngine] Context is closed; re-initialization required');
      return;
    }
    
    // Safari: MUST await resume before playing any sound
    if (audioContext.state === 'suspended') {
      console.log('[AudioEngine] Context suspended, resuming now (Safari fix)...');
      try {
        await audioContext.resume();
        console.log('[AudioEngine] Context resumed successfully, state:', audioContext.state);
      } catch (e) {
        console.error('[AudioEngine] Failed to resume context:', e);
        return; // Don't try to play if resume failed
      }
    }

    console.log('[AudioEngine] PlayTone called with state:', audioContext.state);

    if (masterGainRef.current.gain.value <= 0.0001) {
      console.warn('[AudioEngine] Master gain was near 0 – restoring to 1.0');
      masterGainRef.current.gain.setValueAtTime(1.0, audioContext.currentTime);
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
          Math.max(params.frequency * 0.3, 20), // Prevent too low frequencies
          now + (params.pitchDecay / 1000)
        );
      }
      oscillator.connect(oscGain);

      // Configure filter based on frequency - use lowpass for bass, bandpass for others
      const isBass = params.frequency < 200;
      drumFilter.type = isBass ? 'lowpass' : 'bandpass';
      drumFilter.frequency.setValueAtTime(params.filterFreq, now);
      drumFilter.Q.setValueAtTime(params.filterQ, now);

      // Set gain levels with frequency-dependent boost
      const drumBoost = isBass ? 12.0 : 10.0; // Much higher boost to match 303 levels
      const noiseLevel = Math.max(params.noiseLevel || 0, 0.1); // Higher minimum noise level
      const oscLevel = Math.max(1 - noiseLevel, 0.5); // Higher oscillator level
      
      // Enhanced gain envelope with minimum audible levels
      const minGain = 0.01; // Higher minimum gain for audibility
      
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(noiseLevel * params.volume * drumBoost, now + attackTime);
      noiseGain.gain.exponentialRampToValueAtTime(minGain, now + duration * 0.8);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(oscLevel * params.volume * drumBoost, now + attackTime);
      oscGain.gain.exponentialRampToValueAtTime(minGain, now + duration);

      // Connect main audio graph
      noiseGain.connect(mixerGain);
      oscGain.connect(mixerGain);
      mixerGain.connect(drumFilter);
      drumFilter.connect(masterGainRef.current);

      // Optional direct monitor to bypass master chain for debugging
      const monitorGain = DEBUG_DIRECT_MONITOR ? audioContext.createGain() : null;
      if (monitorGain) {
        monitorGain.gain.value = 0.5; // Increased monitor gain
        drumFilter.connect(monitorGain);
        monitorGain.connect(audioContext.destination);
      }

      // For bass frequencies, create a direct path that bypasses filtering
      let directOscGain: GainNode | null = null;
      if (isBass) {
        directOscGain = audioContext.createGain();
        oscillator.connect(directOscGain);
        directOscGain.gain.setValueAtTime(0, now);
        directOscGain.gain.linearRampToValueAtTime(oscLevel * params.volume * 0.5, now + attackTime);
        directOscGain.gain.exponentialRampToValueAtTime(minGain, now + duration);
        directOscGain.connect(masterGainRef.current);
      }

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
        try { monitorGain?.disconnect(); } catch {}
        if (directOscGain) {
          try { directOscGain.disconnect(); } catch {}
        }
      };
      
      noiseSource.onended = cleanup;
      
      console.log('[AudioEngine] playDrum', { 
        freq: params.frequency, 
        noiseLevel, 
        oscLevel,
        filterType: drumFilter.type,
        isBass,
        duration, 
        contextState: audioContext.state 
      });
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
      
      // Connect audio graph
      oscillator.connect(gainNode);
      gainNode.connect(masterGainRef.current);

      // Optional direct monitor to bypass master chain for debugging
      if (DEBUG_DIRECT_MONITOR) {
        const monitorGain = audioContext.createGain();
        monitorGain.gain.value = 0.5; // Increased monitor gain
        gainNode.connect(monitorGain);
        monitorGain.connect(audioContext.destination);
      }
      
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

  const updateMasterSettings = useCallback((settings: {
    masterVolume?: number;
    masterFilterFreq?: number;
    masterFilterQ?: number;
    masterFilterType?: "lowpass" | "highpass" | "bandpass" | "notch";
    masterDelay?: number;
    masterReverb?: number;
  }) => {
    if (!audioContext) return;
    
    const now = audioContext.currentTime;
    
    if (settings.masterVolume !== undefined && masterGainRef.current) {
      masterGainRef.current.gain.setValueAtTime(settings.masterVolume, now);
    }
    
    if (masterFilterRef.current) {
      if (settings.masterFilterFreq !== undefined) {
        masterFilterRef.current.frequency.setValueAtTime(settings.masterFilterFreq, now);
      }
      if (settings.masterFilterQ !== undefined) {
        masterFilterRef.current.Q.setValueAtTime(settings.masterFilterQ, now);
      }
      if (settings.masterFilterType !== undefined) {
        masterFilterRef.current.type = settings.masterFilterType;
      }
    }
    
    if (settings.masterDelay !== undefined && masterDelayRef.current) {
      masterDelayRef.current.delayTime.setValueAtTime(settings.masterDelay, now);
    }
    
    if (settings.masterReverb !== undefined && dryGainRef.current && wetGainRef.current) {
      // Adjust dry/wet mix for reverb simulation
      const reverbLevel = settings.masterReverb;
      dryGainRef.current.gain.setValueAtTime(1 - reverbLevel, now);
      wetGainRef.current.gain.setValueAtTime(reverbLevel, now);
    }
  }, [audioContext]);

  const updateMasterVolume = useCallback((volume: number) => {
    updateMasterSettings({ masterVolume: volume });
  }, [updateMasterSettings]);

  useEffect(() => {
    return () => {
      if (audioContext) {
        try {
          // Prefer suspend over close to avoid entering a permanent 'closed' state during dev/HMR
          if (audioContext.state !== 'closed') {
            audioContext.suspend().catch(() => {});
          }
        } catch {}
      }
    };
  }, [audioContext]);

  return {
    audioContext,
    analyser: analyserRef.current,
    isInitialized,
    initializeAudio,
    playTone,
    updateMasterVolume,
    updateMasterSettings
  };
};