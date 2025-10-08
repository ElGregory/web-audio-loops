import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Zap, Music, Sliders, Keyboard, Lightbulb } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="text-sm px-2 md:px-4"
          aria-label="Open help documentation"
        >
          <HelpCircle className="w-4 h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-accent" />
            SteamSynth Guide
          </DialogTitle>
          <DialogDescription>
            Complete documentation for all features, presets, and loop-making tips
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="tips">Loop Tips</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] mt-4 pr-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Welcome to SteamSynth</h3>
                <p className="text-sm text-muted-foreground">
                  SteamSynth is a powerful Web Audio API-based sound generator and sequencer. 
                  Create electronic music, drum patterns, and unique soundscapes entirely in your browser.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Key Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>16-Step Sequencer:</strong> Create rhythmic patterns with up to 16 steps per track</li>
                  <li>• <strong>Multi-Track Mixing:</strong> Layer unlimited tracks with individual volume, mute, and solo controls</li>
                  <li>• <strong>Real-Time Synthesis:</strong> Adjust waveforms, envelopes (ADSR), and filters on the fly</li>
                  <li>• <strong>Master Effects:</strong> Global delay, reverb, and filter controls for professional sound</li>
                  <li>• <strong>Preset Library:</strong> Quick-start patterns across multiple genres</li>
                  <li>• <strong>Share Sequences:</strong> Export and share your creations via URL</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary">Getting Started</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Click <strong>Initialize</strong> to start the audio engine</li>
                  <li>Load a preset from Quick Start Patterns or create a new track</li>
                  <li>Click steps to activate them in the sequence</li>
                  <li>Hit <strong>Play</strong> to hear your creation</li>
                  <li>Adjust parameters in real-time to refine your sound</li>
                </ol>
              </div>
            </TabsContent>

            {/* Presets Tab */}
            <TabsContent value="presets" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Quick Start Patterns</h3>
                <p className="text-sm text-muted-foreground">
                  Pre-built patterns to get you started quickly. Each preset includes optimized tracks and BPM settings.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-brass/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-brass flex items-center gap-2">
                    <span>🥁</span> 909 Drum Kit (130 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Classic Roland TR-909 inspired drum kit. Features kick, snare, hi-hat, and clap sounds.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> House, techno, EDM foundations
                  </p>
                </div>

                <div className="p-4 border border-primary/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <span>🎵</span> Acid Techno (135 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    High-energy electronic pattern with resonant filter sweeps and punchy drums.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> Acid house, techno, rave-style tracks
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent flex items-center gap-2">
                    <span>⚡</span> Jungle (170 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fast breakbeat pattern with rapid-fire drums and sub-bass elements.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> Drum & bass, jungle, breakbeat hardcore
                  </p>
                </div>

                <div className="p-4 border border-purple-500/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-purple-400 flex items-center gap-2">
                    <span>🔊</span> Dubstep (140 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Heavy wobble bass with sparse, hard-hitting drums and sub-bass power.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> Dubstep, bass music, half-time grooves
                  </p>
                </div>

                <div className="p-4 border border-cyan-500/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-cyan-400 flex items-center gap-2">
                    <span>✨</span> Trance (138 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uplifting supersaw leads with driving kicks and energetic percussion.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> Trance, progressive house, euphoric buildups
                  </p>
                </div>

                <div className="p-4 border border-orange-500/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-orange-400 flex items-center gap-2">
                    <span>💥</span> Trap (140 BPM)
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Deep 808 bass with crisp hi-hats and punchy snares in triplet patterns.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> Trap, hip-hop, modern electronic beats
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-primary">Track Presets</h4>
                <p className="text-sm text-muted-foreground">
                  Individual sound presets available in the Track Mixer:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                  <li><strong>Drum Presets:</strong> Kick, Snare, Hi-Hat (Closed/Open), Clap, Rimshot, Tom</li>
                  <li><strong>Bass Presets:</strong> Sub Bass, 808 Bass, Acid Bass, Reese Bass</li>
                  <li><strong>Synth Presets:</strong> Lead, Pad, Pluck, Arp, Supersaw, Stab</li>
                  <li><strong>FX Presets:</strong> White Noise, Pink Noise, Sweep, Riser</li>
                </ul>
              </div>
            </TabsContent>

            {/* Controls Tab */}
            <TabsContent value="controls" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Transport Controls</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Play/Stop:</strong> Start or stop the sequence playback</li>
                  <li><strong>BPM Slider:</strong> Adjust tempo from 60 to 200 beats per minute</li>
                  <li><strong>Step Indicator:</strong> Visual feedback showing current playback position</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Master Controls</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Master Volume:</strong> Global output level (0-200%)</li>
                  <li><strong>Master Delay:</strong> Echo effect applied to all tracks (0-100%)</li>
                  <li><strong>Master Reverb:</strong> Spacial depth and ambience (0-100%)</li>
                  <li><strong>Master Filter Type:</strong> Low Pass, High Pass, Band Pass, or Notch</li>
                  <li><strong>Master Filter Frequency:</strong> Cutoff frequency (20Hz - 20kHz)</li>
                  <li><strong>Master Filter Resonance (Q):</strong> Emphasis at cutoff frequency</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Track Controls</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Track Name:</strong> Click to edit and organize your tracks</li>
                  <li><strong>Solo (S):</strong> Play only this track (isolate for editing)</li>
                  <li><strong>Mute (M):</strong> Silence this track without deleting</li>
                  <li><strong>Volume Slider:</strong> Individual track level (0-200%)</li>
                  <li><strong>Preset Selector:</strong> Apply sound presets to existing tracks</li>
                  <li><strong>Play Button:</strong> Preview the track sound</li>
                  <li><strong>Edit Button:</strong> Open detailed parameter editor</li>
                  <li><strong>Copy Button:</strong> Duplicate track with all settings</li>
                  <li><strong>Delete Button:</strong> Remove track from sequence</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary">Track Editor (Advanced)</h3>
                <p className="text-sm text-muted-foreground">
                  Access detailed synthesis parameters for each track:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>Oscillator Section:</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Frequency: Base pitch (20Hz - 4000Hz)</li>
                      <li>• Waveform: Sine, Square, Sawtooth, or Triangle</li>
                      <li>• Volume: Oscillator output level</li>
                    </ul>
                  </li>
                  <li><strong>Envelope (ADSR):</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Attack: Time to reach full volume</li>
                      <li>• Decay: Time to reach sustain level</li>
                      <li>• Sustain: Held volume level (0-100%)</li>
                      <li>• Release: Time to fade after note ends</li>
                    </ul>
                  </li>
                  <li><strong>Filter & Effects:</strong>
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Filter Frequency: Tone shaping cutoff point</li>
                      <li>• Filter Q (Resonance): Emphasis at cutoff</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Loop Tips Tab */}
            <TabsContent value="tips" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Pro Tips for Making Great Loops
                </h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">1. Start with the Kick</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Place your kick drum on beats 1 and 5 (steps 1, 5, 9, 13) for a basic 4/4 pattern. 
                    This creates the foundation of most electronic music.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">2. Layer Your Hi-Hats</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use closed hi-hats on every other step (2, 4, 6, 8, etc.) and open hi-hats sparingly 
                    for accents. This creates rhythmic movement and groove.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">3. Offbeat Snares</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Place snares or claps on beats 2 and 4 (steps 5 and 13) for a classic backbeat. 
                    This works for house, techno, and most dance music.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">4. Use the "Less is More" Approach</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Don't fill every step. Space and silence are just as important as sound. 
                    Leave room for elements to breathe and create tension.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">5. Experiment with Swing</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try placing hi-hats slightly off-grid by using steps 2, 4, 6, 8 for straight feel, 
                    or 3, 7, 11, 15 for a shuffled, groovy feel.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">6. Frequency Layering</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Combine low-frequency elements (kick, sub-bass) with mid-range (snare, synths) 
                    and high-frequency sounds (hi-hats, cymbals) for a balanced mix.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">7. Master Effects Usage</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start with subtle master effects (reverb 10-20%, delay 10-30%). 
                    Too much reverb or delay can make your mix muddy.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">8. Filter Automation</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use the master filter to create builds and drops. Sweep from low to high frequency 
                    for tension, then open it up for the drop.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">9. Volume Balance</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Keep kick and bass prominent (80-100% volume), drums medium (60-80%), 
                    and melodic elements varied (40-70%) for dynamic interest.
                  </p>
                </div>

                <div className="p-4 border border-accent/20 rounded-lg bg-card/50">
                  <h4 className="font-semibold text-accent">10. Copy and Modify</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Use the copy button to duplicate tracks, then modify steps slightly. 
                    This creates variation while maintaining cohesion in your loop.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-primary">Genre-Specific Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><strong>House:</strong> 120-130 BPM, four-on-the-floor kick, offbeat hi-hats</li>
                  <li><strong>Techno:</strong> 125-135 BPM, driving kick, minimal percussion, filter sweeps</li>
                  <li><strong>Drum & Bass:</strong> 165-175 BPM, complex breakbeats, sub-bass focused</li>
                  <li><strong>Dubstep:</strong> 140 BPM (half-time feel), wobble bass, sparse drums</li>
                  <li><strong>Trap:</strong> 140-160 BPM, 808 bass, fast hi-hat rolls, triplet patterns</li>
                </ul>
              </div>
            </TabsContent>

            {/* Keyboard Shortcuts Tab */}
            <TabsContent value="shortcuts" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Keyboard className="w-5 h-5" />
                  Keyboard Shortcuts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Speed up your workflow with these keyboard shortcuts:
                </p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Space</div>
                    <div className="text-xs text-muted-foreground mt-1">Play / Pause</div>
                  </div>

                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Ctrl + Z</div>
                    <div className="text-xs text-muted-foreground mt-1">Undo</div>
                  </div>

                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Ctrl + Shift + Z</div>
                    <div className="text-xs text-muted-foreground mt-1">Redo</div>
                  </div>

                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Ctrl + Y</div>
                    <div className="text-xs text-muted-foreground mt-1">Redo (Alt)</div>
                  </div>

                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Ctrl + ↑</div>
                    <div className="text-xs text-muted-foreground mt-1">Increase BPM (+5)</div>
                  </div>

                  <div className="p-3 border border-border rounded-lg bg-card/30">
                    <div className="font-mono text-sm font-bold text-accent">Ctrl + ↓</div>
                    <div className="text-xs text-muted-foreground mt-1">Decrease BPM (-5)</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <h4 className="font-semibold text-primary">Workflow Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Space</kbd> to quickly toggle playback while editing</li>
                  <li>• <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd> is your friend - don't be afraid to experiment!</li>
                  <li>• Adjust BPM on the fly to find the perfect tempo for your loop</li>
                  <li>• Use Solo to isolate and perfect individual tracks</li>
                  <li>• Mute tracks to hear how elements work together</li>
                </ul>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};