import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface KnobProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Knob = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  label,
  className,
  size = "md"
}: KnobProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  const normalizedValue = (value - min) / (max - min);
  const rotation = normalizedValue * 270 - 135; // -135 to +135 degrees

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-20 h-20"
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    startY.current = e.clientY;
    startValue.current = value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [value]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = startY.current - e.clientY;
    const sensitivity = (max - min) / 200;
    const newValue = Math.max(min, Math.min(max, startValue.current + deltaY * sensitivity));
    
    onChange(Math.round(newValue / step) * step);
  }, [isDragging, max, min, step, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className={cn("knob", sizeClasses[size], className)}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          className="knob-indicator"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
      </div>
      {label && (
        <span className="text-xs text-muted-foreground font-medium text-center">
          {label}
        </span>
      )}
      <span className="text-xs neon-text font-mono">
        {value.toFixed(step < 1 ? 1 : 0)}
      </span>
    </div>
  );
};