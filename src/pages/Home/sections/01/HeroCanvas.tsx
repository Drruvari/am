import { useEffect, useRef } from "react";
import * as THREE from "three";

type HeroCanvasProps = {
  image: string;
};

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 scale = vec2(1.0);

    if (screenAspect > imageAspect) {
      scale.y = imageAspect / screenAspect;
    } else {
      scale.x = screenAspect / imageAspect;
    }

    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 pointerOffset = (uPointer - 0.5) * 0.012;
    float flowA = sin(vUv.y * 18.0 + vUv.x * 5.0 + uTime * 0.65);
    float flowB = cos(vUv.x * 14.0 - vUv.y * 7.0 - uTime * 0.48);
    float flowC = sin((vUv.x + vUv.y) * 28.0 + uTime * 0.32);
    vec2 distortion = vec2(
      flowA * 0.0045 + flowC * 0.0015,
      flowB * 0.0035 + flowC * 0.0012
    );
    vec2 displacedUv = uv + distortion + pointerOffset;
    vec4 color = texture2D(uTexture, displacedUv);

    gl_FragColor = color;
  }
`;

export default function HeroCanvas({ image }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!container || reduceMotion) return;

    let renderer: THREE.WebGLRenderer | undefined;
    let frame = 0;
    let lastRenderTime = 0;
    let isVisible = true;
    let disposed = false;
    let bounds = { left: 0, top: 0, width: 1, height: 1 };
    const pointerTarget = new THREE.Vector2(0.5, 0.5);
    const timer = new THREE.Timer();
    timer.connect(document);
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      if (!renderer) return;
      const rect = container.getBoundingClientRect();
      bounds = rect;
      renderer.setSize(rect.width, rect.height, false);
      uniforms.uResolution.value.set(rect.width, rect.height);
    };

    const render = (timestamp?: number) => {
      if (!renderer || !isVisible || document.hidden) return;
      const currentTime = timestamp ?? performance.now();
      frame = window.requestAnimationFrame(render);
      if (currentTime - lastRenderTime < 1000 / 30) return;
      lastRenderTime = currentTime;
      timer.update(timestamp);
      uniforms.uTime.value = timer.getElapsed();
      uniforms.uPointer.value.lerp(pointerTarget, 0.06);
      renderer.render(scene, camera);
    };

    const startRendering = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(
        (event.clientX - bounds.left) / bounds.width,
        1 - (event.clientY - bounds.top) / bounds.height,
      );
    };

    const onVisibilityChange = () => {
      window.cancelAnimationFrame(frame);
      if (!document.hidden && isVisible) startRendering();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      window.cancelAnimationFrame(frame);
      if (isVisible && !document.hidden) startRendering();
    });

    const resizeObserver = new ResizeObserver(resize);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      image,
      async (sourceTexture) => {
        if (disposed) {
          sourceTexture.dispose();
          return;
        }

        let texture: THREE.Texture = sourceTexture;
        const sourceWidth = sourceTexture.image.width as number;
        const sourceHeight = sourceTexture.image.height as number;
        let textureWidth = sourceWidth;
        let textureHeight = sourceHeight;

        if (sourceWidth > 2048 && "createImageBitmap" in window) {
          try {
            const scale = 2048 / sourceWidth;
            const bitmap = await createImageBitmap(sourceTexture.image, {
              resizeWidth: 2048,
              resizeHeight: Math.round(sourceHeight * scale),
              resizeQuality: "high",
            });

            if (disposed) {
              bitmap.close();
              sourceTexture.dispose();
              return;
            }

            texture = new THREE.Texture(bitmap);
            texture.needsUpdate = true;
            textureWidth = bitmap.width;
            textureHeight = bitmap.height;
            sourceTexture.dispose();
          } catch {
            // Keep original texture when bitmap resizing is unavailable.
          }
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        uniforms.uTexture.value = texture;
        uniforms.uImageResolution.value.set(
          textureWidth,
          textureHeight,
        );
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(1);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.append(renderer.domElement);
        resize();
        resizeObserver.observe(container);
        observer.observe(container);
        container.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        document.addEventListener("visibilitychange", onVisibilityChange);
        startRendering();
      },
      undefined,
      () => {
        // Static hero image remains visible if WebGL texture loading fails.
      },
    );

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      const textureImage = uniforms.uTexture.value?.image;
      if (typeof ImageBitmap !== "undefined" && textureImage instanceof ImageBitmap) {
        textureImage.close();
      }
      uniforms.uTexture.value?.dispose();
      timer.dispose();
      geometry.dispose();
      material.dispose();
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [image]);

  return <div ref={containerRef} className="banner-canvas" aria-hidden="true" />;
}
