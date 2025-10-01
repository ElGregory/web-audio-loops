import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SavedPreset, savePreset, getPresets, deletePreset, loadPresetTracks } from "@/lib/presetStorage";
import { Track } from "@/types/Track";
import { Save, Play, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface SoundboardProps {
  tracks: Track[];
  bpm: number;
  onLoadPreset: (tracks: Track[], bpm: number) => void;
}

export const Soundboard = ({ tracks, bpm, onLoadPreset }: SoundboardProps) => {
  const [presets, setPresets] = useState<SavedPreset[]>(getPresets());
  const [presetName, setPresetName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast("Please enter a preset name");
      return;
    }
    
    if (tracks.length === 0) {
      toast("Add some tracks before saving a preset");
      return;
    }

    const newPreset = savePreset(presetName, tracks, bpm);
    setPresets(getPresets());
    setPresetName("");
    setIsDialogOpen(false);
    toast(`Preset "${newPreset.name}" saved!`);
  };

  const handleLoadPreset = (preset: SavedPreset) => {
    const loadedTracks = loadPresetTracks(preset);
    onLoadPreset(loadedTracks, preset.bpm);
    toast(`Loaded preset "${preset.name}"`);
  };

  const handleDeletePreset = (id: string, name: string) => {
    deletePreset(id);
    setPresets(getPresets());
    toast(`Deleted preset "${name}"`);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Soundboard</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Preset</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Preset Name</label>
                <Input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="My Acid Techno Pattern"
                  onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                This will save {tracks.length} track{tracks.length !== 1 ? "s" : ""} at {bpm} BPM
              </div>
              <Button onClick={handleSavePreset} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {presets.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Plus className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No saved presets yet</p>
          <p className="text-xs mt-1">Create some tracks and save your first preset!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="group relative bg-card border-2 border-border rounded-lg p-3 hover:border-primary transition-all"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1 mb-2">
                  <h3 className="font-semibold text-sm truncate mb-1">{preset.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {preset.tracks.length} tracks • {preset.bpm} BPM
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={() => handleLoadPreset(preset)}
                    className="flex-1 h-7 text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePreset(preset.id, preset.name)}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
