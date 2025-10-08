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
  onLoadJungle: () => void;
  onLoadDubstep: () => void;
  onLoadTrance: () => void;
  onLoadTrap: () => void;
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
  onLoadJungle,
  onLoadDubstep,
  onLoadTrance,
  onLoadTrap,
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
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">`
            <Button 
              onClick={onLoad909Kit} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-brass text-brass hover:text-brass font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">🥁</span>
                <span className="text-xs font-semibold">909 Drum Kit</span>
                <span className="text-[10px] opacity-75">Classic beats</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadAcidTechno} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-primary text-primary hover:text-primary font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">🎵</span>
                <span className="text-xs font-semibold">Acid Techno</span>
                <span className="text-[10px] opacity-75">Electronic loops</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadJungle} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-accent text-accent hover:text-accent font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">⚡</span>
                <span className="text-xs font-semibold">Jungle</span>
                <span className="text-[10px] opacity-75">Fast breakbeats</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadDubstep} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-purple-500 text-purple-400 hover:text-purple-300 font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">🔊</span>
                <span className="text-xs font-semibold">Dubstep</span>
                <span className="text-[10px] opacity-75">Wobble bass</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadTrance} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-cyan-500 text-cyan-400 hover:text-cyan-300 font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">✨</span>
                <span className="text-xs font-semibold">Trance</span>
                <span className="text-[10px] opacity-75">Supersaw</span>
              </div>
            </Button>
            <Button 
              onClick={onLoadTrap} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-orange-500 text-orange-400 hover:text-orange-300 font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">💥</span>
                <span className="text-xs font-semibold">Trap</span>
                <span className="text-[10px] opacity-75">808 bass</span>
              </div>
            </Button>
            <Button 
              onClick={onReset} 
              variant="outline" 
              size="sm"
              className="h-auto py-3 text-sm bg-card/50 hover:bg-card border-destructive text-destructive hover:text-destructive font-medium transition-all"
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="text-2xl">🔄</span>
                <span className="text-xs font-semibold">Reset All</span>
                <span className="text-[10px] opacity-75">Clear everything</span>
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