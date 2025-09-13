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
      
      // Create audio nodes
      const analyser = ctx.createAnalyser();
      const masterGain = ctx.createGain();
      const delay = ctx.createDelay(1.0);
      const filter = ctx.createBiquadFilter();
      
      // Configure analyser
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      
      // Configure filter
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;
      
      // Set up audio chain
      masterGain.connect(filter);
      filter.connect(delay);
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

  const playTone = useCallback((params: AudioParams, duration: number = 0.5) => {
    if (!audioContext || !masterGainRef.current) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = params.waveform;
    oscillator.frequency.setValueAtTime(params.frequency, audioContext.currentTime);
    
    // Configure envelope
    const now = audioContext.currentTime;
    const attackTime = params.attack / 1000;
    const decayTime = params.decay / 1000;
    const releaseTime = params.release / 1000;
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(params.volume, now + attackTime);
    gainNode.gain.linearRampToValueAtTime(params.sustain * params.volume, now + attackTime + decayTime);
    gainNode.gain.setValueAtTime(params.sustain * params.volume, now + duration - releaseTime);
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
    
    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    return oscillator;
  }, [audioContext]);

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