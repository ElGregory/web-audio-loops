import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useAudioEngine, AudioParams } from "@/hooks/useAudioEngine";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Waveform } from "@/components/Waveform";
import { TrackMixer } from "@/components/TrackMixer";
import { MasterControls, MasterSettings } from "@/components/MasterControls";
import { TrackEditor } from "@/components/TrackEditor";
import { MasterTransport } from "@/components/MasterTransport";
import { Soundboard } from "@/components/Soundboard";
import { Track } from "@/types/Track";
import { Button } from "@/components/ui/button";
import { HelpDialog } from "@/components/HelpDialog";
import { Zap, Settings, Share, Undo, Redo } from "lucide-react";
import { toast } from "sonner";
import { 
  encodeSequenceToEmbedUrl, 
  decodeSequenceFromUrl 
} from "@/lib/sequenceEncoder";
import { loadBasic909Kit, loadAcidTechno, loadJungle, loadDubstep, loadTrance, loadTrap } from "@/lib/presetLoader";

interface AppState {
  tracks: Track[];
  bpm: number;
}

const Index = () => {
  const { audioContext, analyser, isInitialized, initializeAudio, playTone, updateMasterSettings } = useAudioEngine();
  
  // Undo/Redo state management
  const {
    state: appState,
    setState: setAppState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo<AppState>({ tracks: [], bpm: 130 });
  
  const tracks = appState.tracks;
  const bpm = appState.bpm;
  
  const setTracks = useCallback((newTracks: Track[]) => {
    setAppState({ tracks: newTracks, bpm: appState.bpm });
  }, [setAppState, appState.bpm]);
  
  const setBpm = useCallback((newBpm: number) => {
    setAppState({ tracks: appState.tracks, bpm: newBpm });
  }, [setAppState, appState.tracks]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isTransportPlaying, setIsTransportPlaying] = useState(false);
  const [masterSettings, setMasterSettings] = useState<MasterSettings>({
    masterVolume: 1.0,
    masterFilterFreq: 20000,
    masterFilterQ: 1,
    masterFilterType: 'lowpass',
    masterDelay: 0.1,
    masterReverb: 0.0,
  });
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isTrackEditorOpen, setIsTrackEditorOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tracksRef = useRef<Track[]>(tracks);
  const stepsCount = 16;

  // Memoized duration calculator
  const getSuggestedNoteDuration = useMemo(() => (params: AudioParams) => {
    const base = (params.decay + params.release) / 1000;
    if (params.isDrum) {
      const f = params.frequency;
      if (f >= 3000) return Math.min(Math.max(base || 0.15, 0.08), 0.22);
      if (f < 150)   return Math.min(Math.max(base || 0.4,  0.3), 0.65);
      return Math.min(Math.max(base || 0.25, 0.18), 0.35);
    }
    return Math.min(Math.max(base || 0.35, 0.2), 1.2);
  }, []);

  // Keep tracks ref updated
  useEffect(() => {
    tracksRef.current = tracks;
  }, [tracks]);

  // Load sequence from URL on mount
  useEffect(() => {
    const sharedSequence = decodeSequenceFromUrl();
    if (sharedSequence) {
      setAppState({ tracks: sharedSequence.tracks, bpm: sharedSequence.bpm });
      toast("Loaded shared sequence!");
    }
  }, [setAppState]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onPlayPause: useCallback(() => {
      if (isInitialized) {
        if (isTransportPlaying) {
          stopTransport();
        } else {
          startTransport();
        }
      }
    }, [isInitialized, isTransportPlaying]),
    onUndo: useCallback(() => {
      if (canUndo) {
        undo();
        toast("Undo");
      }
    }, [canUndo, undo]),
    onRedo: useCallback(() => {
      if (canRedo) {
        redo();
        toast("Redo");
      }
    }, [canRedo, redo]),
    onBpmIncrease: useCallback(() => {
      if (isInitialized) {
        setBpm(Math.min(bpm + 5, 200));
      }
    }, [isInitialized, bpm, setBpm]),
    onBpmDecrease: useCallback(() => {
      if (isInitialized) {
        setBpm(Math.max(bpm - 5, 60));
      }
    }, [isInitialized, bpm, setBpm]),
    enabled: isInitialized
  });

  

  const handleInitAudio = async () => {
    setIsLoading(true);
    try {
      await initializeAudio();
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      if (audioContext?.state === 'closed') {
        await initializeAudio();
      }
      
      if (updateMasterSettings) {
        updateMasterSettings(masterSettings);
      }
      
      toast("Audio engine initialized! 🎵");
    } catch (e) {
      console.error('[Audio] Failed to initialize:', e);
      toast("Failed to initialize audio engine");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = useCallback(() => {
    setAppState({ tracks: [], bpm: 130 });
    setMasterSettings({
      masterVolume: 1.0,
      masterFilterFreq: 20000,
      masterFilterQ: 1,
      masterFilterType: 'lowpass',
      masterDelay: 0.1,
      masterReverb: 0.0,
    });
    stopTransport();
    
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, '', url.toString());
    
    toast("Reset complete!");
  }, [setAppState]);


  const playActiveTracksForStep = useCallback((step: number) => {
    if (!isInitialized) return;
    
    const currentTracks = tracksRef.current;
    const hasSoloTracks = currentTracks.some(t => t.solo);
    const playableTracks = currentTracks.filter(track => {
      const shouldPlay = hasSoloTracks ? track.solo && !track.muted : !track.muted;
      return shouldPlay && track.steps[step];
    });
    
    playableTracks.forEach(track => {
      const adjustedParams = { ...track.params, volume: track.params.volume * track.volume };
      playTone(adjustedParams, getSuggestedNoteDuration(adjustedParams));
    });
  }, [isInitialized, playTone, getSuggestedNoteDuration]);

  const startTransport = useCallback(() => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }

    if (audioContext?.state === 'closed') {
      toast("Audio engine is closed. Click Initialize to re-create it.");
      return;
    }
    if (audioContext?.state === 'suspended') {
      audioContext.resume().catch(() => {
        toast("Audio context error - try reinitializing audio");
      });
    }

    const stepMs = (60 / bpm / 4) * 1000;
    setIsTransportPlaying(true);
    setCurrentStep(0);
    
    playActiveTracksForStep(0);
    
    intervalRef.current = setInterval(() => {
      setCurrentStep(prevStep => {
        const nextStep = (prevStep + 1) % stepsCount;
        playActiveTracksForStep(nextStep);
        return nextStep;
      });
    }, stepMs);
  }, [bpm, stepsCount, playActiveTracksForStep, isInitialized, audioContext]);

  const handleMasterSettingsChange = useCallback((newSettings: MasterSettings) => {
    setMasterSettings(newSettings);
    if (updateMasterSettings) {
      updateMasterSettings(newSettings);
    }
  }, [updateMasterSettings]);
  
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

  const handleTrackPlay = useCallback((track: Track) => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }
    if (audioContext?.state === 'closed') {
      toast("Audio engine is closed. Click Initialize to re-create it.");
      return;
    }
    
    const adjustedParams = { ...track.params, volume: track.params.volume * track.volume };
    playTone(adjustedParams, getSuggestedNoteDuration(adjustedParams));
  }, [isInitialized, audioContext, playTone, getSuggestedNoteDuration]);

  const handleTrackEdit = useCallback((track: Track) => {
    setEditingTrack(track);
    setIsTrackEditorOpen(true);
  }, []);

  const handleTrackUpdate = useCallback((updatedTrack: Track) => {
    setTracks(tracks.map(track => 
      track.id === updatedTrack.id ? updatedTrack : track
    ));
    setEditingTrack(updatedTrack);
  }, [tracks, setTracks]);

  const handleLoad909Kit = useCallback(() => {
    setAppState({ tracks: loadBasic909Kit(), bpm: 130 });
    toast("Loaded 909 drum kit!");
  }, [setAppState]);

  const handleLoadAcidTechno = useCallback(() => {
    setAppState({ tracks: loadAcidTechno(), bpm: 135 });
    toast("Loaded acid techno sequence!");
  }, [setAppState]);

  const handleLoadJungle = useCallback(() => {
    setAppState({ tracks: loadJungle(), bpm: 170 });
    toast("Loaded jungle sequence! 🔥");
  }, [setAppState]);

  const handleLoadDubstep = useCallback(() => {
    setAppState({ tracks: loadDubstep(), bpm: 140 });
    toast("Loaded dubstep sequence!");
  }, [setAppState]);

  const handleLoadTrance = useCallback(() => {
    setAppState({ tracks: loadTrance(), bpm: 138 });
    toast("Loaded trance sequence!");
  }, [setAppState]);

  const handleLoadTrap = useCallback(() => {
    setAppState({ tracks: loadTrap(), bpm: 140 });
    toast("Loaded trap sequence!");
  }, [setAppState]);

  const handleShareEmbed = async () => {
    if (tracks.length === 0) {
      toast("Create some tracks first!");
      return;
    }

    try {
      const embedUrl = encodeSequenceToEmbedUrl(tracks, bpm);
      await navigator.clipboard.writeText(embedUrl);
      toast(`URL copied! (${embedUrl.length} chars)`);
    } catch (error) {
      toast("Failed to copy to clipboard");
      console.error("Clipboard error:", error);
    }
  };

  const handleLoadPreset = useCallback((presetTracks: Track[], presetBpm: number) => {
    setAppState({ tracks: presetTracks, bpm: presetBpm });
  }, [setAppState]);

  const hasSharedSequence = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('c') || urlParams.has('loop');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header 
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        role="banner"
      >
        <div className="container mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 md:w-8 md:h-8 text-accent" aria-hidden="true" />
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
                  disabled={isLoading}
                  aria-label="Initialize audio engine"
                >
                  <Zap className="w-4 h-4 mr-1 md:mr-2" aria-hidden="true" />
                  <span className="hidden xs:inline">{isLoading ? 'Loading...' : 'Initialize'}</span>
                  <span className="xs:hidden">{isLoading ? '...' : 'Init'}</span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => undo()}
                    disabled={!canUndo}
                    className="text-sm px-2"
                    aria-label="Undo last action"
                    title="Undo (Ctrl+Z)"
                  >
                    <Undo className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => redo()}
                    disabled={!canRedo}
                    className="text-sm px-2"
                    aria-label="Redo last action"
                    title="Redo (Ctrl+Shift+Z)"
                  >
                    <Redo className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleReset}
                    className="text-sm px-2 md:px-4"
                    aria-label="Reset all tracks and settings"
                  >
                    <Settings className="w-4 h-4 mr-1 md:mr-2" aria-hidden="true" />
                    Reset
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleShareEmbed}
                    className="text-sm px-2 md:px-4"
                    aria-label="Share sequence as URL"
                  >
                    <Share className="w-4 h-4 mr-1 md:mr-2" aria-hidden="true" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <HelpDialog />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-2 md:p-4 space-y-4 md:space-y-6 pb-20 md:pb-6" role="main">
        {!isInitialized ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[400px] text-center px-4">
            <div className="panel max-w-md p-6 md:p-8 w-full" role="region" aria-label="Welcome screen">
              <Zap className="w-16 h-16 text-accent mx-auto mb-4" aria-hidden="true" />
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
                    A Web Audio API sound generator. Create, sequence, and explore unique sounds.
                  </p>
                  <p className="text-xs text-muted-foreground mb-6">
                    💡 Keyboard shortcuts: Space (play/pause), Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+↑/↓ (BPM)
                  </p>
                </>
              )}
              <Button 
                onClick={handleInitAudio} 
                size="lg" 
                className="bg-accent hover:bg-accent/80"
                disabled={isLoading}
                aria-label="Start audio engine"
              >
                <Zap className="w-5 h-5 mr-2" aria-hidden="true" />
                {isLoading ? 'Initializing...' : 'Start Your Audio Engine'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6" role="region" aria-label="Audio controls">
            {isLoading && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="panel p-6 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-2" />
                  <p>Loading...</p>
                </div>
              </div>
            )}
            {/* Master Transport with Live Visualization */}
            <MasterTransport
              bpm={bpm}
              isPlaying={isTransportPlaying}
              currentStep={currentStep}
              stepsCount={stepsCount}
              onTogglePlay={toggleTransport}
              onBpmChange={setBpm}
              onLoad909Kit={handleLoad909Kit}
              onLoadAcidTechno={handleLoadAcidTechno}
              onLoadJungle={handleLoadJungle}
        onLoadDubstep={handleLoadDubstep}
        onLoadTrance={handleLoadTrance}
        onLoadTrap={handleLoadTrap}
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
