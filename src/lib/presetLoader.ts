import { Track, ROLAND_909_PRESETS, ROLAND_303_PRESETS, BASS_PRESETS, LEAD_PRESETS } from "@/types/Track";

export const loadBasic909Kit = (): Track[] => {
  const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
  const snarePreset = ROLAND_909_PRESETS.find(p => p.name === "909 Snare");
  const hihatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Hi-Hat");
  
  const newTracks: Track[] = [];
  
  if (kickPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Kick",
      params: kickPreset.params,
      muted: false,
      solo: false,
      volume: 0.8,
      steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]
    });
  }
  
  if (snarePreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Snare",
      params: snarePreset.params,
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
    });
  }
  
  if (hihatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Hi-Hat",
      params: hihatPreset.params,
      muted: false,
      solo: false,
      volume: 0.5,
      steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
    });
  }
  
  return newTracks;
};

export const loadAcidTechno = (): Track[] => {
  const acidBassPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Acid Bass");
  const squelchPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Squelch");
  const leadPreset = ROLAND_303_PRESETS.find(p => p.name === "303 Lead");
  const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
  const snarePreset = ROLAND_909_PRESETS.find(p => p.name === "909 Snare");
  const hihatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Hi-Hat");
  const openHatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Open Hat");
  
  const newTracks: Track[] = [];
  
  if (kickPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Kick",
      params: kickPreset.params,
      muted: false,
      solo: false,
      volume: 0.9,
      steps: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, true]
    });
  }
  
  if (acidBassPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Acid Bass",
      params: { ...acidBassPreset.params, filterFreq: 600, filterQ: 10 },
      muted: false,
      solo: false,
      volume: 0.8,
      steps: [true, false, true, true, false, true, false, true, true, false, true, false, true, true, false, true]
    });
  }
  
  if (squelchPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Squelch",
      params: { ...squelchPreset.params, filterFreq: 300, filterQ: 15 },
      muted: false,
      solo: false,
      volume: 0.6,
      steps: [false, true, false, false, true, false, true, false, false, true, false, true, false, false, true, false]
    });
  }
  
  if (snarePreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Snare",
      params: snarePreset.params,
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
    });
  }
  
  if (hihatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Hi-Hat",
      params: hihatPreset.params,
      muted: false,
      solo: false,
      volume: 0.5,
      steps: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]
    });
  }
  
  if (openHatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Open Hat",
      params: openHatPreset.params,
      muted: false,
      solo: false,
      volume: 0.4,
      steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true]
    });
  }
  
  if (leadPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Lead Arp",
      params: { ...leadPreset.params, frequency: 330, filterFreq: 1800, attack: 2 },
      muted: false,
      solo: false,
      volume: 0.5,
      steps: [false, false, false, true, false, false, true, false, false, false, false, true, false, false, true, false]
    });
  }
  
  return newTracks;
};

export const loadJungle = (): Track[] => {
  const kickPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Kick");
  const snarePreset = ROLAND_909_PRESETS.find(p => p.name === "909 Snare");
  const hihatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Hi-Hat");
  const openHatPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Open Hat");
  const clapPreset = ROLAND_909_PRESETS.find(p => p.name === "909 Clap");
  const subBassPreset = BASS_PRESETS.find(p => p.name === "Sub Bass");
  const reeseBassPreset = BASS_PRESETS.find(p => p.name === "Reese Bass");
  const hooverPreset = LEAD_PRESETS.find(p => p.name === "Hoover");
  
  const newTracks: Track[] = [];
  
  // Authentic Amen kick pattern - syncopated
  if (kickPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Amen Kick",
      params: { ...kickPreset.params, volume: 1.1, filterFreq: 120, decay: 280, attack: 1 },
      muted: false,
      solo: false,
      volume: 1.0,
      steps: [true, false, false, false, false, false, true, false, false, false, true, false, true, false, false, true]
    });
  }
  
  // Main snare with ghost notes
  if (snarePreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Amen Snare",
      params: { ...snarePreset.params, volume: 1.1, filterFreq: 2500, filterQ: 3 },
      muted: false,
      solo: false,
      volume: 0.95,
      steps: [false, false, false, false, true, false, false, true, false, true, false, false, true, false, true, false]
    });
  }
  
  // Ghost snares for rolls
  if (snarePreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Ghost Snares",
      params: { ...snarePreset.params, volume: 0.4, filterFreq: 3000, decay: 80 },
      muted: false,
      solo: false,
      volume: 0.45,
      steps: [false, false, true, false, false, true, false, false, false, false, true, false, false, true, false, true]
    });
  }
  
  // Clap layer for punch
  if (clapPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Clap Layer",
      params: { ...clapPreset.params, volume: 0.8, filterFreq: 2000 },
      muted: false,
      solo: false,
      volume: 0.65,
      steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
    });
  }
  
  // Complex hi-hat pattern with variations
  if (hihatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Jungle Hats",
      params: { ...hihatPreset.params, volume: 0.7, filterFreq: 9000, decay: 60 },
      muted: false,
      solo: false,
      volume: 0.55,
      steps: [true, false, true, true, true, false, true, true, true, true, false, true, true, false, true, true]
    });
  }
  
  // Open hats for accents
  if (openHatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Open Hats",
      params: { ...openHatPreset.params, volume: 0.8, filterFreq: 8000, decay: 180 },
      muted: false,
      solo: false,
      volume: 0.5,
      steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true]
    });
  }
  
  // Sub bass following kick pattern
  if (subBassPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Sub Bass",
      params: { ...subBassPreset.params, frequency: 38, decay: 350, attack: 2, filterFreq: 100 },
      muted: false,
      solo: false,
      volume: 0.75,
      steps: [true, false, false, false, false, false, true, false, false, false, true, false, true, false, false, true]
    });
  }
  
  // Reese bassline with movement
  if (reeseBassPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Reese Bass",
      params: { ...reeseBassPreset.params, frequency: 55, filterFreq: 400, filterQ: 8, decay: 400 },
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [true, false, false, true, false, false, false, true, true, false, false, false, true, false, true, false]
    });
  }
  
  // Hoover stab for atmosphere
  if (hooverPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Hoover Stab",
      params: { ...hooverPreset.params, frequency: 220, filterQ: 12, filterFreq: 1200, attack: 3, decay: 200 },
      muted: false,
      solo: false,
      volume: 0.65,
      steps: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false]
    });
  }
  
  return newTracks;
};
