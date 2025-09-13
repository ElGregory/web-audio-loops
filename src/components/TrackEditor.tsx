import { Track } from '@/types/Track';
import { SynthControls } from '@/components/SynthControls';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { AudioParams } from '@/hooks/useAudioEngine';

interface TrackEditorProps {
  track: Track | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTrackUpdate: (track: Track) => void;
  onTrackPlay: (track: Track) => void;
}

export const TrackEditor = ({ track, open, onOpenChange, onTrackUpdate, onTrackPlay }: TrackEditorProps) => {
  if (!track) return null;

  const handleNameChange = (name: string) => {
    onTrackUpdate({ ...track, name });
  };

  const handleParamsChange = (params: AudioParams) => {
    onTrackUpdate({ ...track, params });
  };

  const handlePlayNote = () => {
    onTrackPlay(track);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Edit Track: {track.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="track-name">Track Name</Label>
              <Input
                id="track-name"
                value={track.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => onOpenChange(false)} className="ml-auto">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>

          <SynthControls
            params={track.params}
            onParamsChange={handleParamsChange}
            onPlayNote={handlePlayNote}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};