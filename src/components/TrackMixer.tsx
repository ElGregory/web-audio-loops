import { useState } from 'react';
import { Track, TrackPreset, ROLAND_303_PRESETS, ROLAND_909_PRESETS } from '@/types/Track';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, Volume2, VolumeX, Play, Settings } from 'lucide-react';
import { TrackSequencer } from '@/components/TrackSequencer';
import { AudioParams } from '@/hooks/useAudioEngine';
import { toast } from 'sonner';

interface TrackMixerProps {
  tracks: Track[];
  onTracksChange: (tracks: Track[]) => void;
  onTrackPlay: (track: Track) => void;
  onTrackEdit: (track: Track) => void;
  isPlaying: boolean;
  currentStep: number;
  className?: string;
}

export const TrackMixer = ({ tracks, onTracksChange, onTrackPlay, onTrackEdit, isPlaying, currentStep, className }: TrackMixerProps) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const allPresets: TrackPreset[] = [...ROLAND_303_PRESETS, ...ROLAND_909_PRESETS];

  const addTrack = (preset?: TrackPreset) => {
    const newTrack: Track = {
      id: crypto.randomUUID(),
      name: preset ? preset.name : `Track ${tracks.length + 1}`,
      params: preset ? preset.params : {
        frequency: 440,
        waveform: 'sine',
        volume: 0.5,
        attack: 10,
        decay: 200,
        sustain: 0.7,
        release: 300,
        filterFreq: 2000,
        filterQ: 1,
      },
      muted: false,
      solo: false,
      volume: 0.8,
      steps: new Array(16).fill(false),
    };
    onTracksChange([...tracks, newTrack]);
    toast(`Added ${newTrack.name}`);
  };

  const cloneTrack = (track: Track) => {
    const clonedTrack: Track = {
      ...track,
      id: crypto.randomUUID(),
      name: `${track.name} Copy`,
    };
    onTracksChange([...tracks, clonedTrack]);
    toast(`Cloned ${track.name}`);
  };

  const deleteTrack = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    onTracksChange(tracks.filter(t => t.id !== trackId));
    toast(`Deleted ${track?.name}`);
  };

  const updateTrack = (trackId: string, updates: Partial<Track>) => {
    onTracksChange(tracks.map(track => 
      track.id === trackId ? { ...track, ...updates } : track
    ));
  };

  const updateTrackName = (trackId: string, name: string) => {
    updateTrack(trackId, { name });
  };

  const toggleMute = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    updateTrack(trackId, { muted: !track?.muted });
  };

  const toggleSolo = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    updateTrack(trackId, { solo: !track?.solo });
  };

  const updateTrackVolume = (trackId: string, volume: number) => {
    updateTrack(trackId, { volume });
  };

  const updateTrackSteps = (trackId: string, steps: boolean[]) => {
    updateTrack(trackId, { steps });
  };

  const applyPresetToTrack = (trackId: string, presetName: string) => {
    const preset = allPresets.find(p => p.name === presetName);
    if (preset) {
      updateTrack(trackId, { 
        params: preset.params,
        name: preset.name 
      });
      toast(`Applied ${preset.name} preset`);
    }
  };

  const addPresetTrack = () => {
    if (!selectedPreset) return;
    const preset = allPresets.find(p => p.name === selectedPreset);
    if (preset) {
      addTrack(preset);
      setSelectedPreset('');
    }
  };

  return (
    <div className={`control-section ${className}`}>
      <div className="panel-header">
        <Settings className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold neon-text">Multi-Track Mixer</h3>
        <div className="ml-auto flex flex-col sm:flex-row gap-2">
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-full sm:w-48 bg-secondary">
              <SelectValue placeholder="Roland Presets" />
            </SelectTrigger>
            <SelectContent>
              {ROLAND_303_PRESETS.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">303</Badge>
                    {preset.name}
                  </div>
                </SelectItem>
              ))}
              {ROLAND_909_PRESETS.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">909</Badge>
                    {preset.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button onClick={addPresetTrack} disabled={!selectedPreset} size="sm" className="flex-1 sm:flex-none">
              Add Preset
            </Button>
            <Button onClick={() => addTrack()} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Plus className="w-4 h-4 mr-1" />
              Track
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {tracks.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <p className="text-sm md:text-base">No tracks yet. Add your first track to get started!</p>
          </div>
        ) : (
          tracks.map((track) => (
            <Card key={track.id} className="bg-card/50 border-border">
              <CardHeader className="pb-2 md:pb-3">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Input
                    value={track.name}
                    onChange={(e) => updateTrackName(track.id, e.target.value)}
                    className="text-sm font-medium bg-background/50 border-border flex-1 min-w-0"
                  />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant={track.solo ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSolo(track.id)}
                      className="h-9 px-4 text-sm font-medium"
                    >
                      Solo
                    </Button>
                    <Button
                      variant={track.muted ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleMute(track.id)}
                      className="h-9 px-3"
                    >
                      {track.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Preset Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground min-w-16">Preset:</span>
                    <Select onValueChange={(value) => applyPresetToTrack(track.id, value)}>
                      <SelectTrigger className="flex-1 h-8 text-xs bg-background/50">
                        <SelectValue placeholder="Change preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLAND_303_PRESETS.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">303</Badge>
                              {preset.name}
                            </div>
                          </SelectItem>
                        ))}
                        {ROLAND_909_PRESETS.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">909</Badge>
                              {preset.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Volume Control */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-muted-foreground min-w-16 font-medium">Volume</span>
                        <Slider
                          value={[track.volume * 100]}
                          onValueChange={(value) => updateTrackVolume(track.id, value[0] / 100)}
                          min={0}
                          max={100}
                          step={1}
                          className="flex-1 touch-pan-y"
                        />
                        <span className="text-sm neon-text font-mono min-w-8 bg-background/50 px-2 py-1 rounded">
                          {Math.round(track.volume * 100)}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground bg-card/30 p-2 rounded">
                        {track.params.waveform} • {track.params.frequency}Hz • Filter: {track.params.filterFreq}Hz
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-4 lg:flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTrackPlay(track)}
                        className="h-10 px-3 flex flex-col items-center justify-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        <span className="text-xs hidden md:inline">Play</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onTrackEdit(track)}
                        className="h-10 px-3 flex flex-col items-center justify-center gap-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-xs hidden md:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cloneTrack(track)}
                        className="h-10 px-3 flex flex-col items-center justify-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        <span className="text-xs hidden md:inline">Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTrack(track.id)}
                        className="h-10 px-3 text-destructive hover:bg-destructive hover:text-destructive-foreground flex flex-col items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-xs hidden md:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <TrackSequencer
                    steps={track.steps}
                    isPlaying={isPlaying}
                    currentStep={currentStep}
                    onStepsChange={(steps) => updateTrackSteps(track.id, steps)}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};