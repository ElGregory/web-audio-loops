import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface SequencerProps {
  steps?: number;
  bpm?: number;
  onStepPlay?: (step: number, isActive: boolean) => void;
  className?: string;
}

export const Sequencer = ({ 
  steps = 8, 
  bpm = 120, 
  onStepPlay,
  className 
}: SequencerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(new Array(steps).fill(false));
  const intervalRef = useRef<number>();

  const stepDuration = (60 / bpm / 4) * 1000; // 16th notes

  useEffect(() => {
    if (isPlaying) {
      let step = 0;
      intervalRef.current = window.setInterval(() => {
        setCurrentStep(step);
        if (activeSteps[step] && onStepPlay) {
          onStepPlay(step, true);
        }
        step = (step + 1) % steps;
      }, stepDuration);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCurrentStep(-1);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, steps, stepDuration, activeSteps, onStepPlay]);

  const toggleStep = (index: number) => {
    const newActiveSteps = [...activeSteps];
    newActiveSteps[index] = !newActiveSteps[index];
    setActiveSteps(newActiveSteps);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  const handleClear = () => {
    setActiveSteps(new Array(steps).fill(false));
    setIsPlaying(false);
    setCurrentStep(-1);
  };

  return (
    <div className={cn("control-section", className)}>
      <div className="panel-header">
        <h3 className="text-lg font-bold neon-text">Step Sequencer</h3>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlay}
            className="bg-primary hover:bg-primary/80"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStop}
            className="bg-secondary hover:bg-secondary/80"
          >
            <Square className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-destructive hover:bg-destructive/80"
          >
            Clear
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: steps }, (_, i) => (
          <button
            key={i}
            className={cn(
              "sequencer-step",
              activeSteps[i] && "active",
              currentStep === i && "playing"
            )}
            onClick={() => toggleStep(i)}
          >
            <span className="text-xs font-bold">{i + 1}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        BPM: {bpm} | Pattern: {activeSteps.filter(Boolean).length}/{steps} steps active
      </div>
    </div>
  );
};