import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                Load Preset
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onLoad909Kit}>
                909 Drum Kit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLoadAcidTechno}>
                Acid Techno
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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