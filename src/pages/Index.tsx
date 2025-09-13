import { useState } from "react";
import { useAudioEngine, AudioParams } from "@/hooks/useAudioEngine";
import { SynthControls } from "@/components/SynthControls";
import { Waveform } from "@/components/Waveform";
import { Sequencer } from "@/components/Sequencer";
import { TrackMixer } from "@/components/TrackMixer";
import { TrackEditor } from "@/components/TrackEditor";
import { Track } from "@/types/Track";
import { Button } from "@/components/ui/button";
import { Zap, Settings, Save, Share } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { audioContext, analyser, isInitialized, initializeAudio, playTone, updateMasterVolume } = useAudioEngine();
  const [isPlaying, setIsPlaying] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [isTrackEditorOpen, setIsTrackEditorOpen] = useState(false);
  
  const [synthParams, setSynthParams] = useState<AudioParams>({
    frequency: 440,
    waveform: 'sine' as OscillatorType,
    volume: 0.3,
    attack: 10,
    decay: 200,
    sustain: 0.7,
    release: 300,
    filterFreq: 2000,
    filterQ: 1,
    delay: 0.1,
    reverb: 0.2,
  });

  const handleInitAudio = async () => {
    await initializeAudio();
    toast("Audio engine initialized! Ready to make some noise!");
  };

  const handlePlayNote = () => {
    if (!isInitialized) {
      toast("Initialize audio first!");
      return;
    }
    
    setIsPlaying(true);
    playTone(synthParams, 0.5);
    setTimeout(() => setIsPlaying(false), 500);
    toast(`Playing ${synthParams.waveform} wave at ${synthParams.frequency}Hz`);
  };

  const handleSequencerStep = (step: number, isActive: boolean) => {
    if (isActive && isInitialized) {
      // Play all unmuted, non-solo tracks (or only solo tracks if any)
      const tracksToPlay = tracks.filter(track => {
        const hasSoloTracks = tracks.some(t => t.solo);
        if (hasSoloTracks) {
          return track.solo && !track.muted;
        }
        return !track.muted;
      });

      tracksToPlay.forEach(track => {
        const stepFreq = track.params.frequency * Math.pow(2, (step - 4) / 12);
        const stepParams = { ...track.params, frequency: stepFreq, volume: track.params.volume * track.volume };
        playTone(stepParams, 0.2);
      });
    }
  };

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

  const handleSavePreset = () => {
    const preset = JSON.stringify(synthParams, null, 2);
    navigator.clipboard.writeText(preset);
    toast("Preset copied to clipboard!");
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
                <>
                  <Button variant="outline" onClick={handleSavePreset} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preset
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </>
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
              <h2 className="text-xl font-bold neon-text mb-2">Welcome to SteamSynth</h2>
              <p className="text-muted-foreground mb-6">
                A steampunk-inspired Web Audio API sound generator. Create, sequence, and explore unique sounds with vintage-style controls.
              </p>
              <Button onClick={handleInitAudio} size="lg" className="bg-accent hover:bg-accent/80">
                <Zap className="w-5 h-5 mr-2" />
                Start Your Audio Engine
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Multi-Track Mixer */}
            <TrackMixer
              tracks={tracks}
              onTracksChange={setTracks}
              onTrackPlay={handleTrackPlay}
              onTrackEdit={handleTrackEdit}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <SynthControls
                  params={synthParams}
                  onParamsChange={setSynthParams}
                  onPlayNote={handlePlayNote}
                />
                
                <Sequencer
                  bpm={120}
                  onStepPlay={handleSequencerStep}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="control-section">
                  <div className="panel-header">
                    <Settings className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-bold neon-text">Live Visualization</h3>
                  </div>
                  <Waveform
                    audioContext={audioContext}
                    analyserNode={analyser}
                    isPlaying={isPlaying}
                  />
                </div>

                <div className="control-section">
                  <div className="panel-header">
                    <h3 className="text-lg font-bold neon-text">Quick Presets</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setSynthParams({...synthParams, waveform: 'square', frequency: 220, attack: 1, decay: 50, sustain: 0.9, release: 100})}
                      className="bg-secondary hover:bg-secondary/80"
                    >
                      Beep
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSynthParams({...synthParams, waveform: 'sawtooth', frequency: 100, attack: 5, decay: 400, sustain: 0.3, release: 600})}
                      className="bg-secondary hover:bg-secondary/80"
                    >
                      Boop
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSynthParams({...synthParams, waveform: 'triangle', frequency: 80, attack: 1, decay: 200, sustain: 0.1, release: 300})}
                      className="bg-secondary hover:bg-secondary/80"
                    >
                      Kick
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSynthParams({...synthParams, waveform: 'square', frequency: 1200, attack: 1, decay: 50, sustain: 0.1, release: 100, filterFreq: 4000})}
                      className="bg-secondary hover:bg-secondary/80"
                    >
                      Hi-Hat
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Track Editor Modal */}
        <TrackEditor
          track={editingTrack}
          open={isTrackEditorOpen}
          onOpenChange={setIsTrackEditorOpen}
          onTrackUpdate={handleTrackUpdate}
          onTrackPlay={handleTrackPlay}
        />
      </main>
    </div>
  );
};

export default Index;
