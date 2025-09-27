import { useEffect, useRef } from "react";

interface WaveformProps {
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  isPlaying?: boolean;
  className?: string;
}

export const Waveform = ({ audioContext, analyserNode, isPlaying, className }: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyserNode || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      analyserNode.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'hsl(var(--background))';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'hsl(var(--accent))';
      ctx.shadowColor = 'hsl(var(--accent))';
      ctx.shadowBlur = 10;

      ctx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Add frequency visualization
      analyserNode.getByteFrequencyData(dataArray);
      
      const barWidth = canvas.width / bufferLength * 2;
      let barX = 0;

      ctx.shadowBlur = 5;
      
      for (let i = 0; i < bufferLength / 4; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.3;
        
        const hue = (i / bufferLength) * 360;
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.6)`;
        
        ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
        barX += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isPlaying) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyserNode, isPlaying]);

  return (
    <div className="waveform-container">
      <canvas 
        ref={canvasRef}
        width={400}
        height={120}
        className={`w-full h-24 ${className}`}
      />
    </div>
  );
};