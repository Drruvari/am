import { useEffect, useRef } from "react";

const GRAIN_WIDTH = 1440;
const GRAIN_HEIGHT = 810;
const GRAIN_FRAME_COUNT = 8;
const FRAME_INTERVAL = 1000 / 10;

export default function Grain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const frames = Array.from({ length: GRAIN_FRAME_COUNT }, () => {
      const image = context.createImageData(GRAIN_WIDTH, GRAIN_HEIGHT);
      const pixels = new Uint32Array(image.data.buffer);

      for (let index = 0; index < pixels.length; index += 1) {
        const value = Math.floor(Math.random() * 256);
        pixels[index] =
          0xff000000 | (value << 16) | (value << 8) | value;
      }

      return image;
    });
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let frame = 0;
    let frameIndex = 0;
    let lastFrame = 0;

    const draw = (time = 0) => {
      if (time - lastFrame >= FRAME_INTERVAL || time === 0) {
        context.putImageData(frames[frameIndex], 0, 0);
        frameIndex = (frameIndex + 1) % frames.length;
        lastFrame = time;
      }

      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    draw();
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="site-grain"
      width={GRAIN_WIDTH}
      height={GRAIN_HEIGHT}
      aria-hidden="true"
    />
  );
}
