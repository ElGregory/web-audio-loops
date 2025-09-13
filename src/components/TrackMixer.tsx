import { useState } from 'react';
import { Track, TrackPreset, ROLAND_303_PRESETS, ROLAND_909_PRESETS } from '@/types/Track';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, Volume2, VolumeX, Play, Settings } from 'lucide-react';
import { AudioParams } from '@/hooks/useAudioEngine';
import { toast } from 'sonner';

interface TrackMixerProps {
  tracks: Track[];
  onTracksChange: (tracks: Track[]) => void;
  onTrackPlay: (track: Track) => void;
  onTrackEdit: (track: Track) => void;
  className?: string;
}

export const TrackMixer = ({ tracks, onTracksChange, onTrackPlay, onTrackEdit, className }: TrackMixerProps) => {
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
        delay: 0.1,
        reverb: 0.2,
      },
      muted: false,
      solo: false,
      volume: 0.8,
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
        <div className="ml-auto flex gap-2">
          <Select value={selectedPreset} onValueChange={setSelectedPreset}>
            <SelectTrigger className="w-48 bg-secondary">
              <SelectValue placeholder="Roland Presets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" disabled>Select Preset</SelectItem>
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
          <Button onClick={addPresetTrack} disabled={!selectedPreset} size="sm">
            Add Preset
          </Button>
          <Button onClick={() => addTrack()} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Track
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {tracks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tracks yet. Add your first track to get started!</p>
          </div>
        ) : (
          tracks.map((track) => (
            <Card key={track.id} className="bg-card/50 border-border">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Input
                    value={track.name}
                    onChange={(e) => updateTrackName(track.id, e.target.value)}
                    className="text-sm font-medium bg-background/50 border-border flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      variant={track.solo ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSolo(track.id)}
                      className="h-8 px-3 text-xs"
                    >
                      S
                    </Button>
                    <Button
                      variant={track.muted ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => toggleMute(track.id)}
                      className="h-8 px-2"
                    >
                      {track.muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground min-w-16">Volume</span>
                      <Slider
                        value={[track.volume * 100]}
                        onValueChange={(value) => updateTrackVolume(track.id, value[0] / 100)}
                        min={0}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs neon-text font-mono min-w-8">
                        {Math.round(track.volume * 100)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {track.params.waveform} • {track.params.frequency}Hz • Filter: {track.params.filterFreq}Hz
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTrackPlay(track)}
                      className="h-8 px-2"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTrackEdit(track)}
                      className="h-8 px-2"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cloneTrack(track)}
                      className="h-8 px-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteTrack(track.id)}
                      className="h-8 px-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};