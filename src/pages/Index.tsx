import { useState, useRef, useCallback, useEffect } from "react";
import { useAudioEngine, AudioParams } from "@/hooks/useAudioEngine";
import { Waveform } from "@/components/Waveform";
import { TrackMixer } from "@/components/TrackMixer";
import { MasterControls, MasterSettings } from "@/components/MasterControls";
import { TrackEditor } from "@/components/TrackEditor";
import { MasterTransport } from "@/components/MasterTransport";
import { Soundboard } from "@/components/Soundboard";
import { Track, ROLAND_909_PRESETS, ROLAND_303_PRESETS } from "@/types/Track";
import { Button } from "@/components/ui/button";
import { Zap, Settings, Save, Share } from "lucide-react";
import { toast } from "sonner";

// URL sharing utilities

// Compact format with bit-packed steps and compressed parameters
const encodeSequenceToCompact = (tracks: Track[], bpm: number): string => {
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

  // Ultra-compact format - even more aggressive compression
  const compactData = {
    ...(bpm !== 130 && { b: bpm }), // Only store if different from default
    t: tracks.filter(track => track.steps.some(step => step)) // Remove completely empty tracks
      .map(track => {
        // Convert step pattern to hex (16 bits max)
        const stepsHex = track.steps.reduce((acc, step, i) => 
          step ? acc | (1 << i) : acc, 0).toString(16);
        
        // Ultra-compressed parameters - only store significantly different values
        const params: any = {};
        const p = track.params;
        
        // Use tolerance for floating point comparisons and round values
        if (Math.abs(p.frequency - 60) > 5) params.f = Math.round(p.frequency);
        if (p.waveform !== 'sine') params.w = p.waveform[0]; // First letter only
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
          n: track.name.slice(0, 8), // Truncate names to 8 chars
          s: stepsHex
        };
        
        // Only add these if they're not default
        if (Object.keys(params).length > 0) result.p = params;
        if (track.muted) result.m = 1;
        if (track.solo) result.o = 1;
        if (Math.abs(track.volume - 0.8) > 0.05) result.v = Math.round(track.volume * 100) / 100;

        return result;
      })
  };

  // Use shorter JSON with minimal spacing
  return btoa(JSON.stringify(compactData).replace(/"/g, "'"));
};

const decodeSequenceFromCompact = (compact: string): { tracks: Track[], bpm: number } | null => {
  try {
    // Handle the single-quote JSON format
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

    const tracks: Track[] = data.t.map((t: any) => {
      // Decode hex steps back to boolean array
      const stepsHex = parseInt(t.s, 16);
      const steps = Array.from({ length: 16 }, (_, i) => Boolean(stepsHex & (1 << i)));
      
      // Restore full parameters
      const params = { ...defaultParams };
      if (t.p) {
        Object.entries(t.p).forEach(([key, value]) => {
          if (key === 'f') params.frequency = value as number;
          else if (key === 'w') {
            // Restore waveform from first letter
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
        name: t.n,
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

// Legacy readable format for fallback
const encodeSequenceToReadable = (tracks: Track[], bpm: number) => {
  const sequenceData = {
    bpm,
    tracks: tracks.map(track => ({
      name: track.name,
      params: track.params,
      muted: track.muted,
      solo: track.solo,
      volume: track.volume,
      steps: track.steps
    }))
  };
  
  const encoded = btoa(JSON.stringify(sequenceData));
  return encoded;
};

const decodeSequenceFromReadable = (readable: string): { tracks: Track[], bpm: number } | null => {
  try {
    // Try base64 decoding first (new format)
    const decoded = JSON.parse(atob(readable));
    const tracks = decoded.tracks.map((track: any) => ({
      ...track,
      id: crypto.randomUUID() // Generate new IDs for shared tracks
    }));
    
    return { tracks, bpm: decoded.bpm || 130 };
  } catch (error) {
    console.error('Failed to decode sequence from URL:', error);
    return null;
  }
};


const encodeSequenceToEmbedUrl = (tracks: Track[], bpm: number) => {
  // Always use compact encoding - build a clean URL with only ?c=
  const compact = encodeSequenceToCompact(tracks, bpm);
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('c', compact);
  return url.toString();
};

const decodeSequenceFromUrl = (): { tracks: Track[], bpm: number } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Try compact format first
  const compact = urlParams.get('c');
  if (compact) {
    const result = decodeSequenceFromCompact(compact);
    if (result) return result;
  }
  
  // Fall back to readable format
  const loop = urlParams.get('loop');
  if (loop) {
    const result = decodeSequenceFromReadable(loop);
    if (result) return result;
  }
  
  return null;
};

const Index = () => {
  console.log('Index.tsx: Starting component initialization');
  const { audioContext, analyser, isInitialized, initializeAudio, playTone, updateMasterVolume, updateMasterSettings } = useAudioEngine();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [bpm, setBpm] = useState(130);
  const [isTransportPlaying, setIsTransportPlaying] = useState(false);
  const [masterSettings, setMasterSettings] = useState<MasterSettings>({
    masterVolume: 1.0,
    masterFilterFreq: 20000, // Fully open
    masterFilterQ: 1,
    masterFilterType: 'lowpass',
    masterDelay: 0.1,
    masterReverb: 0.0,
  });
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isTrackEditorOpen, setIsTrackEditorOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tracksRef = useRef<Track[]>(tracks);
  const stepsCount = 16;

  // Suggest a musically sensible note duration based on params (ms-based)
  const getSuggestedNoteDuration = (params: AudioParams) => {
    const base = (params.decay + params.release) / 1000; // params are ms in presets
    if (params.isDrum) {
      const f = params.frequency;
      if (f >= 3000) return Math.min(Math.max(base || 0.15, 0.08), 0.22); // hats
      if (f < 150)   return Math.min(Math.max(base || 0.4,  0.3), 0.65);   // kicks/bass
      return Math.min(Math.max(base || 0.25, 0.18), 0.35);                 // snares/toms
    }
    return Math.min(Math.max(base || 0.35, 0.2), 1.2);
  };

  // Keep tracks ref updated
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  // Check if there's a shared sequence
  const hasSharedSequence = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('loop');
  };

  // Load sequence from URL on mount
  useEffect(() => {
    const sharedSequence = decodeSequenceFromUrl();
    if (sharedSequence) {
      setTracks(sharedSequence.tracks);
      setBpm(sharedSequence.bpm);
      toast("Loaded shared sequence!");
    }
  }, []);

  

  const handleInitAudio = async () => {
    await initializeAudio();
    try {
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
        console.log('[Audio] Context resumed after init');
      }
      if (audioContext?.state === 'closed') {
        // Edge case: if previous context was closed, try initializing again
        await initializeAudio();
      }
    } catch (e) {
      console.error('[Audio] Failed to resume context:', e);
    }
    toast("Audio engine initialized! Ready to make some noise!");
    
    // Initialize master settings
    if (updateMasterSettings) {
      updateMasterSettings(masterSettings);
    }
    
    if (tracks.length > 0) {
      setShouldAutoplay(true);
    }
  };

  const handleReset = () => {
    setTracks([]);
    setBpm(130);
    setMasterSettings({
      masterVolume: 1.0,
      masterFilterFreq: 20000,
      masterFilterQ: 1,
      masterFilterType: 'lowpass',
      masterDelay: 0.1,
      masterReverb: 0.0,
    });
    stopTransport();
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
    
    toast("Reset complete - all tracks and settings cleared!");
  };


  const playActiveTracksForStep = useCallback((step: number) => {
    if (!isInitialized) return;
    
    const currentTracks = tracksRef.current;
    console.log(`[Transport] Step ${step}, Total tracks: ${currentTracks.length}`);
    
    const hasSoloTracks = currentTracks.some(t => t.solo);
    const playableTracks = currentTracks.filter(track => {
      const shouldPlay = hasSoloTracks ? track.solo && !track.muted : !track.muted;
      const hasActiveStep = track.steps[step];
      console.log(`[Transport] Track "${track.name}": shouldPlay=${shouldPlay}, hasActiveStep=${hasActiveStep}, step[${step}]=${track.steps[step]}`);
      return shouldPlay && hasActiveStep;
    });

    console.log(`[Transport] Playing ${playableTracks.length} tracks for step ${step}`);
    
    playableTracks.forEach(track => {
      const adjustedParams = { ...track.params, volume: track.params.volume * track.volume };
      console.log(`[Transport] Playing track "${track.name}": ${track.params.frequency}Hz ${track.params.waveform}`);
      playTone(adjustedParams, getSuggestedNoteDuration(adjustedParams));
    });
  }, [isInitialized, playTone]);

  const startTransport = useCallback(() => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }

    // Ensure audio context is ready before starting transport
    if (audioContext?.state === 'closed') {
      toast("Audio engine is closed. Click Initialize to re-create it.");
      return;
    }
    if (audioContext?.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('[Transport] Audio context resumed');
      }).catch((e) => {
        console.error('[Transport] Failed to resume audio context:', e);
        toast("Audio context error - try reinitializing audio");
        return;
      });
    }

    const stepMs = (60 / bpm / 4) * 1000; // 16th notes
    setIsTransportPlaying(true);
    setCurrentStep(0);
    
    // Play the initial step immediately
    playActiveTracksForStep(0);
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prevStep => {
        const nextStep = (prevStep + 1) % stepsCount;
        // Play the step we're moving TO, not the one we're coming from
        playActiveTracksForStep(nextStep);
        return nextStep;
      });
    }, stepMs);
  }, [bpm, stepsCount, playActiveTracksForStep, isInitialized, audioContext]);

  const handleMasterSettingsChange = (newSettings: MasterSettings) => {
    setMasterSettings(newSettings);
    if (updateMasterSettings) {
      updateMasterSettings(newSettings);
    }
  };

  // Start automatically after init when a sequence exists
  useEffect(() => {
    if (shouldAutoplay && isInitialized && !isTransportPlaying) {
      startTransport();
      toast("Auto-playing sequence!");
      setShouldAutoplay(false);
    }
  }, [shouldAutoplay, isInitialized, isTransportPlaying, startTransport]);
  
  const stopTransport = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTransportPlaying(false);
    setCurrentStep(-1);
  }, []);

  const toggleTransport = useCallback(() => {
    if (isTransportPlaying) {
      stopTransport();
    } else {
      startTransport();
    }
  }, [isTransportPlaying, startTransport, stopTransport]);

  const handleTrackPlay = (track: Track) => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }
    if (audioContext?.state === 'closed') {
      toast("Audio engine is closed. Click Initialize to re-create it.");
      return;
    }
    
    setIsPlaying(true);
    const adjustedParams = { ...track.params, volume: track.params.volume * track.volume };
    playTone(adjustedParams, getSuggestedNoteDuration(adjustedParams));
    setTimeout(() => setIsPlaying(false), 500);
    toast(`Playing ${track.name}`);
  };

  const handleTrackEdit = (track: Track) => {
    setEditingTrack(track);
    setIsTrackEditorOpen(true);
  };

  const handleTrackUpdate = (updatedTrack: Track) => {
    setTracks(tracks.map(track => 
      track.id === updatedTrack.id ? updatedTrack : track
    ));
    setEditingTrack(updatedTrack);
  };


  const loadBasic909Kit = () => {
    console.log("[909Kit] Available presets:", ROLAND_909_PRESETS.map(p => p.name));
    
    const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
    const snarePreset = ROLAND_909_PRESETS.find(p => p.name === "909 Snare");
    const hihatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Hi-Hat");
    
    console.log("[909Kit] Found presets:", { kickPreset: !!kickPreset, snarePreset: !!snarePreset, hihatPreset: !!hihatPreset });
    
    const newTracks: Track[] = [];
    
    if (kickPreset) {
      const kickTrack: Track = {
        id: crypto.randomUUID(),
        name: "Kick",
        params: kickPreset.params,
        muted: false,
        solo: false,
        volume: 0.8,
        steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]
      };
      newTracks.push(kickTrack);
      console.log("[909Kit] Added kick track:", kickTrack.params.frequency, kickTrack.params.waveform);
    }
    
    if (snarePreset) {
      const snareTrack: Track = {
        id: crypto.randomUUID(),
        name: "Snare",
        params: snarePreset.params,
        muted: false,
        solo: false,
        volume: 0.7,
        steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
      };
      newTracks.push(snareTrack);
      console.log("[909Kit] Added snare track:", snareTrack.params.frequency, snareTrack.params.waveform);
    }
    
    if (hihatPreset) {
      const hihatTrack: Track = {
        id: crypto.randomUUID(),
        name: "Hi-Hat",
        params: hihatPreset.params,
        muted: false,
        solo: false,
        volume: 0.5,
        steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
      };
      newTracks.push(hihatTrack);
      console.log("[909Kit] Added hihat track:", hihatTrack.params.frequency, hihatTrack.params.waveform);
    }
    
    console.log("[909Kit] Total tracks created:", newTracks.length);
    setTracks(newTracks);
    toast("Loaded 909 drum kit!");
  };

  const loadAcidTechno = () => {
    const acidBassPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Acid Bass");
    const squelchPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Squelch");
    const leadPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Lead");
    const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
    const snarePreset = ROLAND_909_PRESETS.find(p => p.name === "909 Snare");
    const hihatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Hi-Hat");
    const openHatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Open Hat");
    
    const newTracks: Track[] = [];
    
    // Four-on-the-floor kick with variations
    if (kickPreset) {
      const kickTrack: Track = {
        id: crypto.randomUUID(),
        name: "Kick",
        params: kickPreset.params,
        muted: false,
        solo: false,
        volume: 0.9,
        steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, true]
      };
      newTracks.push(kickTrack);
    }
    
    // Acid bass with classic 16th note pattern
    if (acidBassPreset) {
      const bassTrack: Track = {
        id: crypto.randomUUID(),
        name: "Acid Bass",
        params: { ...acidBassPreset.params, filterFreq: 600, filterQ: 10 }, // More aggressive filter
        muted: false,
        solo: false,
        volume: 0.8,
        steps: [true, false, true, true, false, true, false, true, true, false, true, false, true, true, false, true]
      };
      newTracks.push(bassTrack);
    }
    
    // Squelchy bass for extra acid flavor
    if (squelchPreset) {
      const squelchTrack: Track = {
        id: crypto.randomUUID(),
        name: "Squelch",
        params: { ...squelchPreset.params, filterFreq: 300, filterQ: 15 }, // Very aggressive squelch
        muted: false,
        solo: false,
        volume: 0.6,
        steps: [false, true, false, false, true, false, true, false, false, true, false, true, false, false, true, false]
      };
      newTracks.push(squelchTrack);
    }
    
    // Snare on 2 and 4 (classic techno)
    if (snarePreset) {
      const snareTrack: Track = {
        id: crypto.randomUUID(),
        name: "Snare",
        params: snarePreset.params,
        muted: false,
        solo: false,
        volume: 0.7,
        steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
      };
      newTracks.push(snareTrack);
    }
    
    // Driving hi-hats
    if (hihatPreset) {
      const hihatTrack: Track = {
        id: crypto.randomUUID(),
        name: "Hi-Hat",
        params: hihatPreset.params,
        muted: false,
        solo: false,
        volume: 0.5,
        steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
      };
      newTracks.push(hihatTrack);
    }
    
    // Occasional open hats for atmosphere
    if (openHatPreset) {
      const openHatTrack: Track = {
        id: crypto.randomUUID(),
        name: "Open Hat",
        params: openHatPreset.params,
        muted: false,
        solo: false,
        volume: 0.4,
        steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true]
      };
      newTracks.push(openHatTrack);
    }
    
    // Lead arpeggios for melodic interest
    if (leadPreset) {
      const leadTrack: Track = {
        id: crypto.randomUUID(),
        name: "Lead Arp",
        params: { ...leadPreset.params, frequency: 330, filterFreq: 1800, attack: 2 }, // Higher pitch, sharper attack
        muted: false,
        solo: false,
        volume: 0.5,
        steps: [false, false, false, true, false, false, true, false, false, false, false, true, false, false, true, false]
      };
      newTracks.push(leadTrack);
    }
    
    setTracks(newTracks);
    setBpm(135); // Slightly faster for more driving energy
    toast("Loaded improved acid techno sequence!");
  };


  const handleShareEmbed = async () => {
    if (tracks.length === 0) {
      toast("Create some tracks first before sharing!");
      return;
    }

    const embedUrl = encodeSequenceToEmbedUrl(tracks, bpm);
    const isCompact = new URL(embedUrl).searchParams.has('c');
    const charCount = embedUrl.length;
    
    try {
      await navigator.clipboard.writeText(embedUrl);
      const format = isCompact ? 'Compact' : 'Full';
      toast(`${format} URL copied! (${charCount} chars) ${charCount < 200 ? '✅ LinkedIn-friendly' : '⚠️ May be too long for some platforms'}`);
    } catch (error) {
      toast("Failed to copy to clipboard");
      console.error("Clipboard error:", error);
    }
  };

  const handleLoadPreset = (presetTracks: Track[], presetBpm: number) => {
    setTracks(presetTracks);
    setBpm(presetBpm);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-accent" />
              <div>
                <h1 className="text-lg md:text-2xl font-bold neon-text">SteamSynth</h1>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">Web Audio Sound Generator</p>
              </div>
            </div>
            
            <div className="flex gap-1 md:gap-2">
              {!isInitialized ? (
                <Button 
                  onClick={handleInitAudio} 
                  className="bg-accent hover:bg-accent/80 text-sm md:text-base px-3 md:px-4 py-2"
                  size="sm"
                >
                  <Zap className="w-4 h-4 mr-1 md:mr-2" />
                  <span className="hidden xs:inline">Initialize</span>
                  <span className="xs:hidden">Init</span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-sm px-2 md:px-4"
                  >
                    <Settings className="w-4 h-4 mr-1 md:mr-2" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShareEmbed}
                    className="text-sm px-2 md:px-4"
                  >
                    <Share className="w-4 h-4 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-2 md:p-4 space-y-4 md:space-y-6 pb-20 md:pb-6">
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[400px] text-center px-4">
            <div className="panel max-w-md p-6 md:p-8 w-full">
              <Zap className="w-16 h-16 text-accent mx-auto mb-4" />
              {hasSharedSequence() ? (
                <>
                  <h2 className="text-xl font-bold neon-text mb-2">Shared Sequence Loaded</h2>
                  <p className="text-muted-foreground mb-6">
                    A sequence has been shared with you! Initialize the audio engine and press play to hear it.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold neon-text mb-2">Welcome to SteamSynth</h2>
                  <p className="text-muted-foreground mb-6">
                    A steampunk-inspired Web Audio API sound generator. Create, sequence, and explore unique sounds with vintage-style controls.
                  </p>
                </>
              )}
              <Button onClick={handleInitAudio} size="lg" className="bg-accent hover:bg-accent/80">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Audio Engine
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {/* Master Transport with Live Visualization */}
            <MasterTransport
              bpm={bpm}
              isPlaying={isTransportPlaying}
              currentStep={currentStep}
              stepsCount={stepsCount}
              onTogglePlay={toggleTransport}
              onBpmChange={setBpm}
              onLoad909Kit={loadBasic909Kit}
              onLoadAcidTechno={loadAcidTechno}
              onReset={handleReset}
            >
              <Waveform
                audioContext={audioContext}
                analyserNode={analyser}
                isPlaying={isTransportPlaying}
              />
            </MasterTransport>

          {/* Master Controls */}
          <MasterControls
            settings={masterSettings}
            onSettingsChange={handleMasterSettingsChange}
          />

          {/* Soundboard */}
          <Soundboard
            tracks={tracks}
            bpm={bpm}
            onLoadPreset={handleLoadPreset}
          />

          {/* Multi-Track Mixer */}
            <TrackMixer
              tracks={tracks}
              onTracksChange={setTracks}
              onTrackPlay={handleTrackPlay}
              onTrackEdit={handleTrackEdit}
              isPlaying={isTransportPlaying}
              currentStep={currentStep}
            />
          </div>
        )}

        {/* Track Editor Modal */}
        <TrackEditor
          track={editingTrack}
          open={isTrackEditorOpen}
          onOpenChange={setIsTrackEditorOpen}
          onTrackUpdate={handleTrackUpdate}
          onTrackPlay={handleTrackPlay}
          isTransportPlaying={isTransportPlaying}
          currentStep={currentStep}
        />
      </main>
    </div>
  );
};

export default Index;
