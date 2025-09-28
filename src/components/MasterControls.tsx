import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Filter, Zap } from "lucide-react";

export interface MasterSettings {
  masterVolume: number;
  masterFilterFreq: number;
  masterFilterQ: number;
  masterFilterType: "lowpass" | "highpass" | "bandpass" | "notch";
  masterDelay: number;
  masterReverb: number;
}

interface MasterControlsProps {
  settings: MasterSettings;
  onSettingsChange: (settings: MasterSettings) => void;
  className?: string;
}

export const MasterControls = ({ settings, onSettingsChange, className }: MasterControlsProps) => {
  console.log('MasterControls: Component rendered');
  const updateSetting = <K extends keyof MasterSettings>(key: K, value: MasterSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className={`control-section ${className}`}>
      <div className="panel-header">
        <Volume2 className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold neon-text">Master Controls</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border">
          <label className="text-sm font-medium text-center">Master Volume</label>
          <Slider
            value={[settings.masterVolume * 100]}
            onValueChange={(value) => updateSetting('masterVolume', value[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="w-full max-w-32 touch-pan-y"
          />
          <span className="text-sm neon-text font-mono bg-background/50 px-2 py-1 rounded">
            {Math.round(settings.masterVolume * 100)}
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border">
          <label className="text-sm font-medium text-center">Master Delay</label>
          <Slider
            value={[settings.masterDelay * 1000]}
            onValueChange={(value) => updateSetting('masterDelay', value[0] / 1000)}
            min={0}
            max={500}
            step={1}
            className="w-full max-w-32 touch-pan-y"
          />
          <span className="text-sm neon-text font-mono bg-background/50 px-2 py-1 rounded">
            {Math.round(settings.masterDelay * 1000)}
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border sm:col-span-2 lg:col-span-1">
          <label className="text-sm font-medium text-center">Master Reverb</label>
          <Slider
            value={[settings.masterReverb * 100]}
            onValueChange={(value) => updateSetting('masterReverb', value[0] / 100)}
            min={0}
            max={100}
            step={1}
            className="w-full max-w-32 touch-pan-y"
          />
          <span className="text-sm neon-text font-mono bg-background/50 px-2 py-1 rounded">
            {Math.round(settings.masterReverb * 100)}
          </span>
        </div>
      </div>

      <div className="panel-header">
        <Filter className="w-4 h-4 text-brass" />
        <h4 className="text-sm font-semibold text-brass">Master Filter</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border">
          <label className="text-sm font-medium text-center">Filter Type</label>
          <Select value={settings.masterFilterType} onValueChange={(value: "lowpass" | "highpass" | "bandpass" | "notch") => updateSetting('masterFilterType', value)}>
            <SelectTrigger className="w-full h-10 text-sm bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lowpass">Low Pass</SelectItem>
              <SelectItem value="highpass">High Pass</SelectItem>
              <SelectItem value="bandpass">Band Pass</SelectItem>
              <SelectItem value="notch">Notch</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border">
          <label className="text-sm font-medium text-center">Filter Frequency</label>
          <Slider
            value={[settings.masterFilterFreq]}
            onValueChange={(value) => updateSetting('masterFilterFreq', value[0])}
            min={20}
            max={20000}
            step={10}
            className="w-full touch-pan-y"
          />
          <span className="text-sm neon-text font-mono bg-background/50 px-2 py-1 rounded">
            {settings.masterFilterFreq}Hz
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-3 p-3 bg-card/30 rounded-lg border md:col-span-2 lg:col-span-2">
          <label className="text-sm font-medium text-center">Filter Resonance (Q)</label>
          <Slider
            value={[settings.masterFilterQ]}
            onValueChange={(value) => updateSetting('masterFilterQ', value[0])}
            min={0.1}
            max={30}
            step={0.1}
            className="w-full max-w-48 touch-pan-y"
          />
          <span className="text-sm neon-text font-mono bg-background/50 px-2 py-1 rounded">
            {settings.masterFilterQ.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
};