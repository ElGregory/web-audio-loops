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
  const hooverPreset = LEAD_PRESETS.find(p => p.name === "Hoover");
  
  const newTracks: Track[] = [];
  
  if (kickPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Amen Kick",
      params: { ...kickPreset.params, volume: 1.0, filterFreq: 150, decay: 250 },
      muted: false,
      solo: false,
      volume: 1.0,
      steps: [true, false, false, false, true, false, false, false, false, false, true, false, true, false, false, true]
    });
  }
  
  if (snarePreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Amen Snare",
      params: { ...snarePreset.params, volume: 1.0 },
      muted: false,
      solo: false,
      volume: 0.9,
      steps: [false, false, false, false, true, false, false, true, false, true, false, false, true, false, true, false]
    });
  }
  
  if (clapPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Clap Layer",
      params: clapPreset.params,
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false]
    });
  }
  
  if (hihatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Jungle Hats",
      params: hihatPreset.params,
      muted: false,
      solo: false,
      volume: 0.6,
      steps: [true, false, true, true, true, false, true, true, true, false, true, true, true, true, false, true]
    });
  }
  
  if (openHatPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Break Hat",
      params: openHatPreset.params,
      muted: false,
      solo: false,
      volume: 0.55,
      steps: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false]
    });
  }
  
  if (subBassPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Sub Kick",
      params: { ...subBassPreset.params, frequency: 35, decay: 300 },
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [true, false, false, false, true, false, false, false, false, false, true, false, true, false, false, true]
    });
  }
  
  if (hooverPreset) {
    newTracks.push({
      id: crypto.randomUUID(),
      name: "Hoover Stab",
      params: { ...hooverPreset.params, filterQ: 10, attack: 2 },
      muted: false,
      solo: false,
      volume: 0.7,
      steps: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false]
    });
  }
  
  return newTracks;
};
