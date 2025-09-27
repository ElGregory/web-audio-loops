import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface MasterTransportProps {
  bpm: number;
  isPlaying: boolean;
  currentStep: number;
  stepsCount: number;
  onTogglePlay: () => void;
  onBpmChange: (bpm: number) => void;
  onLoadKit: () => void;
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
  onLoadKit,
  children,
  className
}: MasterTransportProps) => {
  return (
    <div className={cn("control-section", className)}>
      <div className="panel-header">
        <div className="flex items-center gap-2">
          {isPlaying ? <Pause className="w-5 h-5 text-accent" /> : <Play className="w-5 h-5 text-accent" />}
          <h3 className="text-lg font-bold neon-text">Master Transport</h3>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="bpm" className="text-sm">BPM:</Label>
            <Input
              id="bpm"
              type="number"
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value))}
              min={60}
              max={200}
              className="w-20 h-8 text-sm bg-background/50"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1}/{stepsCount}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLoadKit}
            className="h-8"
          >
            Load 909 Kit
          </Button>
          <Button
            onClick={onTogglePlay}
            variant={isPlaying ? "destructive" : "default"}
            className="h-8"
          >
            {isPlaying ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Step indicator */}
      <div className="grid grid-cols-16 gap-1 mt-4">
        {Array.from({ length: stepsCount }, (_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 rounded transition-all",
              currentStep === i && isPlaying
                ? "bg-accent"
                : "bg-border"
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