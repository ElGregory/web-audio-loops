import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackSequencerProps {
  steps: boolean[];
  isPlaying: boolean;
  currentStep: number;
  onStepsChange: (steps: boolean[]) => void;
  onPlay: () => void;
  className?: string;
}

export const TrackSequencer = ({ 
  steps, 
  isPlaying, 
  currentStep, 
  onStepsChange, 
  onPlay,
  className 
}: TrackSequencerProps) => {
  const toggleStep = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = !newSteps[index];
    onStepsChange(newSteps);
  };

  const handleClear = () => {
    onStepsChange(new Array(steps.length).fill(false));
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPlay}
          className="h-7 px-2"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-7 px-2 text-xs"
        >
          Clear
        </Button>
        <span className="text-xs text-muted-foreground ml-auto">
          {steps.filter(Boolean).length}/{steps.length} steps
        </span>
      </div>
      
      <div className="grid grid-cols-8 gap-1">
        {steps.map((isActive, i) => (
          <button
            key={i}
            className={cn(
              "h-8 rounded border-2 transition-all text-xs font-bold",
              "hover:border-primary/50",
              isActive 
                ? "bg-primary border-primary text-primary-foreground" 
                : "bg-background border-border",
              currentStep === i && isPlaying && "ring-2 ring-accent"
            )}
            onClick={() => toggleStep(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};