import { useState } from "react";
import { Knob } from "./Knob";
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
        <Knob
          label="Frequency"
          value={params.frequency}
          onChange={(value) => updateParam('frequency', value)}
          min={20}
          max={2000}
          step={1}
        />
        
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

        <Knob
          label="Volume"
          value={params.volume * 100}
          onChange={(value) => updateParam('volume', value / 100)}
          min={0}
          max={100}
          step={1}
        />
      </div>

      <div className="panel-header">
        <Volume2 className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold text-primary">Envelope (ADSR)</h4>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Knob
          label="Attack"
          value={params.attack}
          onChange={(value) => updateParam('attack', value)}
          min={1}
          max={1000}
          step={1}
          size="sm"
        />
        
        <Knob
          label="Decay" 
          value={params.decay}
          onChange={(value) => updateParam('decay', value)}
          min={1}
          max={1000}
          step={1}
          size="sm"
        />
        
        <Knob
          label="Sustain"
          value={params.sustain * 100}
          onChange={(value) => updateParam('sustain', value / 100)}
          min={0}
          max={100}
          step={1}
          size="sm"
        />
        
        <Knob
          label="Release"
          value={params.release}
          onChange={(value) => updateParam('release', value)}
          min={1}
          max={2000}
          step={1}
          size="sm"
        />
      </div>

      <div className="panel-header">
        <Filter className="w-4 h-4 text-brass" />
        <h4 className="text-sm font-semibold text-brass">Filter & Effects</h4>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Knob
          label="Filter Freq"
          value={params.filterFreq}
          onChange={(value) => updateParam('filterFreq', value)}
          min={20}
          max={8000}
          step={10}
          size="sm"
        />
        
        <Knob
          label="Filter Q"
          value={params.filterQ}
          onChange={(value) => updateParam('filterQ', value)}
          min={0.1}
          max={30}
          step={0.1}
          size="sm"
        />
        
        <Knob
          label="Delay"
          value={params.delay * 1000}
          onChange={(value) => updateParam('delay', value / 1000)}
          min={0}
          max={500}
          step={1}
          size="sm"
        />
        
        <Knob
          label="Reverb"
          value={params.reverb * 100}
          onChange={(value) => updateParam('reverb', value / 100)}
          min={0}
          max={100}
          step={1}
          size="sm"
        />
      </div>
    </div>
  );
};