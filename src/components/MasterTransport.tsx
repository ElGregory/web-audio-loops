import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MasterTransportProps {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  stepsCount: number;
  onTogglePlay: () => void;
  onBpmChange: (bpm: number) => void;
  onLoad909Kit: () => void;
  onLoadAcidTechno: () => void;
  onLoadJungleGabber: () => void;
  onReset: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const MasterTransport = ({
  bpm,
  isPlaying,
  currentStep,
  stepsCount,
  onTogglePlay,
  onBpmChange,
  onLoad909Kit,
  onLoadAcidTechno,
  onLoadJungleGabber,
  onReset,
  children,
  className
}: MasterTransportProps) => {
  return (
    <div className={cn("control-section", className)}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          {isPlaying ? <Pause className="w-5 h-5 text-accent" /> : <Play className="w-5 h-5 text-accent" />}
          <h3 className="text-lg md:text-xl font-bold neon-text">Transport & Controls</h3>
        </div>
      </div>

      {/* Mobile-Optimized Transport Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Play Controls & BPM */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={onTogglePlay}
              variant={isPlaying ? "destructive" : "default"}
              size="lg"
              className="h-12 w-full sm:w-32 text-white font-bold text-base transition-all duration-200"
            >
              {isPlaying ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </>
              )}
            </Button>
            
            <div className="flex flex-col items-center gap-3 flex-1 w-full sm:max-w-xs">
              <Label htmlFor="bpm" className="text-sm font-medium">BPM</Label>
              <div className="flex items-center gap-3 w-full">
                <Slider
                  value={[bpm]}
                  onValueChange={(value) => onBpmChange(value[0])}
                  min={60}
                  max={200}
                  step={1}
                  className="flex-1 touch-pan-y"
                />
                <span className="text-lg neon-text font-mono bg-background/50 px-3 py-1 rounded min-w-16 text-center">
                  {bpm}
                </span>
              </div>
            </div>
          </div>

          {/* Step Counter */}
          <div className="text-center sm:text-left">
            <span className="text-sm text-muted-foreground bg-card/50 px-3 py-1 rounded">
              Step {currentStep + 1} of {stepsCount}
            </span>
          </div>
        </div>

        {/* Quick Pattern Loaders & Reset */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold text-primary">Quick Start Patterns</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button 
              onClick={onLoad909Kit} 
              variant="outline" 
              size="sm"
              className="h-12 text-sm bg-card/50 hover:bg-card border-brass text-brass hover:text-brass font-medium transition-all"
            >
              <span className="mr-2 text-lg">🥁</span>
              <div className="flex flex-col">
                <span>909 Drum Kit</span>
                <span className="text-xs opacity-75">Classic beats</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadAcidTechno} 
              variant="outline" 
              size="sm"
              className="h-12 text-sm bg-card/50 hover:bg-card border-primary text-primary hover:text-primary font-medium transition-all"
            >
              <span className="mr-2 text-lg">🎵</span>
              <div className="flex flex-col">
                <span>Acid Techno</span>
                <span className="text-xs opacity-75">Electronic loops</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadJungleGabber} 
              variant="outline" 
              size="sm"
              className="h-12 text-sm bg-card/50 hover:bg-card border-accent text-accent hover:text-accent font-medium transition-all"
            >
              <span className="mr-2 text-lg">⚡</span>
              <div className="flex flex-col">
                <span>Jungle/Gabber</span>
                <span className="text-xs opacity-75">Fast & hardcore</span>
              </div>
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="sm"
              className="h-12 text-sm bg-card/50 hover:bg-card border-destructive text-destructive hover:text-destructive font-medium transition-all"
            >
              <span className="mr-2 text-lg">🔄</span>
              <div className="flex flex-col">
                <span>Reset All</span>
                <span className="text-xs opacity-75">Clear everything</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Step Indicator */}
      <div className="grid grid-cols-16 gap-1 mb-4">
        {Array.from({ length: stepsCount }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-3 rounded-full transition-all duration-150",
              currentStep === i && isPlaying
                ? "bg-accent shadow-lg shadow-accent/50 scale-110"
                : "bg-border hover:bg-border/80"
            )}
          />
        ))}
      </div>

      {/* Live Visualization */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  );
};