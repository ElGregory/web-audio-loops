import { useState, useRef, useCallback, useEffect } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { Waveform } from "@/components/Waveform";
import { TrackMixer } from "@/components/TrackMixer";
import { MasterControls, MasterSettings } from "@/components/MasterControls";
import { TrackEditor } from "@/components/TrackEditor";
import { MasterTransport } from "@/components/MasterTransport";
import { Track, ROLAND_909_PRESETS, ROLAND_303_PRESETS } from "@/types/Track";
import { Button } from "@/components/ui/button";
import { Zap, Settings, Save, Share } from "lucide-react";
import { toast } from "sonner";

// URL sharing utilities

// Human-readable format: bpm:130|kick:1010101010101010:60:0.8:false:false|snare:0001000100010001:200:0.7:false:false
const encodeSequenceToReadable = (tracks: Track[], bpm: number) => {
  // Use base64 encoding for complete parameter preservation
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

// Legacy base64 format for complex sequences
const encodeSequenceToUrl = (tracks: Track[], bpm: number) => {
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
  const url = new URL(window.location.href);
  url.searchParams.set('sequence', encoded);
  return url.toString();
};

const encodeSequenceToEmbedUrl = (tracks: Track[], bpm: number) => {
  const readable = encodeSequenceToReadable(tracks, bpm);
  const url = new URL(window.location.href);
  url.searchParams.set('loop', readable);
  return url.toString();
};

const decodeSequenceFromUrl = (): { tracks: Track[], bpm: number } | null => {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Try human-readable format first
  const loop = urlParams.get('loop');
  if (loop) {
    const result = decodeSequenceFromReadable(loop);
    if (result) return result;
  }
  
  // Fall back to base64 format
  const encoded = urlParams.get('sequence');
  if (!encoded) return null;
  
  try {
    const decoded = JSON.parse(atob(encoded));
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
      playTone(adjustedParams, 0.2);
    });
  }, [isInitialized, playTone]);

  const startTransport = useCallback(() => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }

    // Ensure audio context is running before starting transport
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
    
    setIsPlaying(true);
    const adjustedParams = { ...track.params, volume: track.params.volume * track.volume };
    playTone(adjustedParams, 0.5);
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
    const leadPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Lead");
    const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
    const openHatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Open Hat");
    
    const newTracks: Track[] = [];
    
    if (kickPreset) {
      const kickTrack: Track = {
        id: crypto.randomUUID(),
        name: "Kick",
        params: kickPreset.params,
        muted: false,
        solo: false,
        volume: 0.9,
        steps: [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false]
      };
      newTracks.push(kickTrack);
    }
    
    if (acidBassPreset) {
      const bassTrack: Track = {
        id: crypto.randomUUID(),
        name: "Acid Bass",
        params: acidBassPreset.params,
        muted: false,
        solo: false,
        volume: 0.7,
        steps: [true, false, true, true, false, true, false, true, true, false, true, true, false, true, false, true]
      };
      newTracks.push(bassTrack);
    }
    
    if (leadPreset) {
      const leadTrack: Track = {
        id: crypto.randomUUID(),
        name: "Lead",
        params: leadPreset.params,
        muted: false,
        solo: false,
        volume: 0.6,
        steps: [false, false, false, false, false, false, false, false, true, false, false, true, false, false, true, false]
      };
      newTracks.push(leadTrack);
    }
    
    if (openHatPreset) {
      const hatTrack: Track = {
        id: crypto.randomUUID(),
        name: "Open Hat",
        params: openHatPreset.params,
        muted: false,
        solo: false,
        volume: 0.4,
        steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true]
      };
      newTracks.push(hatTrack);
    }
    
    setTracks(newTracks);
    setBpm(130);
    toast("Loaded acid techno sequence!");
  };


  const handleShareEmbed = async () => {
    if (tracks.length === 0) {
      toast("Create some tracks first before sharing!");
      return;
    }

    const embedUrl = encodeSequenceToEmbedUrl(tracks, bpm);
    
    try {
      await navigator.clipboard.writeText(embedUrl);
      toast("Embed URL copied to clipboard!");
    } catch (error) {
      toast("Failed to copy to clipboard");
      console.error("Clipboard error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-accent" />
              <div>
                <h1 className="text-2xl font-bold neon-text">SteamSynth</h1>
                <p className="text-sm text-muted-foreground">Web Audio Sound Generator</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isInitialized ? (
                <Button onClick={handleInitAudio} className="bg-accent hover:bg-accent/80">
                  <Zap className="w-4 h-4 mr-2" />
                  Initialize Audio
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={handleShareEmbed}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 space-y-6">
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="panel max-w-md p-8">
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
          <div className="space-y-6">
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
