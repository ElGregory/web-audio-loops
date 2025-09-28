import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioParams } from "@/hooks/useAudioEngine";
import { Volume2, Zap, Filter } from "lucide-react";

interface SynthControlsProps {
  params: AudioParams;
  onParamsChange: (params: AudioParams) => void;
  onPlayNote: () => void;
  className?: string;
}

export const SynthControls = ({ params, onParamsChange, onPlayNote, className }: SynthControlsProps) => {
  const updateParam = <K extends keyof AudioParams>(key: K, value: AudioParams[K]) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <div className={`control-section ${className}`}>
      <div className="panel-header">
        <Zap className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold neon-text">Oscillator</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPlayNote}
          className="ml-auto bg-accent hover:bg-accent/80 text-accent-foreground"
        >
          Test
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Frequency</label>
          <Slider
            value={[params.frequency]}
            onValueChange={(value) => updateParam('frequency', value[0])}
            min={20}
            max={2000}
            step={1}
            className="w-20"
          />
          <span className="text-xs neon-text font-mono">{params.frequency}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Waveform</label>
          <Select value={params.waveform} onValueChange={(value: OscillatorType) => updateParam('waveform', value)}>
            <SelectTrigger className="w-24 h-8 text-xs bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sine">Sine</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="sawtooth">Saw</SelectItem>
              <SelectItem value="triangle">Triangle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Volume</label>
          <Slider
            value={[params.volume * 100]}
            onValueChange={(value) => updateParam('volume', value[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="w-20"
          />
          <span className="text-xs neon-text font-mono">{Math.round(params.volume * 100)}</span>
        </div>
      </div>

      <div className="panel-header">
        <Volume2 className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-primary">Envelope (ADSR)</h4>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Attack</label>
          <Slider
            value={[params.attack]}
            onValueChange={(value) => updateParam('attack', value[0])}
            min={1}
            max={1000}
            step={1}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{params.attack}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Decay</label>
          <Slider
            value={[params.decay]}
            onValueChange={(value) => updateParam('decay', value[0])}
            min={1}
            max={1000}
            step={1}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{params.decay}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Sustain</label>
          <Slider
            value={[params.sustain * 100]}
            onValueChange={(value) => updateParam('sustain', value[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{Math.round(params.sustain * 100)}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Release</label>
          <Slider
            value={[params.release]}
            onValueChange={(value) => updateParam('release', value[0])}
            min={1}
            max={2000}
            step={1}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{params.release}</span>
        </div>
      </div>

      <div className="panel-header">
        <Filter className="w-4 h-4 text-brass" />
        <h4 className="text-sm font-semibold text-brass">Filter & Effects</h4>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Filter Freq</label>
          <Slider
            value={[params.filterFreq]}
            onValueChange={(value) => updateParam('filterFreq', value[0])}
            min={20}
            max={8000}
            step={10}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{params.filterFreq}</span>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="text-xs text-muted-foreground font-medium">Filter Q</label>
          <Slider
            value={[params.filterQ]}
            onValueChange={(value) => updateParam('filterQ', value[0])}
            min={0.1}
            max={30}
            step={0.1}
            className="w-16"
          />
          <span className="text-xs neon-text font-mono">{params.filterQ.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};