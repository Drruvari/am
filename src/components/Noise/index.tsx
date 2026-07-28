import { useEffect, useRef } from "react";
import "./style.scss";

type NoiseProps = {
  className?: string;
  patternAlpha?: number;
  patternRefreshInterval?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternSize?: number;
};

export default function Noise({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  className = "",
}: NoiseProps) {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const size = Math.max(1, Math.round(patternSize));
    const refreshInterval = Math.max(0, Math.round(patternRefreshInterval));
    const alpha = Math.min(255, Math.max(0, patternAlpha));
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let animationId = 0;

    canvas.width = size;
    canvas.height = size;
    canvas.style.transform = `scale(${patternScaleX}, ${patternScaleY})`;

    const drawGrain = () => {
      const imageData = context.createImageData(size, size);
      const data = imageData.data;

      for (let index = 0; index < data.length; index += 4) {
        const value = Math.random() * 255;
        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = alpha;
      }

      context.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % refreshInterval === 0) drawGrain();
      frame += 1;
      animationId = window.requestAnimationFrame(loop);
    };

    drawGrain();
    if (!reducedMotion && refreshInterval > 0) loop();

    return () => window.cancelAnimationFrame(animationId);
  }, [
    patternAlpha,
    patternRefreshInterval,
    patternScaleX,
    patternScaleY,
    patternSize,
  ]);

  return (
    <canvas
      aria-hidden="true"
      className={`noise-overlay ${className}`}
      ref={grainRef}
    />
  );
}
