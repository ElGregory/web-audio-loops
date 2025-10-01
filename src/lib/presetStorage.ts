import { Track } from "@/types/Track";

export interface SavedPreset {
  id: string;
  name: string;
  tracks: Omit<Track, 'id'>[];
  bpm: number;
  createdAt: number;
}

const STORAGE_KEY = "steamsynth_presets";

export const savePreset = (name: string, tracks: Track[], bpm: number): SavedPreset => {
  const presets = getPresets();
  
  const newPreset: SavedPreset = {
    id: crypto.randomUUID(),
    name,
    tracks: tracks.map(({ id, ...rest }) => rest), // Remove IDs for storage
    bpm,
    createdAt: Date.now(),
  };
  
  presets.push(newPreset);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  
  return newPreset;
};

export const getPresets = (): SavedPreset[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load presets:", error);
    return [];
  }
};

export const deletePreset = (id: string): void => {
  const presets = getPresets().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
};

export const loadPresetTracks = (preset: SavedPreset): Track[] => {
  return preset.tracks.map(track => ({
    ...track,
    id: crypto.randomUUID(), // Generate new IDs when loading
  }));
};
